from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Motonave, Personal, FichaServicio
from .forms import CustomLoginForm
from django.http import JsonResponse, HttpResponseRedirect
from django.utils import timezone

#---Excel
#---------------------------------------------------

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

    return render(request, 'html/gestorOperaciones.html', {'nombre_usuario': nombre_usuario, 'motonaves': motonaves, 'motonaves_json': motonaves_json})

#-----------------Crear Motonaves
@login_required
def crear_motonave(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombreMotonave')
        if nombre_motonave:
            motonave = Motonave.objects.create(
                nombre=nombre_motonave,
            )
            # Redirigir a la página de gestión de operaciones
            return redirect('erp:gestor-operaciones')
    # En caso de que la solicitud no sea POST o falte algún campo, redirigir a la misma página
    return redirect('erp:gestor-operaciones')

#-------------------DETALLES MOTONAVES
@login_required
def obtener_detalles_motonave(request):
    if request.method == 'GET':
        # Obtener el nombre de la motonave desde la solicitud GET
        nombre_motonave = request.GET.get('nombre_motonave')
        if nombre_motonave:
            try:
                # Buscar la motonave en la base de datos por su nombre
                motonave = Motonave.objects.get(nombre=nombre_motonave)
                # Construir un diccionario con los detalles de la motonave, incluyendo el nuevo campo 'viaje'
                detalles = {
                    'nombre': motonave.nombre,
                    'estado_servicio': motonave.estado_servicio,
                    'fecha_modificacion': motonave.fecha_modificacion.strftime('%Y-%m-%d %H:%M:%S'),
                    'fecha_nominacion': motonave.fecha_nominacion.strftime('%Y-%m-%d'),
                    'cantidad_servicios': motonave.cantidad_servicios,
                    'viaje': motonave.numero_viaje,
                    # Agrega otros campos según necesites
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

"""   
#-------------------GUARDAR NUEVO VIAJE    
@login_required
def guardar_nuevo_viaje(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombreMotonave')
        nuevo_viaje = request.POST.get('nuevoViaje')

        if nombre_motonave and nuevo_viaje:
            try:
                # Buscar la motonave por su nombre
                motonave = Motonave.objects.get(nombre=nombre_motonave)
                # Actualizar el valor del viaje
                motonave.viaje = nuevo_viaje
                motonave.save()
                return JsonResponse({'success': True})
            except Motonave.DoesNotExist:
                return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)
        else:
            return JsonResponse({'error': 'Se requieren el nombre de la motonave y el nuevo viaje.'}, status=400)
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)
    
#-------------------GUARDAR DESCRIPCION  
def guardar_descripcion(request):
    if request.method == 'POST':
        # Obtener los datos enviados en la solicitud POST
        nombre_motonave = request.POST.get('nombre_motonave')
        nueva_descripcion = request.POST.get('descripcion')

        # Buscar la instancia del modelo correspondiente en la base de datos
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            # Manejar el caso en el que la motonave no se encuentre en la base de datos
            return JsonResponse({'error': 'La motonave especificada no existe'}, status=404)

        # Actualizar la descripción de la motonave y guardar los cambios en la base de datos
        motonave.descripcion = nueva_descripcion
        motonave.save()

        # Devolver una respuesta JSON indicando que la descripción se ha guardado correctamente
        return JsonResponse({'mensaje': 'Descripción guardada correctamente'})

    else:
        # Manejar solicitudes de otros métodos HTTP
        return JsonResponse({'error': 'Método HTTP no permitido'}, status=405)        
"""    
#-------------------TABLERO MOTONAVES
@login_required
def obtener_tabla_motonaves(request):
    # Obtener los datos de la tabla de motonaves, por ejemplo, desde el modelo Motonave
    motonaves = Motonave.objects.all()
    # Construir una lista de diccionarios con los datos relevantes de cada motonave
    data = [{'nombre': motonave.nombre, 
             'estado_servicio': motonave.estado_servicio,
             'cantidad_servicios': motonave.cantidad_servicios,
             'viaje': motonave.numero_viaje} for motonave in motonaves]
    # Devolver los datos como una respuesta JSON
    return JsonResponse(data, safe=False)



#-----------------Crear Servicios
@login_required
def crear_servicio(request):
    if request.method == 'POST':
        # Obtener los datos del formulario
        nombre_motonave = request.POST.get('nombreMotonave')
        cantidad_servicios = int(request.POST.get('cantidadServicios'))
        numero_viaje = int(request.POST.get('numeroViaje'))  # Obtener el número de viaje del formulario

        # Obtener la fecha de nominación actual
        fecha_nominacion = timezone.now()

        # Verificar si la motonave existe
        try:
            motonave = Motonave.objects.get(nombre=nombre_motonave)
        except Motonave.DoesNotExist:
            return JsonResponse({'error': 'La motonave especificada no existe.'}, status=404)

        # Cambiar el estado de la motonave a "Nominado"
        motonave.estado_servicio = 'Nominado'
        motonave.save()

        # Actualizar la cantidad de servicios y el número de viaje de la motonave
        motonave.cantidad_servicios += cantidad_servicios
        motonave.numero_viaje = numero_viaje  # Asignar el número de viaje
        motonave.fecha_nominacion = fecha_nominacion  # Asignar la fecha de nominación
        motonave.save()

        # Otros pasos para crear el servicio...

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'La solicitud debe ser de tipo POST.'}, status=405)

 #-----------------Ficha de Servicios
@login_required
def fichaOperaciones(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/fichaOperaciones.html', {'nombre_usuario': nombre_usuario})

 #-----------------Gestor Personal
@login_required
def gestorPersonal(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    # Obtener todos los objetos de Personal desde la base de datos
    personal_objects = Personal.objects.all()
    # Pasar los objetos de Personal al contexto
    return render(request, 'html/gestorPersonal.html', {'nombre_usuario': nombre_usuario, 'personal_list': personal_objects})

 #-----------------Crear Personal
@login_required
def crear_personal(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        rut = request.POST.get('rut')
        cargo = request.POST.get('cargo')

        # Crear una instancia del modelo Personal y guardarla en la base de datos
        personal = Personal(nombre=nombre, rut=rut, cargo=cargo)
        personal.save()

        # Redirigir a alguna página de éxito o a donde desees
        return redirect('erp:gestor-personal')

    # Si la solicitud no es POST, simplemente renderiza la página nuevamente
    return render(request, 'erp:gestor-personal')