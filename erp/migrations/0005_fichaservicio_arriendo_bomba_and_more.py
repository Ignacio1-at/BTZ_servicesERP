# Generated by Django 4.2.6 on 2024-05-27 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('erp', '0004_remove_fichaservicio_quimico_nominado_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='fichaservicio',
            name='arriendo_bomba',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='fichaservicio',
            name='bodegas_a_realizar',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='fichaservicio',
            name='fecha_arribo_cuadrilla',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='fichaservicio',
            name='hospedaje_desayuno',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='fichaservicio',
            name='lancha_grua',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='fichaservicio',
            name='navegacion',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='fichaservicio',
            name='tipo_servicio',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
