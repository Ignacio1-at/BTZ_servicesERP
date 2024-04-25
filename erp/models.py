from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, nombre='Nombre Predeterminado', **extra_fields):
        if not email:
            raise ValueError('El campo de correo electrónico es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, nombre=nombre, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, nombre='Administrador', **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Los superusuarios deben tener is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Los superusuarios deben tener is_superuser=True.')

        return self.create_user(email, password, nombre=nombre, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nombre = models.CharField(max_length=255, default='Nombre Predeterminado')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
#-------------------MOTONAVES ----------------------------------------------------------------------------------------------

class Motonave(models.Model):
    # Campos existentes
    nombre = models.CharField(max_length=100, unique=True)
    cantidad_serviciosHistorial = models.PositiveIntegerField(default=0)  # Campo para almacenar la cantidad de servicios realizados en su totalidad
    cantidad_serviciosActual = models.PositiveIntegerField(default=0)  # Campo para almacenar la cantidad de servicios que se realizaran actual
    comentarioActual = models.TextField(null=True, blank=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_nominacion = models.DateTimeField(auto_now_add=True)
    numero_viaje = models.IntegerField(default=0)

    # Nuevo campo para el estado del servicio
    ESTADOS_SERVICIO = (
        ('Nominado', 'Nominado'),
        ('En Proceso', 'En Proceso'),
        ('Terminado', 'Terminado'),
        ('Disponible', 'Disponible'),  # Por defecto
    )
    estado_servicio = models.CharField(max_length=20, choices=ESTADOS_SERVICIO, default='Disponible')

    def __str__(self):
        return self.nombre
    
#----------------------FichaServicio----------------------------------------------------------------------------------------  
    
class FichaServicio(models.Model):
    motonave_nombre = models.CharField(max_length=100)
    procedencia = models.CharField(max_length=100)
    tipo_servicio = models.CharField(max_length=100)
    armador = models.CharField(max_length=100)
    agencia = models.CharField(max_length=100)
    arribo = models.DateField()
    hospedaje_desayuno = models.BooleanField()
    lancha_grua = models.BooleanField()
    cantidad_bodegas = models.IntegerField()
    arriendo_bomba = models.BooleanField()
    navegacion = models.BooleanField()
    prox_puerto = models.CharField(max_length=100)
    loi = models.CharField(max_length=100)
    fecha_ultima_modificacion = models.DateTimeField(auto_now=True)
    descripcion = models.TextField()

    def __str__(self):
        return f"Ficha de Servicio para {self.motonave_nombre}"

#----------------------PERSONAL---------------------------------------------------------------------------------------------   

class Personal(models.Model):
    SUPERVISOR = 'Supervisor'
    JEFE_DE_CUADRILLA = 'Jefe de Cuadrilla'
    OPERARIO = 'Operario'

    CARGOS_CHOICES = [
        (OPERARIO, 'Operario'),
        (JEFE_DE_CUADRILLA, 'Jefe de Cuadrilla'),
        (SUPERVISOR, 'Supervisor'),
    ]

    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=20, unique=True)
    cargo = models.CharField(max_length=20, choices=CARGOS_CHOICES, default=OPERARIO)

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('En Operación', 'En Operación'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    def __str__(self):
        return self.nombre

#----------------------TABLA DE FICHA Herramientas--------------------------------------------------------------------------
   
#----------------------TABLA DE FICHA Quimico-------------------------------------------------------------------------------    
  
#----------------------TABLA DE FICHA Vehiculos-----------------------------------------------------------------------------    

#----------------------TABLA DE FICHA Mantenimiento------------------------------------------------------------------------- 
