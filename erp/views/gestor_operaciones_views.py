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

    motonaves = Motonave.objects.all()

    motonaves_json = [{'nombre': motonave.nombre} for motonave in motonaves]

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

            return redirect('erp:gestor-operaciones')

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
        motonave_id = request.POST.get('motonave_id')
        nombre_motonave = request.POST.get('nombre_motonave')
        cantidad_bodegas = request.POST.get('cantidad_bodegas')
        numero_viaje = request.POST.get('numero_viaje')

        try:
            motonave = Motonave.objects.get(id=motonave_id)

            motonave.nombre = nombre_motonave
            motonave.cantBodegas = cantidad_bodegas
            motonave.numero_viaje = numero_viaje

            motonave.save()

            return JsonResponse({'success': True, 'message': 'Cambios guardados exitosamente'})

        except Motonave.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'La motonave no existe'}, status=404)

    else:
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
        nombre_motonave = request.POST.get('nombre_motonave')
        nuevo_comentario = request.POST.get('comentarioActual')

        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe'}, status=404)

        motonave.comentarioActual = nuevo_comentario
        motonave.save()

        return JsonResponse({'mensaje': 'Comentario guardado correctamente'})

    else:
        return JsonResponse({'error': 'Método HTTP no permitido'}, status=405)        

#-------------------TABLERO MOTONAVES
@login_required
def obtener_tabla_motonaves(request):
    motonaves = Motonave.objects.all()

    data = [{'nombre': motonave.nombre,
             'estado_servicio': motonave.estado_servicio,
             'cantBodegas': motonave.cantBodegas,
             'cantidad_serviciosHistorial': motonave.cantidad_serviciosHistorial,
             'cantidad_serviciosActual': motonave.cantidad_serviciosActual,
             'viaje': motonave.numero_viaje} for motonave in motonaves]

    return JsonResponse(data, safe=False)

#-------------------CREAR SERVICIO
@login_required
@csrf_exempt
def crear_servicio(request):
    if request.method == 'POST':

        nombre_motonave = request.POST.get('nombreMotonave')
        cantidad_servicios = int(request.POST.get('cantidadServicios'))
        numero_viaje = int(request.POST.get('numeroViaje'))
        

        puerto = request.POST.get('puerto')
        prox_puerto = request.POST.get('proxPuerto')
        procedenciaCarga = request.POST.get('procedenciaCarga')
        armador = request.POST.get('armador')
        agencia = request.POST.get('agencia')
        

        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)


        if cantidad_servicios <= 0:
            return JsonResponse({'error': 'La cantidad de servicios debe ser un número positivo.'}, status=400)

        if numero_viaje <= 0:
            return JsonResponse({'error': 'El número de viaje debe ser un número positivo.'}, status=400)


        fecha_nominacion = timezone.now()

        motonave.estado_servicio = 'Nominado'
        

        motonave.cantidad_serviciosHistorial += cantidad_servicios
        numero_servicio_inicio = motonave.cantidad_serviciosActual + 1 
        motonave.cantidad_serviciosActual += cantidad_servicios
        motonave.numero_viaje = numero_viaje
        motonave.fecha_nominacion = fecha_nominacion
        motonave.puerto = puerto
        motonave.prox_puerto = prox_puerto
        motonave.procedenciaCarga = procedenciaCarga
        motonave.armador = armador
        motonave.agencia = agencia
        
        motonave.save()

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

        nombre_motonave = request.POST.get('nombreMotonave')

        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        fichas_servicio = FichaServicio.objects.filter(motonave=motonave)
        
        for ficha_servicio in fichas_servicio:
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')

        fichas_servicio.delete()

        motonave.estado_servicio = 'Disponible'
        motonave.cantidad_serviciosHistorial = F('cantidad_serviciosHistorial') - motonave.cantidad_serviciosActual
        motonave.cantidad_serviciosActual = 0
        motonave.comentarioActual = ""
        motonave.puerto = ""
        motonave.prox_puerto = ""
        motonave.procedenciaCarga = ""
        motonave.armador = ""
        motonave.agencia = ""

        motonave.save()
        
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)

