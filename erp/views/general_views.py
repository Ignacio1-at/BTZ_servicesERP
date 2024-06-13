from django.shortcuts import render
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request, 'html/home.html')

#-----------------Menu
@login_required
def menu_view(request):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    return render(request, 'html/menu.html', {'nombre_usuario': nombre_usuario})
