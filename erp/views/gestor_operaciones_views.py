from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import F
from ..models import Motonave, FichaServicio, HistorialServicio
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

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
                fecha_fin=fecha_nominacion.date(),
                estado_delServicio='Nominado',
                navegacion=''
            )
            ficha_servicio.save()

        # Obtener los detalles de las nuevas fichas de servicio
        servicios_data = [
            {
                'id': ficha.id,
                'numero_servicio': ficha.numero_servicio,
                'tipo_servicio': ficha.tipo_servicio,
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
        
        # Obtener todas las fichas de servicio relacionadas con la motonave
        fichas_servicio = FichaServicio.objects.filter(motonave=motonave)
        
        # Restablecer el estado de los elementos vinculados a "Disponible" en todas las fichas de servicio
        for ficha_servicio in fichas_servicio:
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')
        
        # Eliminar todas las fichas de servicio relacionadas con la motonave
        fichas_servicio.delete()
        
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
            fecha_fin=fecha_nominacion.date(),
            estado_delServicio='Nominado',
            navegacion=''
            
        )
        ficha_servicio.save()

        # Obtener los detalles de la nueva ficha de servicio
        servicio_data = {
            'id': ficha_servicio.id,
            'numero_servicio': ficha_servicio.numero_servicio,
            'tipo_servicio': ficha_servicio.tipo_servicio,
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
            
            # Verificar si la motonave tiene un solo servicio actual
            if motonave.cantidad_serviciosActual == 1:
                return JsonResponse({'error': 'No se puede eliminar el último servicio de la motonave.'}, status=400)
            
            # Verificar el estado de la ficha de servicio antes de eliminarla
            ficha_en_proceso = ficha_servicio.estado_delServicio == 'En Proceso'
            
            # Restablecer el estado de los elementos vinculados a "Disponible"
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')
            
            # Eliminar la ficha de servicio
            ficha_servicio.delete()
            
            # Obtener los servicios restantes de la motonave y ordenarlos por número de servicio
            servicios_restantes = FichaServicio.objects.filter(motonave=motonave).order_by('numero_servicio')
            
            # Actualizar la cantidad de servicios actual de la motonave
            motonave.cantidad_serviciosActual -= 1
            motonave.cantidad_serviciosHistorial -= 1
            
            # Verificar el estado de los servicios restantes de la motonave
            fichas_servicio_motonave = motonave.fichas_servicio.all()
            
            # Actualizar los números de servicio de manera consecutiva
            for i, servicio in enumerate(servicios_restantes, start=1):
                servicio.numero_servicio = i
                servicio.save()
            
            if fichas_servicio_motonave.exists():
                # Si aún hay servicios asociados a la motonave
                if all(ficha.estado_delServicio == 'Terminado' for ficha in fichas_servicio_motonave):
                    # Si todos los servicios restantes están terminados, cambiar el estado de la motonave a "Terminado"
                    motonave.estado_servicio = 'Terminado'
                else:
                    # Si aún hay servicios en proceso o nominados, mantener el estado de la motonave como "En Proceso" o "Nominado"
                    if any(ficha.estado_delServicio == 'En Proceso' for ficha in fichas_servicio_motonave):
                        motonave.estado_servicio = 'En Proceso'
                    else:
                        motonave.estado_servicio = 'Nominado'
            else:
                # Si no hay más servicios asociados a la motonave, cambiar el estado de la motonave a "Disponible"
                motonave.estado_servicio = 'Disponible'
                
                # Restablecer los demás campos de la motonave
                motonave.comentarioActual = ""
                motonave.puerto = ""
                motonave.prox_puerto = ""
                motonave.procedenciaCarga = ""
                motonave.armador = ""
                motonave.agencia = ""
            
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

#-----------------FINALIZAR SERVICIO INDIVIDUAL
@csrf_exempt
@login_required
def finalizar_servicio(request):
    if request.method == 'POST':
        servicio_id = request.POST.get('servicio_id')
        
        try:
            ficha_servicio = FichaServicio.objects.get(id=servicio_id)
            
            # Verificar si el servicio ya está finalizado
            if ficha_servicio.estado_delServicio == 'Terminado':
                return JsonResponse({'success': False, 'message': 'El servicio ya está finalizado.'})
            
            # Actualizar el estado del servicio a "Terminado"
            ficha_servicio.estado_delServicio = 'Terminado'
            ficha_servicio.save()
            
            # Restablecer el estado de los elementos vinculados a "Disponible"
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')
            
            # Obtener la motonave asociada a la ficha de servicio
            motonave = ficha_servicio.motonave
            
            # Verificar si todas las fichas de servicio de la motonave están finalizadas
            fichas_servicio_motonave = motonave.fichas_servicio.all()
            todas_finalizadas = all(ficha.estado_delServicio == 'Terminado' for ficha in fichas_servicio_motonave)
            
            if todas_finalizadas:
                # Si todas las fichas están finalizadas, cambiar el estado de la motonave a "Terminado"
                motonave.estado_servicio = 'Terminado'
            else:
                # Si aún hay fichas en proceso o nominadas, mantener el estado de la motonave como "En Proceso"
                motonave.estado_servicio = 'En Proceso'
            
            # Guardar los cambios en la motonave
            motonave.save()
            
            return JsonResponse({'success': True})
        
        except FichaServicio.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'El servicio especificado no existe.'})
    
    return JsonResponse({'success': False, 'message': 'Método no permitido.'})

