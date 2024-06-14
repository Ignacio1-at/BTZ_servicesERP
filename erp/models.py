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
    nombre = models.CharField(max_length=100, unique=True)
    cantidad_serviciosHistorial = models.PositiveIntegerField(default=0)
    cantidad_serviciosActual = models.PositiveIntegerField(default=0)
    comentarioActual = models.TextField(null=True, blank=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    fecha_nominacion = models.DateTimeField(auto_now_add=True)
    cantBodegas = models.CharField(max_length=50)
    numero_viaje = models.IntegerField(default=0)
       
    ESTADOS_SERVICIO = (
        ('Nominado', 'Nominado'),
        ('En Proceso', 'En Proceso'),
        ('Terminado', 'Terminado'),
        ('Disponible', 'Disponible')
    )
    estado_servicio = models.CharField(max_length=20, choices=ESTADOS_SERVICIO, default='Disponible')

    puerto = models.CharField(max_length=100, null=True, blank=True)
    prox_puerto = models.CharField(max_length=100, null=True, blank=True)
    procedenciaCarga = models.CharField(max_length=100, null=True, blank=True)
    armador = models.CharField(max_length=100, null=True, blank=True)
    agencia = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.nombre
    
#----------------------ESPECIALIDAD--------------------------------------------------------------------------
class Especialidad(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

#----------------------PERSONAL------------------------------------------------------------------------------
class Personal(models.Model):
    nombre = models.CharField(max_length=100)
    rut = models.CharField(max_length=20, unique=True)
    
    CARGOS_CHOICES = [
        ('Operario', 'Operario'),
        ('Jefe de Cuadrilla', 'Jefe de Cuadrilla'),
        ('Supervisor', 'Supervisor'),
    ]
    
    cargo = models.CharField(max_length=20, choices=CARGOS_CHOICES, default='Operario')
    especialidades = models.ManyToManyField(Especialidad)
    conductor = models.CharField(max_length=3, choices=[('Si', 'Si'), ('No', 'No')], blank=True, null=True)
    LICENCIA_CHOICES = [
        ('', ''),
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('A3', 'A3'),
        ('A4', 'A4'),
        ('A5', 'A5'),
        ('B', 'B'),
        ('C', 'C'),
        ('D', 'D'),
        ('E', 'E'),
        ('F', 'F'),
    ]
    
    tipo_licencia = models.CharField(max_length=2, choices=LICENCIA_CHOICES, blank=True, null=True)

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('En Operación', 'En Operación'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')


    def __str__(self):
        return self.nombre

#----------------------QUIMICO-------------------------------------------------------------------------------

class Quimico(models.Model):

    fecha_ingreso = models.DateField()
    litros_ingreso = models.BigIntegerField()
    numero_factura = models.BigIntegerField()

    tipo_quimico_CHOICES = [
        ('Bidones OCN 01', 'Bidones OCN 01'),
        ('Bidones OCN 08', 'Bidones OCN 08'),
        ('Bidones Acido Clorhídrico', 'Bidones Acido Clorhídrico'),
        ('Bidones Hipoclorito','Bidones Hipoclorito'),
        ('Bidones Hold Coat','Bidones Hold Coat'),
    ]

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('En Operación', 'En Operación'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    tipo_quimico = models.CharField(max_length=100)

    def __str__(self):
        return self.tipo_quimico

#----------------------VEHICULO-----------------------------------------------------------------------------

class Vehiculo(models.Model):
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    numero_motor = models.CharField(max_length=100, unique=True)
    numero_chasis = models.CharField(max_length=100, unique=True)
    cilindrada = models.CharField(max_length=50)
    tipo_vehiculo = models.CharField(max_length=100)
    primer_ingreso = models.DateField()
    patente = models.CharField(max_length=6, unique=True)
    fecha_permiso_circulacion = models.DateField()
    fecha_soap = models.DateField()
    fecha_revision_tecnica = models.DateField()
    seguro_nombre = models.CharField(max_length=100)
    seguro_poliza = models.BigIntegerField()

    TIPOS_COMBUSTIBLE_CHOICES = [
        ('93', '93'),
        ('95', '95'),
        ('97', '97'),
        ('diésel', 'Diésel'),
        ('electrico', 'Eléctrico'),
    ]
    tipo_combustible = models.CharField(max_length=50)

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('En Operación', 'En Operación'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    def __str__(self):
        return {self.patente}

#----------------------VARIO--------------------------------------------------------------------------

class Vario(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_ingreso = models.DateField()

    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('No Disponible', 'No Disponible'),
        ('En Operación', 'En Operación'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')

    def __str__(self):
        return self.nombre
    
    
#----------------------FichaServicio----------------------------------------------------------------------------------------  

class FichaServicio(models.Model):
    motonave = models.ForeignKey(Motonave, on_delete=models.CASCADE, related_name='fichas_servicio')
    numero_servicio = models.IntegerField()
    tipo_servicio = models.CharField(max_length=100, null=True, blank=True)
    fecha_inicioFaena = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField()
    fecha_arribo_cuadrilla = models.DateField(null=True, blank=True)
    bodegas_a_realizar = models.CharField(max_length=100, null=True, blank=True)
    hospedaje = models.CharField(max_length=100, null=True, blank=True)
    lancha = models.CharField(max_length=100, null=True, blank=True)
    grua = models.CharField(max_length=100, null=True, blank=True)
    arriendo_bomba = models.CharField(max_length=100, null=True, blank=True)
    navegacion = models.CharField(max_length=100, null=True, blank=True)
    ESTADOS_delSERVICIO = (
        ('Nominado', 'Nominado'),
        ('En Proceso', 'En Proceso'),
        ('Terminado', 'Terminado'),
        ('Disponible', 'Disponible'),
    )
    estado_delServicio = models.CharField(max_length=20, choices=ESTADOS_delSERVICIO, default='Disponible')
    
    conductores_vinculados = models.JSONField(null=True, blank=True)

    personal_nominado = models.ManyToManyField(Personal, blank=True, related_name='fichas_servicio')
    vehiculos_nominados = models.ManyToManyField(Vehiculo, blank=True, related_name='fichas_servicio')
    quimicos_nominados = models.ManyToManyField(Quimico, blank=True, related_name='fichas_servicio')
    varios_nominados = models.ManyToManyField(Vario, blank=True, related_name='fichas_servicio')
    
    def __str__(self):
        return f"Ficha de Servicio {self.numero_servicio} - Motonave: {self.motonave.nombre}" 
    
#----------------------DOCUMENTO----------------------------------------------------------------------------------------
class Documento(models.Model):
    SECCION_CHOICES = [
        ('Personal', 'Personal'),
        ('Inventario', 'Inventario'),
        ('Servicio', 'Servicio'),
        ('Otros', 'Otros'),
    ]

    SUB_SECCION_CHOICES = [
        ('Contrato', 'Contrato'),
        ('Ficha de Ingreso', 'Ficha de Ingreso'),
        ('Boletas', 'Boletas'),
        ('Facturas', 'Facturas'),
        ('Reportes', 'Reportes'),
        ('Fichas', 'Fichas'),
    ]

    archivo = models.FileField(upload_to='documentos/', default='sin_archivo.txt')
    nombre = models.CharField(max_length=255)
    fecha_subida = models.DateField(auto_now_add=True)
    seccion = models.CharField(max_length=20, choices=SECCION_CHOICES)
    sub_seccion = models.CharField(max_length=20, choices=SUB_SECCION_CHOICES, null=True, blank=True)
    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, blank=True)
    ficha_servicio = models.ForeignKey(FichaServicio, on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.seccion == 'Personal' and self.sub_seccion not in ['Contrato', 'Ficha de Ingreso']:
            raise ValueError("Sub Sección inválida para la Sección Personal")
        if self.seccion == 'Inventario' and self.sub_seccion not in ['Boletas', 'Facturas']:
            raise ValueError("Sub Sección inválida para la Sección Inventario")
        if self.seccion == 'Servicio' and self.sub_seccion not in ['Reportes', 'Fichas']:
            raise ValueError("Sub Sección inválida para la Sección Servicio")
        if self.seccion == 'Otros' and self.sub_seccion is not None:
            raise ValueError("Sub Sección debe ser nula para la Sección Otros")
        super().save(*args, **kwargs)
        
#----------------------HISTORIAL SERVICIOS----------------------------------------------------------------------------------------
class HistorialServicio(models.Model):
    id_servicio = models.IntegerField()
    tipo_servicio = models.CharField(max_length=100)
    motonave = models.ForeignKey(Motonave, on_delete=models.CASCADE, related_name='historial_servicios')
    fecha_inicio_faena = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField()

    def __str__(self):
        return f"Servicio {self.id_servicio} - {self.motonave.nombre}"        