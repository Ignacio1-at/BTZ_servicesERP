from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from ..models import Personal, FichaServicio, Quimico, Vehiculo, Vario
from django.urls import reverse
import json

#-------------------Ficha Servicio especifica x id
@login_required
def ficha_servicio(request, servicio_id):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        motonave = ficha_servicio.motonave
        # Obtener los datos para mostrar en el formulario de nominación, filtrando por estado "Disponible"
        personal = Personal.objects.filter(estado='Disponible')
        vehiculos = Vehiculo.objects.filter(estado='Disponible')
        quimicos = Quimico.objects.filter(estado='Disponible')
        varios = Vario.objects.filter(estado='Disponible')
        
        # Obtener los cargos únicos del personal
        cargos = Personal.objects.values_list('cargo', flat=True).distinct()
        context = {
            'ficha_servicio': ficha_servicio,
            'motonave': motonave,
            'nombre_usuario': nombre_usuario,
            'personal': personal,
            'vehiculos': vehiculos,
            'quimicos': quimicos,
            'varios': varios,
            'cargos': cargos
        }
        return render(request, 'html/fichaServicio.html', context)
    except FichaServicio.DoesNotExist:
        # Manejar el caso en que no se encuentre la ficha de servicio
        context = {
            'nombre_usuario': nombre_usuario
        }
        return render(request, 'html/fichaServicio.html', context)

