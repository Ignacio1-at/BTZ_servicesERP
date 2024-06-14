function getSelectedElements() {
    console.log("Ejecutando getSelectedElements()");
    const selectedPersonalIds = Array.from(document.querySelectorAll('#columnPersonal .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedVehiculoIds = Array.from(document.querySelectorAll('#columnVehiculo .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedQuimicoIds = Array.from(document.querySelectorAll('#columnQuimico .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedVarioIds = Array.from(document.querySelectorAll('#columnVario .ficha-elemento')).map(el => el.getAttribute('data-id'));

    document.getElementById('personal_nominado').value = selectedPersonalIds.join(',');
    document.getElementById('vehiculos_nominados').value = selectedVehiculoIds.join(',');
    document.getElementById('quimicos_nominados').value = selectedQuimicoIds.join(',');
    document.getElementById('varios_nominados').value = selectedVarioIds.join(',');

    // Mostrar los valores en el elemento <div>
    const outputElement = document.getElementById('selectedElementsOutput');
    outputElement.innerHTML = `
    <p>Personal IDs: ${selectedPersonalIds.join(', ')}</p>
    <p>Vehículo IDs: ${selectedVehiculoIds.join(', ')}</p>
    <p>Químico IDs: ${selectedQuimicoIds.join(', ')}</p>
    <p>Vario IDs: ${selectedVarioIds.join(', ')}</p>
    `;
}

document.addEventListener('DOMContentLoaded', function () {

    const agregarConductorBtn = document.getElementById('agregarConductor');
    agregarConductorBtn.addEventListener('click', function () {
        const conductorSelect = document.getElementById('conductoresNominados');
        const conductorId = conductorSelect.value;
        const vehiculoId = vehiculoSelect.value;
        const conductoresVinculadosVehiculo = conductoresVinculados[vehiculoId] || [];

        // Verificar si se ha seleccionado un conductor y un vehículo
        if (conductorId && vehiculoId && conductorId !== '') {
            // Verificar si el conductor ya está vinculado al vehículo
            if (conductoresVinculadosVehiculo.some(conductor => conductor.id === conductorId)) {
                alert('El conductor ya está vinculado a este vehículo.');
                return;
            }
        } else if (conductorId === '') {
            alert('Debe seleccionar un conductor.');
        } else {
            console.log('No se ha seleccionado un conductor o un vehículo');
        }
    });

    const modalAddButtons = document.querySelectorAll('.modal-add');

    modalAddButtons.forEach(function (addButton) {
        addButton.addEventListener('click', function () {
            const type = this.getAttribute('data-type');
            if (type) {
                const modal = this.closest('.modal');
                const select = modal.querySelector('select');
                const selectedOption = select.options[select.selectedIndex];

                // Crear el elemento fichaElemento antes de cualquier verificación
                const fichaElemento = document.createElement('div');
                fichaElemento.classList.add('ficha-elemento');

                // Agregar conductor nominado al array antes de la verificación
                if (type === 'personal') {
                    const conductorCheckbox = document.querySelector(`#conductorCheckbox_${selectedOption.value}`);
                    if (conductorCheckbox && conductorCheckbox.checked) {
                        conductoresNominados.push(selectedOption.value);
                        console.log('Conductores nominados:', conductoresNominados);
                    }

                    if (selectedOption.value === ''){
                        alert('Seleccione una opción correcta.')
                        return
                    }
                }

                // Si el tipo es 'vehiculo'
                if (type === 'vehiculo') {
                    const conductoresVinculadosVehiculo = conductoresVinculados[selectedOption.value] || [];
                    const conductoresIds = conductoresVinculadosVehiculo.map(conductor => conductor.id).join(',');

                    // Verificar si hay menos de dos conductores vinculados al vehículo
                    if (conductoresVinculadosVehiculo.length < 2) {
                        alert('Debe haber al menos dos conductores vinculados a este vehículo.');
                        return;
                    }

                    // Asignar los IDs de los conductores vinculados al fichaElemento
                    fichaElemento.setAttribute('data-conductores', conductoresIds);
                    console.log('Conductores nominados:', conductoresNominados);
                    console.log('Conductores asignados al vehículo:', conductoresIds);
                }

                if (type === 'quimico'){
                    if (selectedOption.value === ''){
                        alert('Seleccione una opción correcta.')
                        return
                    }
                }

                if (type === 'vario'){
                    if (selectedOption.value === ''){
                        alert('Seleccione una opción correcta.')
                        return
                    }
                }

                // Crear el HTML personalizado según el tipo de elemento
                switch (type) {
                    case 'personal':
                        const nombre = selectedOption.getAttribute('data-nombre');
                        const cargo = selectedOption.getAttribute('data-cargo');
                        const conductor = selectedOption.getAttribute('data-conductor');
                        const esConductorNominado = conductoresNominados.includes(selectedOption.value);

                        fichaElemento.innerHTML = `
                            <button class="eliminar-ficha"><img src="${staticUrls.eliminarIcono}" alt="Eliminar" /></button>
                            <div class="ficha-nombre">${nombre}</div>
                            <div class="ficha-cargo">${cargo}</div>
                            ${conductor === 'Si' && esConductorNominado ? `<img src="${staticUrls.choferNominado}" alt="Conductor Nominado" class="icono-conductor-nominado" />` : ''}
                        `;
                        fichaElemento.classList.add('ficha-elemento-personal');
                        break;
                    case 'vehiculo':
                        const tipoVehiculo = selectedOption.getAttribute('data-tipo-vehiculo');
                        const patente = selectedOption.getAttribute('data-patente');

                        // Obtener los conductores vinculados al vehículo
                        const conductoresVinculadosVehiculo = conductoresVinculados[selectedOption.value] || [];

                        // Generar el HTML de las burbujas de iniciales de los conductores
                        const burbujasCondutores = conductoresVinculadosVehiculo.map(conductor => {
                            const iniciales = conductor.nombre.split(' ').map(nombre => nombre.charAt(0)).join('').toUpperCase();
                            return `<div class="burbuja-conductor">${iniciales}</div>`;
                        }).join('');

                        fichaElemento.innerHTML = `
                                <button class="eliminar-ficha"><img src="${staticUrls.eliminarIcono}" alt="Eliminar" /></button>
                                <div class="ficha-tipo-vehiculo">${tipoVehiculo}</div>
                                <div class="ficha-patente">${patente}</div>
                                <div class="conductores-vinculados">${burbujasCondutores}</div>
                            `;
                        fichaElemento.classList.add('ficha-elemento-vehiculo');
                        break;
                    case 'quimico':
                        const tipoQuimico = selectedOption.textContent;
                        fichaElemento.innerHTML = `
                            <button class="eliminar-ficha"><img src="${staticUrls.eliminarIcono}" alt="Eliminar" /></button>
                            <div class="ficha-tipo-quimico">${tipoQuimico}</div>
                        `;
                        fichaElemento.classList.add('ficha-elemento-quimico');
                        break;
                    case 'vario':
                        const nombreVario = selectedOption.textContent;
                        fichaElemento.innerHTML = `
                            <button class="eliminar-ficha"><img src="${staticUrls.eliminarIcono}" alt="Eliminar" /></button>
                            <div class="ficha-nombre-vario">${nombreVario}</div>
                        `;
                        fichaElemento.classList.add('ficha-elemento-vario');
                        break;
                }

                fichaElemento.setAttribute('data-id', selectedOption.value);

                // Agregar los atributos de datos originales al elemento fichaElemento según el tipo de elemento
                switch (type) {
                    case 'personal':
                        fichaElemento.setAttribute('data-nombre', selectedOption.getAttribute('data-nombre'));
                        fichaElemento.setAttribute('data-rut', selectedOption.getAttribute('data-rut'));
                        fichaElemento.setAttribute('data-cargo', selectedOption.getAttribute('data-cargo'));
                        fichaElemento.setAttribute('data-especialidades', selectedOption.getAttribute('data-especialidades'));
                        fichaElemento.setAttribute('data-conductor', selectedOption.getAttribute('data-conductor'));
                        fichaElemento.setAttribute('data-tipo-licencia', selectedOption.getAttribute('data-tipo-licencia'));
                        fichaElemento.setAttribute('data-estado', selectedOption.getAttribute('data-estado'));
                        break;
                    case 'vehiculo':
                        fichaElemento.setAttribute('data-tipo-vehiculo', selectedOption.getAttribute('data-tipo-vehiculo'));
                        fichaElemento.setAttribute('data-patente', selectedOption.getAttribute('data-patente'));
                        fichaElemento.setAttribute('data-marca', selectedOption.getAttribute('data-marca'));
                        fichaElemento.setAttribute('data-modelo', selectedOption.getAttribute('data-modelo'));
                        fichaElemento.setAttribute('data-color', selectedOption.getAttribute('data-color'));
                        fichaElemento.setAttribute('data-numero-motor', selectedOption.getAttribute('data-numero-motor'));
                        fichaElemento.setAttribute('data-numero-chasis', selectedOption.getAttribute('data-numero-chasis'));
                        fichaElemento.setAttribute('data-cilindrada', selectedOption.getAttribute('data-cilindrada'));
                        fichaElemento.setAttribute('data-primer-ingreso', selectedOption.getAttribute('data-primer-ingreso'));
                        fichaElemento.setAttribute('data-fecha-permiso-circulacion', selectedOption.getAttribute('data-fecha-permiso-circulacion'));
                        fichaElemento.setAttribute('data-fecha-soap', selectedOption.getAttribute('data-fecha-soap'));
                        fichaElemento.setAttribute('data-fecha-revision-tecnica', selectedOption.getAttribute('data-fecha-revision-tecnica'));
                        fichaElemento.setAttribute('data-seguro-nombre', selectedOption.getAttribute('data-seguro-nombre'));
                        fichaElemento.setAttribute('data-seguro-poliza', selectedOption.getAttribute('data-seguro-poliza'));
                        fichaElemento.setAttribute('data-tipo-combustible', selectedOption.getAttribute('data-tipo-combustible'));
                        fichaElemento.setAttribute('data-estado', selectedOption.getAttribute('data-estado'));
                        break;
                    case 'quimico':
                        fichaElemento.setAttribute('data-fecha-ingreso', selectedOption.getAttribute('data-fecha-ingreso'));
                        fichaElemento.setAttribute('data-litros-ingreso', selectedOption.getAttribute('data-litros-ingreso'));
                        fichaElemento.setAttribute('data-numero-factura', selectedOption.getAttribute('data-numero-factura'));
                        fichaElemento.setAttribute('data-estado', selectedOption.getAttribute('data-estado'));
                        break;
                    case 'vario':
                        fichaElemento.setAttribute('data-fecha-ingreso', selectedOption.getAttribute('data-fecha-ingreso'));
                        fichaElemento.setAttribute('data-estado', selectedOption.getAttribute('data-estado'));
                        break;
                }

                // Eliminar la opción seleccionada del select
                select.removeChild(selectedOption);

                // Agregar evento de clic al botón de eliminar
                const eliminarButton = fichaElemento.querySelector('.eliminar-ficha');
                eliminarButton.addEventListener('click', function (event) {
                    event.stopPropagation();
                    const elementoId = fichaElemento.getAttribute('data-id');
                    const type = fichaElemento.classList.contains('ficha-elemento-personal') ? 'personal' : 'vehiculo';

                    if (type === 'personal') {
                        // Verificar si el personal está vinculado a algún vehículo
                        const estaVinculado = Object.values(conductoresVinculados).some(conductores => conductores.some(conductor => conductor.id === elementoId));

                        if (estaVinculado) {
                            event.preventDefault();
                            personalVinculadoAlertShown = true; // Establecer la variable a true
                            alert('No se puede eliminar este personal porque está vinculado a un vehículo.');
                            return;
                        }
                    }

                    // Código de eliminación de ficha de personal
                    fichaElemento.remove();
                    getSelectedElements();

                    // Agregar la opción de vuelta al select con todos los atributos de datos originales
                    const option = document.createElement('option');
                    option.value = fichaElemento.getAttribute('data-id');
                    option.textContent = selectedOption.textContent;

                    // Agregar los atributos de datos originales según el tipo de elemento
                    switch (type) {
                        case 'personal':
                            option.setAttribute('data-nombre', fichaElemento.getAttribute('data-nombre'));
                            option.setAttribute('data-rut', fichaElemento.getAttribute('data-rut'));
                            option.setAttribute('data-cargo', fichaElemento.getAttribute('data-cargo'));
                            option.setAttribute('data-especialidades', fichaElemento.getAttribute('data-especialidades'));
                            option.setAttribute('data-conductor', fichaElemento.getAttribute('data-conductor'));
                            option.setAttribute('data-tipo-licencia', fichaElemento.getAttribute('data-tipo-licencia'));
                            option.setAttribute('data-estado', fichaElemento.getAttribute('data-estado'));
                            break;
                        case 'vehiculo':
                            option.setAttribute('data-tipo-vehiculo', fichaElemento.getAttribute('data-tipo-vehiculo'));
                            option.setAttribute('data-patente', fichaElemento.getAttribute('data-patente'));
                            option.setAttribute('data-marca', fichaElemento.getAttribute('data-marca'));
                            option.setAttribute('data-modelo', fichaElemento.getAttribute('data-modelo'));
                            option.setAttribute('data-color', fichaElemento.getAttribute('data-color'));
                            option.setAttribute('data-numero-motor', fichaElemento.getAttribute('data-numero-motor'));
                            option.setAttribute('data-numero-chasis', fichaElemento.getAttribute('data-numero-chasis'));
                            option.setAttribute('data-cilindrada', fichaElemento.getAttribute('data-cilindrada'));
                            option.setAttribute('data-primer-ingreso', fichaElemento.getAttribute('data-primer-ingreso'));
                            option.setAttribute('data-fecha-permiso-circulacion', fichaElemento.getAttribute('data-fecha-permiso-circulacion'));
                            option.setAttribute('data-fecha-soap', fichaElemento.getAttribute('data-fecha-soap'));
                            option.setAttribute('data-fecha-revision-tecnica', fichaElemento.getAttribute('data-fecha-revision-tecnica'));
                            option.setAttribute('data-seguro-nombre', fichaElemento.getAttribute('data-seguro-nombre'));
                            option.setAttribute('data-seguro-poliza', fichaElemento.getAttribute('data-seguro-poliza'));
                            option.setAttribute('data-tipo-combustible', fichaElemento.getAttribute('data-tipo-combustible'));
                            option.setAttribute('data-estado', fichaElemento.getAttribute('data-estado'));
                            break;
                        case 'quimico':
                            option.setAttribute('data-fecha-ingreso', fichaElemento.getAttribute('data-fecha-ingreso'));
                            option.setAttribute('data-litros-ingreso', fichaElemento.getAttribute('data-litros-ingreso'));
                            option.setAttribute('data-numero-factura', fichaElemento.getAttribute('data-numero-factura'));
                            option.setAttribute('data-estado', fichaElemento.getAttribute('data-estado'));
                            break;
                        case 'vario':
                            option.setAttribute('data-fecha-ingreso', fichaElemento.getAttribute('data-fecha-ingreso'));
                            option.setAttribute('data-estado', fichaElemento.getAttribute('data-estado'));
                            break;
                    }

                    select.appendChild(option);

                    // Eliminar el conductor nominado de la lista si se elimina el personal
                    if (type === 'personal') {
                        const personalId = fichaElemento.getAttribute('data-id');
                        const index = conductoresNominados.indexOf(personalId);
                        if (index > -1) {
                            conductoresNominados.splice(index, 1);
                            console.log('Conductores nominados:', conductoresNominados);
                        }
                    }

                    // Si el tipo es "vehiculo", desvincula los conductores
                    if (type === 'vehiculo') {
                        const vehiculoId = fichaElemento.getAttribute('data-id');
                        if (conductoresVinculados[vehiculoId]) {
                            const conductoresAsignados = conductoresVinculados[vehiculoId];
                            conductoresAsignados.forEach(function (conductor) {
                                const index = conductoresOcupados.indexOf(conductor.id);
                                if (index > -1) {
                                    conductoresOcupados.splice(index, 1);
                                }

                                // Agregar el conductor al arreglo conductoresNominados
                                if (!conductoresNominados.includes(conductor.id)) {
                                    conductoresNominados.push(conductor.id);
                                    console.log('Conductores nominados:', conductoresNominados);
                                }
                            });
                            delete conductoresVinculados[vehiculoId];
                        }
                    }

                    // Eliminar los conductores vinculados del atributo data-conductores
                    const conductoresIds = fichaElemento.getAttribute('data-conductores');
                    if (conductoresIds) {
                        const conductoresIdArray = conductoresIds.split(',');
                        conductoresIdArray.forEach(function (conductorId) {
                            const index = conductoresOcupados.indexOf(conductorId);
                            if (index > -1) {
                                conductoresOcupados.splice(index, 1);
                            }
                        });
                    }
                });

                // Aplicar estilos CSS al elemento fichaElemento según el tipo de elemento
                switch (type) {
                    case 'personal':
                        fichaElemento.style.textAlign = 'center';
                        fichaElemento.style.padding = '2px';
                        fichaElemento.style.width = '18vw';
                        fichaElemento.style.height = '12vh';
                        fichaElemento.style.backgroundColor = '#052242';
                        fichaElemento.style.border = 'none';
                        fichaElemento.style.borderRadius = '5px';
                        fichaElemento.style.margin = '0 auto';
                        fichaElemento.style.marginBottom = '3%';
                        break;
                    case 'vehiculo':
                        fichaElemento.style.textAlign = 'center';
                        fichaElemento.style.padding = '2px';
                        fichaElemento.style.width = '18vw';
                        fichaElemento.style.height = '12vh';
                        fichaElemento.style.backgroundColor = '#052242';
                        fichaElemento.style.border = 'none';
                        fichaElemento.style.borderRadius = '5px';
                        fichaElemento.style.margin = '0 auto';
                        fichaElemento.style.marginBottom = '3%';
                        break;
                    case 'quimico':
                        fichaElemento.style.textAlign = 'center';
                        fichaElemento.style.padding = '2px';
                        fichaElemento.style.width = '18vw';
                        fichaElemento.style.height = '12vh';
                        fichaElemento.style.backgroundColor = '#052242';
                        fichaElemento.style.border = 'none';
                        fichaElemento.style.borderRadius = '5px';
                        fichaElemento.style.margin = '0 auto';
                        fichaElemento.style.marginBottom = '3%';
                        break;
                    case 'vario':
                        fichaElemento.style.textAlign = 'center';
                        fichaElemento.style.padding = '2px';
                        fichaElemento.style.width = '18vw';
                        fichaElemento.style.height = '12vh';
                        fichaElemento.style.backgroundColor = '#052242';
                        fichaElemento.style.border = 'none';
                        fichaElemento.style.borderRadius = '5px';
                        fichaElemento.style.margin = '0 auto';
                        fichaElemento.style.marginBottom = '3%';
                        break;
                }
                const columnaContenido = document.querySelector(`#column${type.charAt(0).toUpperCase() + type.slice(1)} .columna-contenido`);
                columnaContenido.insertBefore(fichaElemento, columnaContenido.firstChild);

                modal.style.display = 'none';

                getSelectedElements();

                // Restablecer la información mostrada en el modal
                switch (type) {
                    case 'personal':
                        resetPersonalModal();
                        break;
                    case 'vehiculo':
                        resetVehiculoModal();
                        break;
                    case 'quimico':
                        resetQuimicoModal();
                        break;
                    case 'vario':
                        resetVarioModal();
                        break;
                }
            }
        });
    });

    const form = document.getElementById('fichaServicioForm');
    form.addEventListener('submit', function (event) {
        if (personalVinculadoAlertShown) {
            event.preventDefault(); // Detener el envío del formulario
            personalVinculadoAlertShown = false; // Reiniciar la variable de control
            return;
        }

        event.preventDefault(); // Evita que el formulario se envíe de inmediato

        // Validar datos de la motonave o navío
        const puerto = document.getElementById('puerto');
        const procedenciaCarga = document.querySelector('input[name="procedencia_carga"]');
        const armador = document.querySelector('input[name="armador"]');
        const agencia = document.querySelector('input[name="agencia"]');
        const proxPuerto = document.getElementById('proxPuerto');

        if (puerto.value === '') {
            alert('Debe seleccionar un puerto.');
            return;
        }

        if (procedenciaCarga.value.trim() === '') {
            alert('Debe ingresar la procedencia de la carga.');
            return;
        }

        if (armador.value.trim() === '') {
            alert('Debe ingresar el armador.');
            return;
        }

        if (agencia.value.trim() === '') {
            alert('Debe ingresar la agencia.');
            return;
        }

        if (proxPuerto.value === '') {
            alert('Debe seleccionar un próximo puerto.');
            return;
        }

        // Validar datos del servicio
        const tipoServicio = document.querySelector('input[name="tipo_servicio"]');
        const bodegasARealizar = document.querySelector('input[name="bodegas_a_realizar"]');
        const bodegasTotales = document.querySelector('input[name="bodegas_totales"]');
        const hospedaje = document.getElementById('hospedaje');
        const lancha = document.getElementById('lancha');
        const grua = document.getElementById('grua');
        const arriendoBomba = document.getElementById('arriendo_bomba');
        const navegacion = document.querySelector('input[name="navegacion"]');

        if (tipoServicio.value.trim() === '') {
            alert('Debe ingresar el tipo de servicio.');
            return;
        }

        const bodegasARealizarValue = parseInt(bodegasARealizar.value);
        const bodegasTotalesValue = parseInt(bodegasTotales.value);

        if (isNaN(bodegasARealizarValue) || bodegasARealizarValue <= 0 || bodegasARealizarValue > bodegasTotalesValue) {
            alert('Las bodegas a realizar deben ser un número entero positivo y menor o igual a las bodegas totales.');
            return;
        }

        if (hospedaje.value === '') {
            alert('Debe seleccionar una opción para hospedaje.');
            return;
        }

        if (lancha.value === '') {
            alert('Debe seleccionar una opción para lancha.');
            return;
        }

        if (grua.value === '') {
            alert('Debe seleccionar una opción para grúa.');
            return;
        }

        if (arriendoBomba.value === '') {
            alert('Debe seleccionar una opción para arriendo de bomba.');
            return;
        }

        if (navegacion.value.trim() === '') {
            alert('Debe ingresar la navegación.');
            return;
        }

        // Validar nominaciones
        const selectedPersonal = document.querySelectorAll('#columnPersonal .ficha-elemento');

        if (selectedPersonal.length === 0) {
            alert('Debe seleccionar al menos un personal en las nominaciones.');
            return;
        }

        // Obtener los elementos seleccionados
        getSelectedElements();

        // Convertir el objeto conductoresVinculados a una cadena JSON
        const conductoresVinculadosJSON = JSON.stringify(conductoresVinculados);

        // Asignar la cadena JSON al valor del campo oculto
        document.getElementById('conductores_vinculados').value = conductoresVinculadosJSON;

        // Obtener los valores de los campos ocultos
        const personalNominado = document.getElementById('personal_nominado').value;
        const vehiculosNominados = document.getElementById('vehiculos_nominados').value;
        const quimicosNominados = document.getElementById('quimicos_nominados').value;
        const variosNominados = document.getElementById('varios_nominados').value;

        // Mostrar los valores en la consola del navegador
        console.log("Datos enviados:");
        console.log("Personal nominado:", personalNominado);
        console.log("Vehículos nominados:", vehiculosNominados);
        console.log("Químicos nominados:", quimicosNominados);
        console.log("Varios nominados:", variosNominados);
        console.log("Conductores vinculados: ", conductoresVinculadosJSON)

        // Enviar el formulario manualmente
        this.submit();
    });
});