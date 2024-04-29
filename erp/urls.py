from django.urls import path
from django.contrib.auth import views as auth_views
from .views import home, login_view, menu_view, gestorOperaciones, fichaOperaciones, crear_motonave, obtener_detalles_motonave, guardar_nuevo_estado, guardar_comentarios, obtener_tabla_motonaves, crear_servicio, eliminar_servicio, renderizar_formulario, gestorPersonal, crear_personal, validar_rut, eliminar_personal, obtener_personal, obtener_nombres_especialidades, obtener_lista_especialidades, actualizar_informacion_personal, gestorInventario, agregar_quimico, agregar_vehiculo, agregar_vario, eliminar_quimico, eliminar_vehiculo, eliminar_vario, obtener_numero_motor, obtener_numero_chasis, obtener_patente

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
    path('gestor-operaciones/guardar-nuevo-comentario/', guardar_comentarios, name='guardar_comentarios'),
    path('gestor-operaciones/obtener_tabla_motonaves/', obtener_tabla_motonaves, name='obtener_tabla_motonaves'),
    path('gestor-operaciones/crear_servicio/', crear_servicio, name='crear_servicio'),
    path('gestor-operaciones/eliminar_servicio/', eliminar_servicio, name='eliminar_servicio'),
    path('gestor-operaciones/rend_formulario/', renderizar_formulario, name='renderizar_formulario'),
    path('ficha-operaciones/', fichaOperaciones, name='ficha-operaciones'),
    path('gestor-personal/', gestorPersonal, name='gestor-personal'),
    path('gestor-personal/agregar_personal', crear_personal, name='crear_personal'),
    path('gestor-personal/agregar_personal/validar_rut/', validar_rut, name='validar_rut'),
    path('gestor-personal/eliminar-personal/<int:personal_id>/', eliminar_personal, name='eliminar_personal'),
    path('gestor-personal/obtener-detalles-personal/', obtener_personal, name='obtener_personal'),
    path('gestor-personal/obtener-nombres-especialidades/', obtener_nombres_especialidades, name='obtener_nombres_especialidades'),
    path('gestor-personal/obtener-lista-especialidades/', obtener_lista_especialidades, name='obtener_lista_especialidades'),
    path('gestor-personal/actualizar-informacion-personal/', actualizar_informacion_personal, name='actualizar_informacion_personal'),
    path('gestor-inventario/', gestorInventario, name='gestor-inventario'),
    path('agregar_quimico', agregar_quimico, name='agregar_quimico'),
    path('agregar_vehiculo', agregar_vehiculo, name='agregar_vehiculo'),
    path('agregar_vario', agregar_vario, name='agregar_vario'),
    path('eliminar_quimico/<int:quimico_id>/', eliminar_quimico, name='eliminar_quimico'),
    path('eliminar_vehiculo/<int:vehiculo_id>/', eliminar_vehiculo, name='eliminar_vehiculo'),
    path('eliminar_vario/<int:vario_id>/', eliminar_vario, name='eliminar_vario'),
    path('obtener_numero_motor/', obtener_numero_motor, name='obtener_numero_motor'),
    path('obtener_numero_chasis/', obtener_numero_chasis, name='obtener_numero_chasis'),
    path('obtener_patente/', obtener_patente, name='obtener_patente'),
    # Otras rutas aquí...
]
