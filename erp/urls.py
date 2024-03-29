from django.urls import path
from django.contrib.auth import views as auth_views
from .views import home, login_view, menu_view, gestorOperaciones, fichaOperaciones, crear_motonave

app_name = 'erp'  

urlpatterns = [
    path('', home, name='home'),
    path('menu/', menu_view, name='menu'),
    path('login/', login_view, name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='erp:home'), name='logout'),
    path('gestor-operaciones/', gestorOperaciones, name='gestor-operaciones'),
    path('crear_motonave/', crear_motonave, name='crear_motonave'),
    path('ficha-operaciones/', fichaOperaciones, name='ficha-operaciones'),

    
    # Otras rutas aquí...
]
