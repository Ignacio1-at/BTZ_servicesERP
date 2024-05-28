from django.db import IntegrityError
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.db.models import F
from .models import Motonave, Personal, Especialidad, FichaServicio, Quimico, Vehiculo, Vario
from .forms import CustomLoginForm
from django.http import JsonResponse
from django.utils import timezone
from django.core import serializers
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse

def home(request):
    return render(request, 'html/home.html')

#--------------Login
def login_view(request):
    if request.user.is_authenticated:
        return redirect('erp:menu')

    if request.method == 'POST':
        form = CustomLoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('erp:menu')
            else:
                messages.error(request, "Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.")

    form = CustomLoginForm()
    return render(request, 'html/login.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    return redirect('erp:login')

#-----------------Menu
@login_required
def menu_view(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/menu.html', {'nombre_usuario': nombre_usuario})

#-----------------Gestor de Operaciones
@login_required
def gestorOperaciones(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"

    # Recuperar todas las motonaves de la base de datos
    motonaves = Motonave.objects.all()

    # Obtener las motonaves en formato JSON para usar en JavaScript
    motonaves_json = [{'nombre': motonave.nombre} for motonave in motonaves]

    # Obtener el nombre de la motonave desde la URL
    nombre_motonave = request.GET.get('nombre_motonave', None)

    open_modal = request.GET.get('open_modal', False)

    context = {
        'nombre_usuario': nombre_usuario,
        'motonaves': motonaves,
        'motonaves_json': motonaves_json,
        'open_modal': open_modal,
        'nombre_motonave': nombre_motonave,
    }

    return render(request, 'html/gestorOperaciones.html', context)

#-----------------Crear Motonaves
@login_required
def crear_motonave(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombreMotonave')
        cant_bodegas = request.POST.get('cantidadBodegas')

        if nombre_motonave and cant_bodegas:
            motonave = Motonave.objects.create(
                nombre=nombre_motonave,
                cantBodegas=cant_bodegas
            )

            # Redirigir a la página de gestión de operaciones
            return redirect('erp:gestor-operaciones')

    # En caso de que la solicitud no sea POST o falte algún campo, redirigir a la misma página
    return redirect('erp:gestor-operaciones')

#-------------------ELIMINAR Motonaves
@login_required
def eliminar_motonave(request):
    if request.method == 'POST':
        motonave_id = request.POST.get('motonaveId')
        try:
            motonave = Motonave.objects.get(id=motonave_id)
            motonave.delete()
            return JsonResponse({'mensaje': 'Motonave eliminada correctamente'})
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave no existe'}, status=404)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)

#-------------------EDITAR Motonaves
@require_POST
@login_required
def modificar_motonave(request):
    if request.method == 'POST':
        # Obtener los datos enviados desde el cliente
        motonave_id = request.POST.get('motonave_id')
        nombre_motonave = request.POST.get('nombre_motonave')
        cantidad_bodegas = request.POST.get('cantidad_bodegas')
        numero_viaje = request.POST.get('numero_viaje')

        try:
            # Obtener el objeto motonave
            motonave = Motonave.objects.get(id=motonave_id)

            # Actualizar los campos del objeto motonave
            motonave.nombre = nombre_motonave
            motonave.cantBodegas = cantidad_bodegas
            motonave.numero_viaje = numero_viaje

            # Guardar los cambios en la base de datos
            motonave.save()

            # Devolver una respuesta de éxito
            return JsonResponse({'success': True, 'message': 'Cambios guardados exitosamente'})

        except Motonave.DoesNotExist:
            # Si no se encuentra la motonave, devolver un error
            return JsonResponse({'success': False, 'message': 'La motonave no existe'}, status=404)

    else:
        # Si la solicitud no es POST, retornamos un error
        return JsonResponse({'success': False, 'message': 'Se espera una solicitud POST'})

#-------------------DETALLES MOTONAVES
@login_required
def obtener_detalles_motonave(request):
    if request.method == 'GET':
        nombre_motonave = request.GET.get('nombre_motonave')
        if nombre_motonave:
            try:
                motonave = Motonave.objects.get(nombre=nombre_motonave)
                detalles = {
                    'nombre': motonave.nombre,
                    'estado_servicio': motonave.estado_servicio,
                    'cant_bodegas': motonave.cantBodegas,
                    'fecha_modificacion': motonave.fecha_modificacion.strftime('%Y-%m-%d %H:%M:%S'),
                    'fecha_nominacion': motonave.fecha_nominacion.strftime('%Y-%m-%d'),
                    'cantidad_serviciosActual': motonave.cantidad_serviciosActual,
                    'viaje': motonave.numero_viaje,
                    'comentarioActual': motonave.comentarioActual,
                    'puerto' : motonave.puerto,
                    'proxPuerto' : motonave.prox_puerto,
                    'procedencia_carga' : motonave.procedenciaCarga,
                    'armador' : motonave.armador,
                    'agencia' : motonave.agencia,
                    'servicios': list(motonave.fichas_servicio.values('id', 'numero_servicio', 'tipo_servicio', 'fecha_inicioFaena', 'fecha_fin', 'estado_delServicio')),
                }
                return JsonResponse(detalles)
            except Motonave.DoesNotExist:
                return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)
        else:
            return JsonResponse({'error': 'El parámetro "nombre_motonave" es obligatorio en la solicitud GET.'}, status=400)
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo GET.'}, status=405)

#-------------------GUARDAR ESTADO DE MOTONAVES
@login_required
def guardar_nuevo_estado(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombre_motonave')
        nuevo_estado = request.POST.get('nuevo_estado')
        
        # Obtener la motonave
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'La motonave no existe.'}, status=404)
        
        # Actualizar el estado de la motonave
        motonave.estado_servicio = nuevo_estado
        motonave.save()
        
        return JsonResponse({'success': True, 'message': 'Estado actualizado correctamente.'})
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido.'}, status=405)
   
#-------------------GUARDAR COMENTARIOS
@login_required  
def guardar_comentarios(request):
    if request.method == 'POST':
        # Obtener los datos enviados en la solicitud POST
        nombre_motonave = request.POST.get('nombre_motonave')
        nuevo_comentario = request.POST.get('comentarioActual')

        # Buscar la instancia del modelo correspondiente en la base de datos
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            # Manejar el caso en el que la motonave no se encuentre en la base de datos
            return JsonResponse({'error': 'La motonave especificada no existe'}, status=404)

        # Actualizar la descripción de la motonave y guardar los cambios en la base de datos
        motonave.comentarioActual = nuevo_comentario
        motonave.save()

        # Devolver una respuesta JSON indicando que la descripción se ha guardado correctamente
        return JsonResponse({'mensaje': 'Comentario guardado correctamente'})

    else:
        # Manejar solicitudes de otros métodos HTTP
        return JsonResponse({'error': 'Método HTTP no permitido'}, status=405)        

#-------------------TABLERO MOTONAVES
@login_required
def obtener_tabla_motonaves(request):
    # Obtener los datos de la tabla de motonaves, por ejemplo, desde el modelo Motonave
    motonaves = Motonave.objects.all()

    # Construir una lista de diccionarios con los datos relevantes de cada motonave
    data = [{'nombre': motonave.nombre,
             'estado_servicio': motonave.estado_servicio,
             'cantBodegas': motonave.cantBodegas,
             'cantidad_serviciosHistorial': motonave.cantidad_serviciosHistorial,
             'cantidad_serviciosActual': motonave.cantidad_serviciosActual,
             'viaje': motonave.numero_viaje} for motonave in motonaves]

    # Devolver los datos como una respuesta JSON
    return JsonResponse(data, safe=False)

#-------------------CREAR SERVICIO
@login_required
@csrf_exempt
def crear_servicio(request):
    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre_motonave = request.POST.get('nombreMotonave')
        cantidad_servicios = int(request.POST.get('cantidadServicios'))
        numero_viaje = int(request.POST.get('numeroViaje'))  # Obtener el número de viaje del formulario
        
        # Obtener los valores de los nuevos campos del formulario
        puerto = request.POST.get('puerto')
        prox_puerto = request.POST.get('proxPuerto')
        procedenciaCarga = request.POST.get('procedenciaCarga')
        armador = request.POST.get('armador')
        agencia = request.POST.get('agencia')
        
        # Verificar si la motonave existe
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        # Verificar que la cantidad de servicios y el número de viaje sean números positivos
        if cantidad_servicios <= 0:
            return JsonResponse({'error': 'La cantidad de servicios debe ser un número positivo.'}, status=400)

        if numero_viaje <= 0:
            return JsonResponse({'error': 'El número de viaje debe ser un número positivo.'}, status=400)

        # Obtener la fecha de nominación actual
        fecha_nominacion = timezone.now()

        # Cambiar el estado de la motonave a "Nominado"
        motonave.estado_servicio = 'Nominado'
        
        # Actualizar la cantidad de servicios historial y actual de la motonave
        motonave.cantidad_serviciosHistorial += cantidad_servicios
        numero_servicio_inicio = motonave.cantidad_serviciosActual + 1  # El primer número de servicio nuevo
        motonave.cantidad_serviciosActual += cantidad_servicios  # Incrementar la cantidad de servicios actual
        motonave.numero_viaje = numero_viaje  # Asignar el número de viaje
        motonave.fecha_nominacion = fecha_nominacion  # Asignar la fecha de nominación
        motonave.puerto = puerto
        motonave.prox_puerto = prox_puerto
        motonave.procedenciaCarga = procedenciaCarga
        motonave.armador = armador
        motonave.agencia = agencia
        
        # Guardar la motonave
        motonave.save()

        # Crear las fichas de servicio relacionadas con la motonave
        for i in range(cantidad_servicios):
            ficha_servicio = FichaServicio(
                motonave=motonave,
                numero_servicio=numero_servicio_inicio + i,
                tipo_servicio='',
                fecha_inicioFaena=fecha_nominacion.date(),
                fecha_fin=fecha_nominacion.date(),
                estado_delServicio='Nominado'
            )
            ficha_servicio.save()

        # Obtener los detalles de las nuevas fichas de servicio
        servicios_data = [
            {
                'id': ficha.id,
                'numero_servicio': ficha.numero_servicio,
                'tipo_servicio': ficha.tipo_servicio,
                'fecha_inicioFaena': ficha.fecha_inicioFaena.strftime('%Y-%m-%d'),
                'estado_delServicio': ficha.estado_delServicio
            }
            for ficha in FichaServicio.objects.filter(motonave=motonave).order_by('-id')[:cantidad_servicios]
        ]

        return JsonResponse({'success': True, 'servicios': servicios_data})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)

#-------------------ELIMINAR SERVICIO
@login_required
def eliminar_servicio(request):
    if request.method == 'POST':
        # Obtener el nombre de la motonave del cuerpo de la solicitud
        nombre_motonave = request.POST.get('nombreMotonave')

        # Obtener la motonave
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        # Eliminar todas las fichas de servicio relacionadas con la motonave
        FichaServicio.objects.filter(motonave=motonave).delete()

        # Actualizar el estado de la motonave a "Disponible"
        motonave.estado_servicio = 'Disponible'
        # Restar la cantidad de servicios actual del historial
        motonave.cantidad_serviciosHistorial = F('cantidad_serviciosHistorial') - motonave.cantidad_serviciosActual
        # Restablecer la cantidad de servicios
        motonave.cantidad_serviciosActual = 0
        # Restablecer el comentario
        motonave.comentarioActual = ""
        # Restablecer el puerto
        motonave.puerto = ""
        # Restablecer el prox puerto
        motonave.prox_puerto = ""
        # Restablecer la procedencia 
        motonave.procedenciaCarga = ""
        # Restablecer el armador
        motonave.armador = ""
        # Restablecer la agencia
        motonave.agencia = ""
        # Guardar los cambios en la motonave
        motonave.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)

