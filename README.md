# BTZ_servicesERP
Services ERP es una aplicación web desarrollada con Django para gestionar las operaciones, personal, inventario y documentos relacionados con la empresa Maritime Services SPA.

Requisitos

-Python 3.x
-PostgreSQL
-pgAdmin (recomendado para administrar PostgreSQL)

Instalación

1-Clonar el repositorio:

git clone https://github.com/Ignacio1-at/BTZ_servicesERP.git

2-Crear y activar un entorno virtual (opcional pero recomendado):

python -m venv env
source env/bin/activate  # En Windows, use `env\Scripts\activate`

3-Instalar las dependencias:

pip install -r requirements.txt

4-Configurar la base de datos PostgreSQL:

-Crear una base de datos en PostgreSQL (puedes usar pgAdmin para esto).
-En el archivo servicesERP/settings.py, actualizar la configuración de la base de datos DATABASES con tus credenciales de PostgreSQL.


5-Aplicar las migraciones de la base de datos:

python manage.py makemigrations
python manage.py migrate

6-Crear un superusuario para acceder al panel de administración de Django:

python manage.py createsuperuser

7-Cargar datos iniciales (especialidades, etc.):

-Desde el panel de administración de Django (/admin), crea las especialidades necesarias:
	Trainee
	Baldeo
	Moperos
	Costilleros
	Accesos
	Marichem
	Preparar Químico
	Ayudante de Manguera

-Puedes crear usuarios y asignarles permisos desde el panel de administración.

8-Configurar el servidor de correo electrónico (opcional):

-Este proyecto utiliza django-smtp-ssl para enviar correos electrónicos. Instala la biblioteca ejecutando pip install django-smtp-ssl.
-Configura las credenciales de correo electrónico en servicesERP/settings.py (¡no uses credenciales reales en producción!).

9-Iniciar el servidor de desarrollo:

python manage.py runserver

Uso

Accede a la aplicación en http://localhost:8000 y autentícate con las credenciales de superusuario creadas anteriormente.

Estructura del proyecto

El proyecto tiene la siguiente estructura:

Proyecto BTZ SERVICES ERP/
├── erp/
│   ├── __init__.py
│   ├── admin.py
│   ├── ...
│   └── templates/
│       └── html/
│           ├── ...
├── servicesERP/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── static/
│       ├── css/
│       ├── images/
│       └── js/
├── db.sqlite3
└── manage.py

erp: Aplicación principal que contiene modelos, vistas y plantillas .
servicesERP: Configuración del proyecto Django y archivos estáticos.

Contribución
Si deseas contribuir a este proyecto, por favor, crea un fork del repositorio y envía tus Pull Requests con las mejoras o correcciones propuestas.