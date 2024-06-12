from django.urls import path
from django.contrib.auth import views as auth_views
from .views import home, login_view, menu_view
from .views import gestorOperaciones, crear_motonave, eliminar_motonave, modificar_motonave, obtener_detalles_motonave, guardar_nuevo_estado, guardar_comentarios, obtener_tabla_motonaves 
from .views import crear_servicio, crear_servicio_individual, eliminar_servicio, eliminar_servicio_individual,obtener_servicios_motonave, renderizar_formulario 
from .views import gestorPersonal, crear_personal, validar_rut, eliminar_personal, obtener_personal, obtener_nombres_especialidades, obtener_lista_especialidades, actualizar_informacion_personal 
from .views import gestorInventario, agregar_quimico, agregar_vehiculo, validar_campo_unicoVehiculo, validar_campo_unico_vehiculoCambio, agregar_vario, eliminar_quimico, eliminar_vehiculo, eliminar_vario
from .views import obtener_detalle_vehiculo, guardar_cambios_vehiculo, obtener_detalles_vario, actualizar_vario, obtener_detalles_quimico, guardar_cambios_quimico
from .views import ficha_servicio, actualizar_ficha_servicio_por_id, detalle_ficha_servicio
from .views import gestor_documentos, obtener_documentos, eliminar_documento

app_name = 'erp'  

urlpatterns = [
    path('', home, name='home'),
    path('menu/', menu_view, name='menu'),
    path('login/', login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='erp:home'), name='logout'),
    path('gestor-operaciones/', gestorOperaciones, name='gestor-operaciones'),
    path('gestor-operaciones/crear_motonave/', crear_motonave, name='crear_motonave'),
    path('gestor-operaciones/modificar-motonave/', modificar_motonave, name='modificar_motonave'),
    path('gestor-operaciones/eliminar-motonave/', eliminar_motonave, name='eliminar_motonave'),
    path('gestor-operaciones/obtener-detalles-motonave/', obtener_detalles_motonave, name='obtener_detalles_motonave'),
    path('gestor-operaciones/guardar-nuevo-estado/', guardar_nuevo_estado, name='guardar_nuevo_estado'),
    path('gestor-operaciones/guardar-nuevo-comentario/', guardar_comentarios, name='guardar_comentarios'),
    path('gestor-operaciones/obtener_tabla_motonaves/', obtener_tabla_motonaves, name='obtener_tabla_motonaves'),
    path('gestor-operaciones/crear_servicio/', crear_servicio, name='crear_servicio'),
    path('gestor-operaciones/eliminar_servicio/', eliminar_servicio, name='eliminar_servicio'),
    path('gestor-operaciones/crear_servicio_individual/', crear_servicio_individual, name='crear_servicio_individual'),
    path('gestor-operaciones/eliminar_servicio_individual/', eliminar_servicio_individual, name='eliminar_servicio_individual'),
    path('gestor-operaciones/obtener_servicios_motonave/', obtener_servicios_motonave, name='obtener_servicios_motonave'),
    path('gestor-operaciones/rend_formulario/', renderizar_formulario, name='renderizar_formulario'),
    path('gestor-operaciones/ficha-servicio/<int:servicio_id>/', ficha_servicio, name='ficha_servicio'),
    path('gestor-operaciones/ficha-servicio/actualizar-ficha-servicio/<int:servicio_id>/', actualizar_ficha_servicio_por_id, name='actualizar_ficha_servicio_por_id'),
    path('gestor-operaciones/detalle_ficha_servicio/<int:servicio_id>/', detalle_ficha_servicio, name='detalle_ficha_servicio'),
    path('gestor-personal/', gestorPersonal, name='gestor-personal'),
    path('gestor-personal/agregar_personal', crear_personal, name='crear_personal'),
    path('gestor-personal/agregar_personal/validar_rut/', validar_rut, name='validar_rut'),
    path('gestor-personal/eliminar-personal/<int:personal_id>/', eliminar_personal, name='eliminar_personal'),
    path('gestor-personal/obtener-detalles-personal/', obtener_personal, name='obtener_personal'),
    path('gestor-personal/obtener-nombres-especialidades/', obtener_nombres_especialidades, name='obtener_nombres_especialidades'),
    path('gestor-personal/obtener-lista-especialidades/', obtener_lista_especialidades, name='obtener_lista_especialidades'),
    path('gestor-personal/actualizar-informacion-personal/', actualizar_informacion_personal, name='actualizar_informacion_personal'),
    path('gestor-inventario/', gestorInventario, name='gestor-inventario'),
    path('gestor-inventario/agregar_quimico/', agregar_quimico, name='agregar_quimico'),
    path('gestor-inventario/agregar_vehiculo/', agregar_vehiculo, name='agregar_vehiculo'),
    path('gestor-inventario/obtener-detalle-vehiculo/', obtener_detalle_vehiculo, name='obtener_detalle_vehiculo'),
    path('gestor-inventario/guardar-cambios-vehiculo/', guardar_cambios_vehiculo, name='guardar_cambios_vehiculo'),
    path('gestor-inventario/validar-campo-unico/', validar_campo_unicoVehiculo, name='validar_campo_unicoVehiculo'),
    path('gestor-inventario/validar-campo-unico-vehiculoCambio/', validar_campo_unico_vehiculoCambio, name='validar_campo_unico_vehiculoCambio'),
    path('gestor-inventario/agregar_vario', agregar_vario, name='agregar_vario'),
    path('gestor-inventario/eliminar_quimico/<int:quimico_id>/', eliminar_quimico, name='eliminar_quimico'),
    path('gestor-inventario/eliminar_vehiculo/<int:vehiculo_id>/', eliminar_vehiculo, name='eliminar_vehiculo'),
    path('gestor-inventario/eliminar_vario/<int:vario_id>/', eliminar_vario, name='eliminar_vario'),
    path('gestor-inventario/obtener_detalles_vario/', obtener_detalles_vario, name='obtener_detalles_vario'),
    path('gestor-inventario/actualizar_vario/', actualizar_vario, name='actualizar_vario'),
    path('gestor-inventario/obtener_detalles_quimico/', obtener_detalles_quimico, name='obtener_detalles_quimico'),
    path('gestor-inventario/guardar_cambios_quimico/', guardar_cambios_quimico, name='guardar_cambios_quimico'),
    path('gestor-documentos/', gestor_documentos, name='gestor-documentos'),
    path('gestor-documentos/obtener_documentos/', obtener_documentos, name='obtener-documentos'),
    path('gestor-documentos/eliminar_documento/<int:documento_id>/',eliminar_documento, name='eliminar-documento'),

    # Otras rutas aquí...
]