#-----------------CREAR SERVICIOS INDIVUALES
@login_required
@csrf_exempt
def crear_servicio_individual(request):
    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre_motonave = request.POST.get('nombre_motonave')

        # Verificar si la motonave existe
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        # Obtener la fecha de nominación actual
        fecha_nominacion = timezone.now()

        # Cambiar el estado de la motonave a "Nominado"
        motonave.estado_servicio = 'Nominado'

        # Actualizar la cantidad de servicios historial y actual de la motonave
        motonave.cantidad_serviciosHistorial += 1
        motonave.cantidad_serviciosActual += 1

        numero_servicio = motonave.cantidad_serviciosActual

        motonave.fecha_nominacion = fecha_nominacion  # Asignar la fecha de nominación

        # Guardar la motonave
        motonave.save()

        # Crear la ficha de servicio relacionada con la motonave
        ficha_servicio = FichaServicio(
            motonave=motonave,
            numero_servicio=numero_servicio,
            tipo_servicio='',
            fecha_inicioFaena=fecha_nominacion.date(),
            fecha_fin=fecha_nominacion.date(),
            estado_delServicio='Nominado'
        )
        ficha_servicio.save()

        # Obtener los detalles de la nueva ficha de servicio
        servicio_data = {
            'id': ficha_servicio.id,
            'numero_servicio': ficha_servicio.numero_servicio,
            'tipo_servicio': ficha_servicio.tipo_servicio,
            'fecha_inicioFaena': ficha_servicio.fecha_inicioFaena.strftime('%Y-%m-%d'),
            'estado_delServicio': ficha_servicio.estado_delServicio
        }

        return JsonResponse({'success': True, 'servicio': servicio_data})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)

