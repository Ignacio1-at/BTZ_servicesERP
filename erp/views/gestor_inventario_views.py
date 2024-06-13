from django.db import IntegrityError
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from ..models import Quimico, Vehiculo, Vario
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse

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