#-----------------CREAR SERVICIOS INDIVUALES
@login_required
@csrf_exempt
def crear_servicio_individual(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombre_motonave')

        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        fecha_nominacion = timezone.now()
        motonave.cantidad_serviciosHistorial += 1
        motonave.cantidad_serviciosActual += 1
        numero_servicio = motonave.cantidad_serviciosActual
        motonave.fecha_nominacion = fecha_nominacion

        motonave.save()

        ficha_servicio = FichaServicio(
            motonave=motonave,
            numero_servicio=numero_servicio,
            tipo_servicio='',
            fecha_fin=fecha_nominacion.date(),
            estado_delServicio='Nominado',
            navegacion=''
            
        )
        ficha_servicio.save()

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
            
            if motonave.cantidad_serviciosActual == 1:
                return JsonResponse({'error': 'No se puede eliminar el último servicio de la motonave.'}, status=400)
            
            ficha_en_proceso = ficha_servicio.estado_delServicio == 'En Proceso'
            
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')
            
            ficha_servicio.delete()
            
            servicios_restantes = FichaServicio.objects.filter(motonave=motonave).order_by('numero_servicio')
            
            motonave.cantidad_serviciosActual -= 1
            motonave.cantidad_serviciosHistorial -= 1
            
            fichas_servicio_motonave = motonave.fichas_servicio.all()
            
            for i, servicio in enumerate(servicios_restantes, start=1):
                servicio.numero_servicio = i
                servicio.save()
            
            if fichas_servicio_motonave.exists():
                if all(ficha.estado_delServicio == 'Terminado' for ficha in fichas_servicio_motonave):
                    motonave.estado_servicio = 'Terminado'
                else:
                    if any(ficha.estado_delServicio == 'En Proceso' for ficha in fichas_servicio_motonave):
                        motonave.estado_servicio = 'En Proceso'
                    else:
                        motonave.estado_servicio = 'Nominado'
            else:
                motonave.estado_servicio = 'Disponible'
                
                motonave.comentarioActual = ""
                motonave.puerto = ""
                motonave.prox_puerto = ""
                motonave.procedenciaCarga = ""
                motonave.armador = ""
                motonave.agencia = ""
            
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
            
            if ficha_servicio.estado_delServicio == 'Terminado':
                return JsonResponse({'success': False, 'message': 'El servicio ya está finalizado.'})
            
            ficha_servicio.estado_delServicio = 'Terminado'
            ficha_servicio.save()
            
            ficha_servicio.personal_nominado.update(estado='Disponible')
            ficha_servicio.vehiculos_nominados.update(estado='Disponible')
            ficha_servicio.quimicos_nominados.update(estado='Disponible')
            ficha_servicio.varios_nominados.update(estado='Disponible')
            
            motonave = ficha_servicio.motonave
            
            fichas_servicio_motonave = motonave.fichas_servicio.all()
            todas_finalizadas = all(ficha.estado_delServicio == 'Terminado' for ficha in fichas_servicio_motonave)
            
            if todas_finalizadas:
                motonave.estado_servicio = 'Terminado'
            else:
                motonave.estado_servicio = 'En Proceso'
            
            motonave.save()
            
            return JsonResponse({'success': True})
        
        except FichaServicio.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'El servicio especificado no existe.'})
    
    return JsonResponse({'success': False, 'message': 'Método no permitido.'})

#-------------------FILTRAR MOTONAVE POR ESTADO
@login_required
def renderizar_formulario(request):
    nombres_motonaves_disponibles = list(Motonave.objects.filter(estado_servicio='Disponible').values_list('nombre', flat=True))
    
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

            fichas_servicio = FichaServicio.objects.filter(motonave=motonave)

            for ficha in fichas_servicio:
                historial_servicio = HistorialServicio(
                    numero_servicio=ficha.numero_servicio,
                    tipo_servicio=ficha.tipo_servicio,
                    motonave=motonave,
                    fecha_inicio_faena=ficha.fecha_inicioFaena,
                    fecha_fin=ficha.fecha_fin,
                )
                historial_servicio.save()

            motonave.estado_servicio = 'Disponible'
            motonave.save()

            fichas_servicio.delete()

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