#-------------------ELIMINAR SERVICIO INDIVIDUAL
@login_required
def eliminar_servicio_individual(request):
    if request.method == 'POST':
        servicio_id = request.POST.get('servicio_id')

        try:
            ficha_servicio = FichaServicio.objects.get(id=servicio_id)
            motonave = ficha_servicio.motonave

            # Eliminar la ficha de servicio
            ficha_servicio.delete()

            # Actualizar la cantidad de servicios actual de la motonave
            motonave.cantidad_serviciosActual -= 1
            motonave.cantidad_serviciosHistorial -= 1

            # Verificar si la cantidad de servicios actual es cero
            if motonave.cantidad_serviciosActual == 0:
                # Si no hay más servicios, actualizar el estado de la motonave a "Disponible"
                motonave.estado_servicio = 'Disponible'

            # Guardar los cambios en la motonave
            motonave.save()

            return JsonResponse({'success': True})

        except FichaServicio.DoesNotExist:
            return JsonResponse({'error': 'El servicio especificado no existe.'}, status=404)

    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)


#-------------------OBTENER SERVICIOS
@login_required
def obtener_servicios_motonave(request):
    if request.method == 'GET':
        nombre_motonave = request.GET.get('nombre_motonave')
        if nombre_motonave:
            try:
                motonave = Motonave.objects.get(nombre=nombre_motonave)
                servicios = motonave.fichas_servicio.values('id', 'numero_servicio', 'tipo_servicio', 'fecha_inicioFaena', 'fecha_fin', 'estado_delServicio')
                return JsonResponse(list(servicios), safe=False)
            except Motonave.DoesNotExist:
                return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)
        else:
            return JsonResponse({'error': 'El parámetro "nombre_motonave" es obligatorio en la solicitud GET.'}, status=400)
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo GET.'}, status=405)

#-------------------FILTRAR MOTONAVE POR ESTADO
@login_required
def renderizar_formulario(request):
    # Filtrar motonaves disponibles y obtener solo los nombres
    nombres_motonaves_disponibles = list(Motonave.objects.filter(estado_servicio='Disponible').values_list('nombre', flat=True))
    
    # Devolver los nombres de las motonaves disponibles como una respuesta JSON
    return JsonResponse({'nombres_motonaves_disponibles': nombres_motonaves_disponibles})

 #-----------------Ficha de Servicios

