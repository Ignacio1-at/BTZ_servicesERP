# Generated by Django 5.0.3 on 2024-06-14 08:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0010_historialservicio'),
    ]

    operations = [
        migrations.RenameField(
            model_name='historialservicio',
            old_name='numero_servicio',
            new_name='id_servicio',
        ),
    ]
