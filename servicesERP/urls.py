from django.urls import path, include
from django.contrib import admin
from erp.views.general_views import home, menu_view
from erp.views.auth_views import login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('erp/', include('erp.urls')),  # Elimina 'namespace='erp''
    path('erp/menu/', menu_view, name='menu'),
    path('login/', login_view, name='login'),
    # Otras rutas aquí...
]