#-------------------Actualizar Ficha Servicio x ID.     
@login_required
def actualizar_ficha_servicio_por_id(request, servicio_id):
    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        if request.method == 'POST':
            tipo_servicio = request.POST.get('tipo_servicio')
            fecha_arribo_cuadrilla = request.POST.get('fecha_arribo_cuadrilla')
            bodegas_a_realizar = request.POST.get('bodegas_a_realizar')
            hospedaje = request.POST.get('hospedaje')
            lancha = request.POST.get('lancha')
            grua = request.POST.get('grua')
            arriendo_bomba = request.POST.get('arriendo_bomba')
            navegacion = request.POST.get('navegacion')
            
            # Obtener el objeto conductoresVinculados enviado desde el formulario
            conductores_vinculados_json = request.POST.get('conductores_vinculados')
            conductores_vinculados = json.loads(conductores_vinculados_json)

            # Obtener los IDs de los elementos nominados desde el formulario
            personal_ids_str = request.POST.getlist('personal_nominado')
            vehiculo_ids_str = request.POST.getlist('vehiculos_nominados')
            quimico_ids_str = request.POST.getlist('quimicos_nominados')
            vario_ids_str = request.POST.getlist('varios_nominados')

            # Imprimir los valores recibidos en la consola
            print("------- Valores recibidos -------")
            print("personal_ids_str:", personal_ids_str)
            print("vehiculo_ids_str:", vehiculo_ids_str)
            print("quimico_ids_str:", quimico_ids_str)
            print("vario_ids_str:", vario_ids_str)
            print("---------------------------------")

            # Convertir las cadenas de IDs en listas de enteros
            personal_ids = []
            for ids_str in personal_ids_str:
                ids = ids_str.split(',')
                personal_ids.extend([int(id) for id in ids if id])

            vehiculo_ids = []
            for ids_str in vehiculo_ids_str:
                ids = ids_str.split(',')
                vehiculo_ids.extend([int(id) for id in ids if id])

            quimico_ids = []
            for ids_str in quimico_ids_str:
                ids = ids_str.split(',')
                quimico_ids.extend([int(id) for id in ids if id])

            vario_ids = []
            for ids_str in vario_ids_str:
                ids = ids_str.split(',')
                vario_ids.extend([int(id) for id in ids if id])

            # Imprimir las listas de IDs convertidas
            print("------- IDs convertidos -------")
            print("personal_ids:", personal_ids)
            print("vehiculo_ids:", vehiculo_ids)
            print("quimico_ids:", quimico_ids)
            print("vario_ids:", vario_ids)
            print("-------------------------------")

            # Actualizar los campos de la ficha de servicio
            ficha_servicio.tipo_servicio = tipo_servicio
            ficha_servicio.fecha_arribo_cuadrilla = fecha_arribo_cuadrilla
            ficha_servicio.bodegas_a_realizar = bodegas_a_realizar
            ficha_servicio.hospedaje = hospedaje
            ficha_servicio.lancha = lancha
            ficha_servicio.grua = grua
            ficha_servicio.arriendo_bomba = arriendo_bomba
            ficha_servicio.navegacion = navegacion

            # Actualizar las nominaciones en la ficha de servicio
            ficha_servicio.personal_nominado.set(personal_ids)
            ficha_servicio.vehiculos_nominados.set(vehiculo_ids)
            ficha_servicio.quimicos_nominados.set(quimico_ids)
            ficha_servicio.varios_nominados.set(vario_ids)
            
            # Guardar el objeto conductoresVinculados en el campo JSON de la ficha de servicio
            ficha_servicio.conductores_vinculados = conductores_vinculados

            ficha_servicio.estado_delServicio = 'En Proceso'

            # Guardar los cambios en la ficha de servicio
            ficha_servicio.save()
            
            # Obtener los datos adicionales de la motonave o navío
            puerto = request.POST.get('puerto')
            procedencia_carga = request.POST.get('procedencia_carga')
            armador = request.POST.get('armador')
            agencia = request.POST.get('agencia')
            prox_puerto = request.POST.get('prox puerto')

            # Actualizar los campos de la motonave
            motonave = ficha_servicio.motonave
            motonave.puerto = puerto
            motonave.procedenciaCarga = procedencia_carga
            motonave.armador = armador
            motonave.agencia = agencia
            motonave.prox_puerto = prox_puerto
            motonave.save()

            # Cambiar el estado de los elementos vinculados a la ficha de servicio a "En Operación"
            ficha_servicio.personal_nominado.update(estado='En Operación')
            ficha_servicio.vehiculos_nominados.update(estado='En Operación')
            ficha_servicio.quimicos_nominados.update(estado='En Operación')
            ficha_servicio.varios_nominados.update(estado='En Operación')
            
            # Verificar si alguna ficha de servicio asociada a la motonave está en estado "En Proceso"
            motonave = ficha_servicio.motonave
            fichas_servicio_en_proceso = motonave.fichas_servicio.filter(estado_delServicio='En Proceso')

            if fichas_servicio_en_proceso.exists():
                # Si hay al menos una ficha en estado "En Proceso", cambiar el estado de la motonave a "En Proceso"
                motonave.estado_servicio = 'En Proceso'
                motonave.save()
            else:
                # Si no hay fichas en estado "En Proceso", cambiar el estado de la motonave a "Disponible"
                motonave.estado_servicio = 'Disponible'
                motonave.save()

            messages.success(request, 'La ficha de servicio se ha actualizado correctamente.')

            # Obtener el nombre de la motonave
            nombre_motonave = ficha_servicio.motonave.nombre

            url = reverse('erp:gestor-operaciones') + '?open_modal=true&nombre_motonave=' + nombre_motonave
            return redirect(url)
    except FichaServicio.DoesNotExist:
        messages.error(request, 'No se encontró la ficha de servicio.')

    return redirect('erp:gestor-operaciones')

