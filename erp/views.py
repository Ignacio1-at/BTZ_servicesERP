from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import Motonave
from .forms import CustomLoginForm

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

#-----------------Ficha Operaciones
@login_required
def fichaOperaciones(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/fichaOperaciones.html', {'nombre_usuario': nombre_usuario})
