from django.urls import path
from django.contrib.auth import views as auth_views
from .views import home, login_view, menu_view, gestorOperaciones, fichaOperaciones, crear_motonave, obtener_detalles_motonave, guardar_nuevo_estado, obtener_tabla_motonaves, crear_servicio, gestorPersonal, crear_personal

app_name = 'erp'  

urlpatterns = [
    path('', home, name='home'),
    path('menu/', menu_view, name='menu'),
    path('login/', login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='erp:home'), name='logout'),
    path('gestor-operaciones/', gestorOperaciones, name='gestor-operaciones'),
    path('crear_motonave/', crear_motonave, name='crear_motonave'),
    path('gestor-operaciones/obtener-detalles-motonave/', obtener_detalles_motonave, name='obtener_detalles_motonave'),
    path('gestor-operaciones/guardar-nuevo-estado/', guardar_nuevo_estado, name='guardar_nuevo_estado'),
    path('gestor-operaciones/obtener_tabla_motonaves/', obtener_tabla_motonaves, name='obtener_tabla_motonaves'),
    path('gestor-operaciones/crear_servicio/', crear_servicio, name='crear_servicio'),
    path('ficha-operaciones/', fichaOperaciones, name='ficha-operaciones'),
    path('gestor-personal/', gestorPersonal, name='gestor-personal'),
    path('agregar_personal/', crear_personal, name='crear_personal'),

    
    # Otras rutas aquí...
]
