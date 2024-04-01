from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Motonave
from .forms import CustomLoginForm
from django.http import JsonResponse
from django.http import HttpResponse
from django.template.loader import render_to_string

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

#-----------------Motonaves
@login_required
def crear_motonave(request):
    if request.method == 'POST':
        nombre_motonave = request.POST.get('nombreMotonave')
        if nombre_motonave:
            motonave = Motonave.objects.create(nombre=nombre_motonave)
            # Redirigir a la página de gestión de operaciones
            return redirect('erp:gestor-operaciones')
    # En caso de que la solicitud no sea POST o falte el nombre de la motonave, redirigir a la misma página
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
                # Construir un diccionario con los detalles de la motonave
                detalles = {
                    'nombre': motonave.nombre,
                    'responsable': motonave.responsable,
                    'descripcion': motonave.descripcion,
                    'estado_servicio': motonave.estado_servicio,
                    'fecha_modificacion': motonave.fecha_modificacion.strftime('%Y-%m-%d %H:%M:%S')
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
    
#-------------------TABLA MOTONAVES
@login_required
def obtener_tabla_motonaves(request):
    # Obtener los datos de la tabla de motonaves, por ejemplo, desde el modelo Motonave
    motonaves = Motonave.objects.all()
    # Construir una lista de diccionarios con los datos relevantes de cada motonave
    data = [{'nombre': motonave.nombre, 'estado_servicio': motonave.estado_servicio} for motonave in motonaves]
    # Devolver los datos como una respuesta JSON
    return JsonResponse(data, safe=False)        
    
 #-----------------Ficha Operaciones
@login_required
def fichaOperaciones(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/fichaOperaciones.html', {'nombre_usuario': nombre_usuario})

 #-----------------Gestor Personal
@login_required
def gestorPersonal(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/gestorPersonal.html', {'nombre_usuario': nombre_usuario})

 #-----------------Ficha Personal
@login_required
def fichaPersonal(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/fichaPersonal.html', {'nombre_usuario': nombre_usuario})
 