#-------------------DETALLE FICHA SERVICIO PARA VISUALIZAR
@login_required
def detalle_ficha_servicio(request, servicio_id):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"

    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        motonave = ficha_servicio.motonave

        # Obtener los datos para mostrar en el formulario de nominación
        personal = ficha_servicio.personal_nominado.all()
        vehiculos = ficha_servicio.vehiculos_nominados.all()
        quimicos = ficha_servicio.quimicos_nominados.all()
        varios = ficha_servicio.varios_nominados.all()

        # Obtener los conductores vinculados a cada vehículo y sus IDs
        conductores_vinculados = ficha_servicio.conductores_vinculados
        conductores_vinculados_ids = []
        for vehiculo in vehiculos:
            vehiculo.conductores = []
            if conductores_vinculados:
                for conductor_data in conductores_vinculados.get(str(vehiculo.id), []):
                    conductor = Personal.objects.get(id=conductor_data['id'])
                    vehiculo.conductores.append(conductor)
                    conductores_vinculados_ids.append(conductor.id)

        context = {
            'ficha_servicio': ficha_servicio,
            'motonave': motonave,
            'nombre_usuario': nombre_usuario,
            'personal': personal,
            'conductores_vinculados_ids': conductores_vinculados_ids,
            'vehiculos': vehiculos,
            'quimicos': quimicos,
            'varios': varios,
            'servicio_id': servicio_id,
        }

        return render(request, 'html/detalleFichaServicio.html', context)

    except FichaServicio.DoesNotExist:
        # Manejar el caso en que no se encuentre la ficha de servicio
        context = {
            'nombre_usuario': nombre_usuario
        }
        return render(request, 'html/detalleFichaServicio.html', context)


#-------------------OBTENER Y EDITAR FICHA SERVICIO    
@login_required
def editar_ficha_servicio(request, servicio_id):
    nombre_usuario = request.user.nombre if request.user.is_authenticated else "Invitado"
    try:
        ficha_servicio = FichaServicio.objects.get(id=servicio_id)
        motonave = ficha_servicio.motonave
        
        if request.method == 'GET':
            
            context = {
                'ficha_servicio': ficha_servicio,
                'motonave': motonave,
                'nombre_usuario': nombre_usuario,
                'servicio_id': servicio_id,
            }
            return render(request, 'html/fichaServicioEditar.html', context)
        
        elif request.method == 'POST':
            tipo_servicio = request.POST.get('tipo_servicio')
            fecha_arribo_cuadrilla = request.POST.get('fecha_arribo_cuadrilla')
            bodegas_a_realizar = request.POST.get('bodegas_a_realizar')
            hospedaje = request.POST.get('hospedaje')
            lancha = request.POST.get('lancha')
            grua = request.POST.get('grua')
            arriendo_bomba = request.POST.get('arriendo_bomba')
            navegacion = request.POST.get('navegacion')
            
            # Actualizar los campos de la ficha de servicio
            ficha_servicio.tipo_servicio = tipo_servicio
            ficha_servicio.fecha_arribo_cuadrilla = fecha_arribo_cuadrilla
            ficha_servicio.bodegas_a_realizar = bodegas_a_realizar
            ficha_servicio.hospedaje = hospedaje
            ficha_servicio.lancha = lancha
            ficha_servicio.grua = grua
            ficha_servicio.arriendo_bomba = arriendo_bomba
            ficha_servicio.navegacion = navegacion
                        
            # Guardar los cambios en la ficha de servicio
            ficha_servicio.save()
            
            # Obtener los datos adicionales de la motonave o navío
            puerto = request.POST.get('puerto')
            procedencia_carga = request.POST.get('procedencia_carga')
            armador = request.POST.get('armador')
            agencia = request.POST.get('agencia')
            prox_puerto = request.POST.get('prox puerto')
            
            # Actualizar los campos de la motonave
            motonave = ficha_servicio.motonave
            motonave.puerto = puerto
            motonave.procedenciaCarga = procedencia_carga
            motonave.armador = armador
            motonave.agencia = agencia
            motonave.prox_puerto = prox_puerto
            motonave.save()
            
            messages.success(request, 'La ficha de servicio se ha actualizado correctamente.')
            
            # Obtener el nombre de la motonave
            nombre_motonave = ficha_servicio.motonave.nombre
            
            url = reverse('erp:gestor-operaciones') + '?open_modal=true&nombre_motonave=' + nombre_motonave
            return redirect(url)
    
    except FichaServicio.DoesNotExist:
        # Manejar el caso en que no se encuentre la ficha de servicio
        context = {
            'nombre_usuario': nombre_usuario
        }
        return render(request, 'html/fichaServicioEditar.html', context)    