# Generated by Django 4.2.6 on 2024-04-24 21:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0014_rename_cantidad_servicios_motonave_cantidad_servicioshistorial_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='motonave',
            old_name='descripcion',
            new_name='comentarioActual',
        ),
    ]