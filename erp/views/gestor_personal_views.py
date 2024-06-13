from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from ..models import Personal, Especialidad
from django.http import JsonResponse
from django.core import serializers
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

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