#-------------------FILTRAR MOTONAVE POR ESTADO
@login_required
def renderizar_formulario(request):
    # Filtrar motonaves disponibles y obtener solo los nombres
    nombres_motonaves_disponibles = list(Motonave.objects.filter(estado_servicio='Disponible').values_list('nombre', flat=True))
    
    # Devolver los nombres de las motonaves disponibles como una respuesta JSON
    return JsonResponse({'nombres_motonaves_disponibles': nombres_motonaves_disponibles})

#-------------------ACTUALIZAR FECHA INICIO DE FAENA
@csrf_exempt
def actualizar_fecha_inicio_faena(request):
    if request.method == 'POST':
        servicio_id = request.POST.get('servicio_id')
        fecha_inicio_faena = request.POST.get('fecha_inicio_faena')

        if servicio_id and fecha_inicio_faena:
            try:
                ficha_servicio = get_object_or_404(FichaServicio, id=servicio_id)
                ficha_servicio.fecha_inicioFaena = fecha_inicio_faena
                ficha_servicio.save()
                return JsonResponse({'success': True})
            except FichaServicio.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'No se encontró la ficha de servicio.'})
        else:
            return JsonResponse({'success': False, 'message': 'Faltan parámetros requeridos.'})
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido.'})
    
#-------------------Finalizar Motonave
@csrf_exempt
@login_required
def finalizar_motonave(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombre_motonave')

        if nombre_motonave:
            try:
                motonave = Motonave.objects.get(nombre=nombre_motonave)
            except Motonave.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'La motonave especificada no existe.'})

            # Obtener las fichas de servicio asociadas a la motonave
            fichas_servicio = FichaServicio.objects.filter(motonave=motonave)

            # Crear entradas en la tabla HistorialServicio
            for ficha in fichas_servicio:
                historial_servicio = HistorialServicio(
                    numero_servicio=ficha.numero_servicio,
                    tipo_servicio=ficha.tipo_servicio,
                    motonave=motonave,
                    fecha_inicio_faena=ficha.fecha_inicioFaena,
                    fecha_fin=ficha.fecha_fin,
                )
                historial_servicio.save()

            # Finalizar la motonave
            motonave.estado_servicio = 'Disponible'
            motonave.save()

            # Eliminar las fichas de servicio asociadas a la motonave
            fichas_servicio.delete()

            # Resetear el numero_servicio de la motonave
            motonave.cantidad_serviciosActual = 0
            motonave.save()


            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'message': 'No se proporcionó el nombre de la motonave.'})
    else:
        return JsonResponse({'success': False, 'message': 'Método no permitido.'})

#-------------------Historial Servicios
@login_required
def historial_Servicio(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    historial_servicios = HistorialServicio.objects.all()

    context = {
        'nombre_usuario': nombre_usuario,
        'historial_servicios': historial_servicios
    }
    return render(request, 'html/historialServicio.html', context)    