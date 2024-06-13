from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib import messages
from ..models import CustomUser
from ..forms import CustomLoginForm
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

#--------------Login
@csrf_exempt
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

def password_reset_request(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        user = CustomUser.objects.filter(email=email).first()
        if user:
            # Generar token de recuperación de contraseña
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            # Enviar correo electrónico de recuperación de contraseña
            subject = 'Recuperación de contraseña'
            message = render_to_string('html/password_reset_email.html', {
                'user': user,
                'domain': request.META['HTTP_HOST'],
                'uid': uid,
                'token': token,
            })
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [email]
            send_mail(subject, message, from_email, recipient_list)

            messages.success(request, 'Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.')
            return redirect('erp:login')
        else:
            messages.error(request, 'No se encontró ningún usuario con ese correo electrónico.')

    return render(request, 'html/password_reset_request.html')

def password_reset_confirm(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            new_password = request.POST.get('new_password')
            user.set_password(new_password)
            user.save()
            messages.success(request, 'Tu contraseña ha sido restablecida exitosamente.')
            return redirect('erp:login')
        else:
            return render(request, 'html/password_reset_confirm.html')
    else:
        messages.error(request, 'El enlace de restablecimiento de contraseña no es válido.')
        return redirect('erp:login')

@login_required
def logout_view(request):
    logout(request)
    return redirect('erp:login')