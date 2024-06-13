from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.contrib import messages
from django.contrib.auth import logout
from django.utils.deprecation import MiddlewareMixin
from django.middleware.csrf import rotate_token

class PermissionDeniedMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if isinstance(exception, PermissionDenied):
            logout(request)
            messages.error(request, 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.')
            return redirect('erp:login')

class RotateCSRFTokenMiddleware(MiddlewareMixin):
    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Rota (cambia) el token CSRF en cada solicitud POST
        """
        if request.method == 'POST':
            rotate_token(request)
        return None