@login_required
def fichaOperaciones(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/fichaOperaciones.html', {'nombre_usuario': nombre_usuario})

 #-----------------Gestor Personal

#GESTOR PERSONAL
@login_required
def gestorPersonal(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    # Obtener todos los objetos de Personal desde la base de datos
    personal_objects = Personal.objects.all()
    # Pasar los objetos de Personal al contexto
    return render(request, 'html/gestorPersonal.html', {'personal_list': personal_objects,'nombre_usuario': nombre_usuario})

# -----------------Crear Personal
@login_required
def crear_personal(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        rut_sinDigito = request.POST.get('rut_SinDigito')
        digito_verificador = request.POST.get('digito_Verificador')
        cargo = request.POST.get('cargo')
        conductor = request.POST.get('conductor')
        tipo_licencia = request.POST.get('tipo_licencia')
        especialidades_seleccionadas = request.POST.getlist('especialidad[]')

        # Formatear el rut con el dígito verificador
        rut_formateado = f"{rut_sinDigito}-{digito_verificador}"

        # Crear una instancia del modelo Personal y guardarla en la base de datos
        personal = Personal(nombre=nombre, rut=rut_formateado, cargo=cargo, conductor=conductor, tipo_licencia=tipo_licencia)
        personal.save()

        # Obtener instancias de Especialidad correspondientes a los nombres proporcionados
        especialidades_seleccionadas_instancias = Especialidad.objects.filter(nombre__in=especialidades_seleccionadas)

        # Agregar las instancias de Especialidad al campo especialidades del objeto Personal
        personal.especialidades.add(*especialidades_seleccionadas_instancias)

        # Redirigir a la página de éxito o a donde sea necesario
        return redirect('erp:gestor-personal')

    # Si la solicitud no es POST, o la validación falla, devuelve una respuesta con un mensaje de error
    return JsonResponse({'success': False, 'message': 'La solicitud debe ser de tipo POST'}, status=400)

#-----------Verificar RUT
@login_required
def validar_rut(request):
    rut = request.GET.get('rut', None)
    if rut:
        try:
            # Verificar si el rut ya existe en la base de datos
            personal_existente = Personal.objects.get(rut=rut)
            return JsonResponse({'existe': True})
        except Personal.DoesNotExist:
            return JsonResponse({'existe': False})
    return JsonResponse({'existe': False})

#-------Eliminar Personal
@login_required  
def eliminar_personal(request, personal_id):
    personal = get_object_or_404(Personal, id=personal_id)
    personal.delete()
    return redirect('erp:gestor-personal')

#-------Obtener Personal
@csrf_exempt
@login_required
def obtener_personal(request):
    # Obtener el ID personal o el RUT de la solicitud
    personal_id = request.GET.get('personal_id')
    rut = request.GET.get('rut')

    if personal_id:
        try:
            personal = Personal.objects.filter(pk=personal_id)
            data = serializers.serialize('json', personal)
            return JsonResponse(data, safe=False)
        except Personal.DoesNotExist:
            return JsonResponse({'error': 'No se encontró información para el personal con ID proporcionado'}, status=404)
    elif rut:
        existe = Personal.objects.filter(rut=rut).exists()
        return JsonResponse({'duplicado': existe})
    else:
        return JsonResponse({'error': 'Se requiere proporcionar un ID de personal o un RUT'}, status=400)
    
#-------Obtener Especialidad X ID
@login_required
def obtener_nombres_especialidades(request):
    if request.method == 'GET':
        especialidades_ids = request.GET.getlist('especialidades_ids[]')  # Obtener los IDs de las especialidades desde la solicitud GET
        nombres_especialidades = []

        # Iterar sobre los IDs de las especialidades y obtener los nombres correspondientes
        for especialidad_id in especialidades_ids:
            try:
                especialidad = Especialidad.objects.get(pk=especialidad_id)
                nombres_especialidades.append(especialidad.nombre)
            except Especialidad.DoesNotExist:
                nombres_especialidades.append('Especialidad no encontrada')

        # Creamos un diccionario con la respuesta JSON
        response_data = {
            'nombres_especialidades': nombres_especialidades
        }
    
        return JsonResponse(nombres_especialidades, safe=False)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)
 
#-------Obtener Lista Especialidad
@login_required    
def obtener_lista_especialidades(request):
    # Obtener todas las especialidades de la base de datos
    especialidades = Especialidad.objects.all()
    
    # Crear una lista de diccionarios con el ID y el nombre de cada especialidad
    lista_especialidades = [{'id': especialidad.id, 'nombre': especialidad.nombre} for especialidad in especialidades]
    
    # Devolver la lista de especialidades como una respuesta JSON
    return JsonResponse({'especialidades': lista_especialidades})

#-------Actualizar Informacion PERSONAL
@require_POST
@login_required    
def actualizar_informacion_personal(request):
    if request.method == 'POST':
        # Obtener los datos enviados desde el cliente
        nombre = request.POST.get('nombre')
        rut = request.POST.get('rut')
        cargo = request.POST.get('cargo')
        conductor = request.POST.get('conductor')
        tipo_licencia = request.POST.get('tipo_licencia')
        especialidades = request.POST.getlist('especialidades[]')  # Obtener la lista de especialidades

        try:
            # Obtener el objeto personal
            personal_id = request.POST.get('personal_id')
            personal = Personal.objects.get(id=personal_id)

            # Actualizar los campos del objeto personal
            personal.nombre = nombre
            personal.rut = rut
            personal.cargo = cargo
            personal.conductor = conductor
            personal.tipo_licencia = tipo_licencia

            # Eliminar todas las especialidades actuales y agregar las nuevas
            personal.especialidades.clear()
            for especialidad_id in especialidades:
                personal.especialidades.add(especialidad_id)

            # Guardar los cambios en la base de datos
            personal.save()

            # Devolver una respuesta de éxito
            return JsonResponse({'message': 'Cambios guardados exitosamente'})

        except Personal.DoesNotExist:
            # Si no se encuentra el personal, devolver un error
            return JsonResponse({'error': 'El personal no existe'}, status=404)

    else:
        # Si la solicitud no es POST, retornamos un error
        return JsonResponse({'error': 'Se espera una solicitud POST'})

#-----------------Gestor Inventario
@login_required
def gestorInventario(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"

    # Obtener todos los objetos de Químico desde la base de datos
    quimico_objects = Quimico.objects.all()
    # Obtener todos los objetos de Vehículo desde la base de datos
    vehiculo_objects = Vehiculo.objects.all()
    # Obtener todos los objetos de Varios desde la base de datos
    vario_objects = Vario.objects.all()
    # Pasar los objetos de Químico, Vehículo y Varios al contexto
    return render(request, 'html/gestorInventario.html', {'quimico_list': quimico_objects, 'vehiculo_list': vehiculo_objects, 'vario_list': vario_objects, 'nombre_usuario': nombre_usuario})

#-----------------Agregar Quimico
@login_required
def agregar_quimico(request):
    if request.method == 'POST':
        tipo_quimico = request.POST.get('tipoQuimico')
        fecha_ingreso = request.POST.get('fechaIngreso')
        litros_ingreso = request.POST.get('litrosIngreso')
        numero_factura = request.POST.get('numFactura')

        if tipo_quimico and fecha_ingreso and litros_ingreso and numero_factura:
            Quimico.objects.create(
                tipo_quimico=tipo_quimico,
                fecha_ingreso=fecha_ingreso,
                litros_ingreso=litros_ingreso,
                numero_factura=numero_factura,
            )
            # Redirigir a la página de gestión de inventario
            return redirect('erp:gestor-inventario')

    # En caso de que la solicitud no sea POST o falte algún campo, redirigir a la misma página
    return redirect('erp:gestor-inventario')

#-----------------Agregar Vehiculo
@login_required
def agregar_vehiculo(request):
    if request.method == 'POST':
        marca = request.POST.get('marca')
        modelo = request.POST.get('modelo')
        color = request.POST.get('color')
        numero_motor = request.POST.get('numero_motor')
        numero_chasis = request.POST.get('numero_chasis')
        cilindrada = request.POST.get('cilindrada')
        tipo_vehiculo = request.POST.get('tipo_vehiculo')
        tipo_combustible = request.POST.get('tipo_combustible')
        primer_ingreso = request.POST.get('primer_ingreso')
        patente = request.POST.get('patente')
        fecha_permiso_circulacion = request.POST.get('fecha_permiso_circulacion')
        fecha_soap = request.POST.get('fecha_soap')
        fecha_revision_tecnica = request.POST.get('fecha_revision_tecnica')
        seguro_nombre = request.POST.get('seguro_nombre')
        seguro_poliza = request.POST.get('seguro_poliza')

        if (marca and modelo and color and numero_motor and numero_chasis and cilindrada and
            tipo_vehiculo and tipo_combustible and primer_ingreso and patente and
            fecha_permiso_circulacion and fecha_soap and fecha_revision_tecnica and
            seguro_nombre and seguro_poliza):

            Vehiculo.objects.create(
                marca=marca,
                modelo=modelo,
                color=color,
                numero_motor=numero_motor,
                numero_chasis=numero_chasis,
                cilindrada=cilindrada,
                tipo_vehiculo=tipo_vehiculo,
                tipo_combustible=tipo_combustible,
                primer_ingreso=primer_ingreso,
                patente=patente,
                fecha_permiso_circulacion=fecha_permiso_circulacion,
                fecha_soap=fecha_soap,
                fecha_revision_tecnica=fecha_revision_tecnica,
                seguro_nombre=seguro_nombre,
                seguro_poliza=seguro_poliza
            )
            # Redirigir a la página de gestión de inventario
            return redirect(reverse('erp:gestor-inventario') + '?lastVisitedTab=tablaVehiculo')

    # En caso de que la solicitud no sea POST o falte algún campo, redirigir a la misma página
    return redirect('erp:gestor-inventario')

#---------------Valida campo UNICO EN VEHICULO.
@login_required
def validar_campo_unicoVehiculo(request):
    if request.method == 'POST':
        valor = request.POST.get('valor')
        campo = request.POST.get('campo')
        print("Campo:", campo)  # Agregar print statement
        print("Valor:", valor)  # Agregar print statement

        if campo == 'numero_motor':
            existe = Vehiculo.objects.filter(numero_motor=valor).exists()
        elif campo == 'numero_chasis':
            existe = Vehiculo.objects.filter(numero_chasis=valor).exists()
        elif campo == 'patente':
            existe = Vehiculo.objects.filter(patente=valor).exists()
        else:
            existe = False

        print("Existe:", existe)  # Agregar print statement
        return JsonResponse({'existe': existe})

    return JsonResponse({'error': 'Método no permitido'})

#-------------Validar campo UNICO EN VEHICULO CAMBIO.
@login_required
@csrf_exempt
def validar_campo_unico_vehiculoCambio(request):
    if request.method == 'POST':
        valor = request.POST.get('valor')
        campo = request.POST.get('campo')
        vehiculo_id = request.POST.get('vehiculo_id')

        try:
            # Excluir el vehículo actual de la validación
            vehiculos = Vehiculo.objects.exclude(id=vehiculo_id)

            if campo == 'numero_motor':
                existe = vehiculos.filter(numero_motor=valor).exists()
            elif campo == 'numero_chasis':
                existe = vehiculos.filter(numero_chasis=valor).exists()
            elif campo == 'patente':
                existe = vehiculos.filter(patente=valor).exists()
            else:
                existe = False

            return JsonResponse({'existe': existe})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Método no permitido'}, status=400)

#-----------------Obtener detalles de VEHICULO
@login_required
def obtener_detalle_vehiculo(request):
    vehiculo_id = request.GET.get('vehiculo_id')

    if vehiculo_id:
        try:
            vehiculo = Vehiculo.objects.get(pk=vehiculo_id)
            # Aquí puedes serializar el objeto vehículo a JSON o devolver los datos de otra manera que prefieras
            data = {
                'id': vehiculo.id,
                'marca': vehiculo.marca,
                'modelo': vehiculo.modelo,
                'color': vehiculo.color,
                'numero_motor': vehiculo.numero_motor,
                'numero_chasis': vehiculo.numero_chasis,
                'cilindrada': vehiculo.cilindrada,
                'tipo_vehiculo': vehiculo.tipo_vehiculo,
                'primer_ingreso': vehiculo.primer_ingreso.strftime('%Y-%m-%d'), # Convierte el objeto DateField a cadena en formato YYYY-MM-DD
                'patente': vehiculo.patente,
                'fecha_permiso_circulacion': vehiculo.fecha_permiso_circulacion.strftime('%Y-%m-%d'), # Convierte el objeto DateField a cadena en formato YYYY-MM-DD
                'fecha_soap': vehiculo.fecha_soap.strftime('%Y-%m-%d'), # Convierte el objeto DateField a cadena en formato YYYY-MM-DD
                'fecha_revision_tecnica': vehiculo.fecha_revision_tecnica.strftime('%Y-%m-%d'), # Convierte el objeto DateField a cadena en formato YYYY-MM-DD
                'seguro_nombre': vehiculo.seguro_nombre,
                'seguro_poliza': vehiculo.seguro_poliza,
                'tipo_combustible': vehiculo.tipo_combustible,
                'estado': vehiculo.estado,
            }
            return JsonResponse(data)
        except Vehiculo.DoesNotExist:
            return JsonResponse({'error': 'No se encontró información para el vehículo con el ID proporcionado'}, status=404)
    else:
        return JsonResponse({'error': 'Se requiere proporcionar un ID de vehículo'}, status=400)

#-----------------GUARDAR CAMBIOS DE VEHICULO
@login_required
@csrf_exempt
def guardar_cambios_vehiculo(request):
    if request.method == 'POST':
        vehiculo_id = request.POST.get('vehiculo_id')
        marca = request.POST.get('marca')
        modelo = request.POST.get('modelo')
        color = request.POST.get('color')
        numero_motor = request.POST.get('numero_motor')
        numero_chasis = request.POST.get('numero_chasis')
        cilindrada = request.POST.get('cilindrada')
        tipo_vehiculo = request.POST.get('tipo_vehiculo')
        primer_ingreso = request.POST.get('primer_ingreso')
        patente = request.POST.get('patente')
        fecha_permiso_circulacion = request.POST.get('fecha_permiso_circulacion')
        fecha_soap = request.POST.get('fecha_soap')
        fecha_revision_tecnica = request.POST.get('fecha_revision_tecnica')
        seguro_nombre = request.POST.get('seguro_nombre')
        seguro_poliza = request.POST.get('seguro_poliza')
        tipo_combustible = request.POST.get('tipo_combustible')

        try:
            vehiculo = Vehiculo.objects.get(id=vehiculo_id)
            vehiculo.marca = marca
            vehiculo.modelo = modelo
            vehiculo.color = color
            vehiculo.numero_motor = numero_motor
            vehiculo.numero_chasis = numero_chasis
            vehiculo.cilindrada = cilindrada
            vehiculo.tipo_vehiculo = tipo_vehiculo
            vehiculo.primer_ingreso = primer_ingreso
            vehiculo.patente = patente
            vehiculo.fecha_permiso_circulacion = fecha_permiso_circulacion
            vehiculo.fecha_soap = fecha_soap
            vehiculo.fecha_revision_tecnica = fecha_revision_tecnica
            vehiculo.seguro_nombre = seguro_nombre
            vehiculo.seguro_poliza = seguro_poliza
            vehiculo.tipo_combustible = tipo_combustible

            try:
                vehiculo.save()
                return JsonResponse({'success': True})
            except IntegrityError as e:
                if 'numero_motor' in str(e):
                    return JsonResponse({'success': False, 'field': 'numero_motor', 'message': 'El número de motor ya existe'})
                elif 'numero_chasis' in str(e):
                    return JsonResponse({'success': False, 'field': 'numero_chasis', 'message': 'El número de chasis ya existe'})
                elif 'patente' in str(e):
                    return JsonResponse({'success': False, 'field': 'patente', 'message': 'La patente ya existe'})
                else:
                    return JsonResponse({'success': False, 'message': 'Error al guardar los cambios del vehículo'})

        except Vehiculo.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'El vehículo no existe'})

    return JsonResponse({'success': False, 'message': 'Método no permitido'})
#-----------------Agregar Vario
@login_required
@csrf_exempt
def agregar_vario(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        fecha_ingreso = request.POST.get('fecha_ingreso')

        if nombre and fecha_ingreso:
            Vario.objects.create(
                nombre=nombre,
                fecha_ingreso=fecha_ingreso
            )
            # Redirigir a la página de gestión de inventario
            return redirect(reverse('erp:gestor-inventario') + '?lastVisitedTab=tablaVarios')

    # En caso de que la solicitud no sea POST o falte algún campo, redirigir a la misma página
    return redirect('erp:gestor-inventario')

#------------------Eliminar Quimico
@login_required
def eliminar_quimico(request, quimico_id):
    # Obtener el objeto Quimico correspondiente al ID
    quimico = get_object_or_404(Quimico, id=quimico_id)

    # Eliminar el objeto Quimico
    quimico.delete()

    # Devolver una respuesta JSON indicando que el objeto se ha eliminado correctamente
    return redirect('erp:gestor-inventario')

#-------------------Eliminar Vehiculo
@login_required
def eliminar_vehiculo(request, vehiculo_id):
    # Obtener el objeto Vehiculo correspondiente al ID
    vehiculo = get_object_or_404(Vehiculo, id=vehiculo_id)

    # Eliminar el objeto Vehiculo
    vehiculo.delete()

    # Redirigir a la página del gestor de inventario
    return redirect(reverse('erp:gestor-inventario') + '?lastVisitedTab=tablaVehiculo')

#------------------------Eliminar Vario
@login_required
def eliminar_vario(request, vario_id):
    # Obtener el objeto Vario correspondiente al ID
    vario = get_object_or_404(Vario, id=vario_id)

    # Eliminar el objeto Vario
    vario.delete()

    # Redirigir a la página del gestor de inventario
    return redirect(reverse('erp:gestor-inventario') + '?lastVisitedTab=tablaVarios')

#-------------------------Obtener detalles VARIO
@login_required
def obtener_detalles_vario(request):
    if request.method == 'GET':
        vario_id = request.GET.get('varioId')
        if vario_id:
            try:
                vario = Vario.objects.get(id=vario_id)
                detalle = {
                    'id': vario.id,
                    'nombre': vario.nombre,
                    'fecha_ingreso': vario.fecha_ingreso.strftime('%Y-%m-%d'),
                    'estado': vario.estado,
                }
                return JsonResponse(detalle)
            except Vario.DoesNotExist:
                return JsonResponse({'error': 'El vario especificado no existe.'}, status=404)
        else:
            return JsonResponse({'error': 'El parámetro "varioId" es obligatorio en la solicitud GET.'}, status=400)
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo GET.'}, status=405)

#----------------------ACTUALIZAR VARIO
@csrf_exempt
@login_required
def actualizar_vario(request):
    if request.method == 'POST':
        vario_id = request.POST.get('vario_id')
        if vario_id:
            nombre = request.POST.get('nombre')
            fecha_ingreso = request.POST.get('fecha_ingreso')

            if nombre and fecha_ingreso:
                try:
                    vario = Vario.objects.get(id=vario_id)
                    vario.nombre = nombre
                    vario.fecha_ingreso = fecha_ingreso
                    vario.save()
                    return JsonResponse({'message': 'Cambios guardados exitosamente'})
                except Vario.DoesNotExist:
                    return JsonResponse({'error': 'El vario no existe'}, status=404)
            else:
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)
        else:
            return JsonResponse({'error': 'El parámetro "vario_id" es obligatorio en la solicitud POST.'}, status=400)
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'}, status=405)

#-------------------------Obtener detalles QUIMICO
@login_required
def obtener_detalles_quimico(request):
    if request.method == 'GET':
        quimico_id = request.GET.get('quimicoId')
        if quimico_id:
            try:
                quimico = Quimico.objects.get(id=quimico_id)
                quimico_data = {
                    'id': quimico.id,
                    'tipo_quimico': quimico.tipo_quimico,
                    'fecha_ingreso': quimico.fecha_ingreso.strftime('%Y-%m-%d'),
                    'numero_factura': quimico.numero_factura,
                    'litros_ingreso': quimico.litros_ingreso,
                    'estado': quimico.estado,
                }
                return JsonResponse(quimico_data)
            except Quimico.DoesNotExist:
                return JsonResponse({'error': 'Químico no encontrado'}, status=404)
        else:
            return JsonResponse({'error': 'El parámetro "quimicoId" es obligatorio en la solicitud GET.'}, status=400)
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo GET.'}, status=405)

#--------------------------GUARDAR CAMBIOS QUIMICOS
@csrf_exempt
@login_required
def guardar_cambios_quimico(request):
    if request.method == 'POST':
        quimico_id = request.POST.get('quimico_id')
        if quimico_id:
            tipo_quimico = request.POST.get('tipo_quimico')
            fecha_ingreso = request.POST.get('fecha_ingreso')
            numero_factura = request.POST.get('numero_factura')
            litros_ingreso = request.POST.get('litros_ingreso')
            
            if tipo_quimico and fecha_ingreso and numero_factura and litros_ingreso:
                try:
                    quimico = Quimico.objects.get(id=quimico_id)
                    quimico.tipo_quimico = tipo_quimico
                    quimico.fecha_ingreso = fecha_ingreso
                    quimico.numero_factura = numero_factura
                    quimico.litros_ingreso = litros_ingreso
                    quimico.save()
                    return JsonResponse({'message': 'Cambios guardados exitosamente'})
                except Quimico.DoesNotExist:
                    return JsonResponse({'error': 'El quimico no existe'}, status=404)
            else:
                return JsonResponse({'error': 'Todos los campos son obligatorios'}, status=400)
        else:
            return JsonResponse({'error': 'El parámetro "vario_id" es obligatorio en la solicitud POST.'}, status=400)
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'}, status=405)

#-------------------Ficha Servicio especifica x id
@login_required
def ficha_servicio(request, servicio_id):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"

    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        motonave = ficha_servicio.motonave

        # Obtener los datos para mostrar en el formulario de nominación
        personal = Personal.objects.all()
        vehiculos = Vehiculo.objects.all()
        quimicos = Quimico.objects.all()
        varios = Vario.objects.all()

        context = {
            'ficha_servicio': ficha_servicio,
            'motonave': motonave,
            'nombre_usuario': nombre_usuario,
            'personal': personal,
            'vehiculos': vehiculos,
            'quimicos': quimicos,
            'varios': varios
        }

        return render(request, 'html/fichaServicio.html', context)

    except FichaServicio.DoesNotExist:
        # Manejar el caso en que no se encuentre la ficha de servicio
        context = {
            'nombre_usuario': nombre_usuario
        }
        return render(request, 'html/fichaServicio.html', context)
    
#-------------------Actualizar Ficha Servicio x ID. 
@login_required
def actualizar_ficha_servicio_por_id(request, servicio_id):
    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        if request.method == 'POST':
            tipo_servicio = request.POST.get('tipo_servicio')
            fecha_arribo_cuadrilla = request.POST.get('fecha_arribo_cuadrilla')
            bodegas_a_realizar = request.POST.get('bodegas_a_realizar')
            hospedaje_desayuno = request.POST.get('hospedaje_desayuno')
            lancha_grua = request.POST.get('lancha_grua')
            arriendo_bomba = request.POST.get('arriendo_bomba')
            navegacion = request.POST.get('navegacion')
            
            # Obtener los IDs de los elementos nominados desde el formulario
            personal_ids_str = request.POST.get('personal_nominado', '')
            vehiculo_ids_str = request.POST.get('vehiculos_nominados', '')
            quimico_ids_str = request.POST.get('quimicos_nominados', '')
            vario_ids_str = request.POST.get('varios_nominados', '')
            
            # Convertir cada ID individual a un número entero
            personal_ids = [int(id) for ids in personal_ids_str.split(',') for id in ids.split() if id.isdigit()]
            vehiculo_ids = [int(id) for ids in vehiculo_ids_str.split(',') for id in ids.split() if id.isdigit()]
            quimico_ids = [int(id) for ids in quimico_ids_str.split(',') for id in ids.split() if id.isdigit()]
            vario_ids = [int(id) for ids in vario_ids_str.split(',') for id in ids.split() if id.isdigit()]
            
            # Actualizar los campos de la ficha de servicio
            ficha_servicio.tipo_servicio = tipo_servicio
            ficha_servicio.fecha_arribo_cuadrilla = fecha_arribo_cuadrilla
            ficha_servicio.bodegas_a_realizar = bodegas_a_realizar
            ficha_servicio.hospedaje_desayuno = hospedaje_desayuno
            ficha_servicio.lancha_grua = lancha_grua
            ficha_servicio.arriendo_bomba = arriendo_bomba
            ficha_servicio.navegacion = navegacion
            
            # Actualizar las nominaciones en la ficha de servicio
            ficha_servicio.personal_nominado.set(personal_ids)
            ficha_servicio.vehiculos_nominados.set(vehiculo_ids)
            ficha_servicio.quimicos_nominados.set(quimico_ids)
            ficha_servicio.varios_nominados.set(vario_ids)

            # Guardar los cambios en la ficha de servicio
            ficha_servicio.save()

            messages.success(request, 'La ficha de servicio se ha actualizado correctamente.')

            # Obtener el nombre de la motonave
            nombre_motonave = ficha_servicio.motonave.nombre

            url = reverse('erp:gestor-operaciones') + '?open_modal=true&nombre_motonave=' + nombre_motonave
            return redirect(url)

    except FichaServicio.DoesNotExist:
        messages.error(request, 'No se encontró la ficha de servicio.')

    return redirect('erp:gestor-operaciones')