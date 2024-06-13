let conductoresNominados = [];
let conductoresOcupados = [];
let conductoresVinculados = {};
let personalVinculadoAlertShown = false;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('conductorCheckboxContainer').innerHTML = '';

    const personalSelect = document.getElementById('personalSelect');
    const personalInfo = document.getElementById('personalInfo');
    const cargoCheckboxes = document.querySelectorAll('#cargoCheckboxes input[type="checkbox"]');

    cargoCheckboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const selectedCargos = Array.from(cargoCheckboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
            const personalOptions = personalSelect.options;
            for (let i = 0; i < personalOptions.length; i++) {
                const option = personalOptions[i];
                if (option.value === "") {
                    option.style.display = "block";
                } else {
                    const cargo = option.getAttribute('data-cargo');
                    if (selectedCargos.length === 0 || selectedCargos.includes(cargo)) {
                        option.style.display = "block";
                    } else {
                        option.style.display = "none";
                    }
                }
            }
            personalSelect.selectedIndex = 0;
            const personalInfo = document.getElementById('personalInfo');
            personalInfo.innerHTML = '';

        });
    });

    personalSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const rut = selectedOption.getAttribute('data-rut');
            const cargo = selectedOption.getAttribute('data-cargo');
            const especialidades = selectedOption.getAttribute('data-especialidades');
            const conductor = selectedOption.getAttribute('data-conductor');
            const tipoLicencia = selectedOption.getAttribute('data-tipo-licencia');
            const estado = selectedOption.getAttribute('data-estado');

            personalInfo.innerHTML = `
            <p class="personal-info"><strong>RUT:</strong> ${rut}</p>
            <p class="personal-info"><strong>Cargo:</strong> ${cargo}</p>
            <p class="personal-info"><strong>Especialidades:</strong> ${especialidades}</p>
            <p class="personal-info"><strong>Conductor:</strong> ${conductor}</p>
            <p class="personal-info"><strong>Tipo de Licencia:</strong> ${tipoLicencia}</p>
            <p class="personal-info"><strong>Estado:</strong> ${estado}</p>
        `;

            const conductorCheckboxContainer = document.getElementById('conductorCheckboxContainer');
            if (conductor === 'Si') {
                conductorCheckboxContainer.innerHTML = `
                <input type="checkbox" id="conductorCheckbox_${selectedOption.value}" data-personal-id="${selectedOption.value}" style="margin-right: 5px;">
                <label for="conductorCheckbox_${selectedOption.value}">Asignar como conductor nominado</label>
            `;
                document.getElementById(`conductorCheckbox_${selectedOption.value}`).checked = false; // Desmarcar el checkbox por defecto
            } else {
                conductorCheckboxContainer.innerHTML = '';
            }
        } else {
            personalInfo.innerHTML = '';
            document.getElementById('conductorCheckboxContainer').innerHTML = '';
        }
    });

    const vehiculoSelect = document.getElementById('vehiculoSelect');
    const vehiculoInfo = document.getElementById('vehiculoInfo');

    vehiculoSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const conductoresNominadosContainer = document.getElementById('conductoresNominadosContainer');
        if (selectedOption.value) {
            const marca = selectedOption.getAttribute('data-marca');
            const modelo = selectedOption.getAttribute('data-modelo');
            const color = selectedOption.getAttribute('data-color');
            const numeroMotor = selectedOption.getAttribute('data-numero-motor');
            const numeroChasis = selectedOption.getAttribute('data-numero-chasis');
            const cilindrada = selectedOption.getAttribute('data-cilindrada');
            const primerIngreso = selectedOption.getAttribute('data-primer-ingreso');
            const fechaPermisoCirculacion = selectedOption.getAttribute('data-fecha-permiso-circulacion');
            const fechaSoap = selectedOption.getAttribute('data-fecha-soap');
            const fechaRevisionTecnica = selectedOption.getAttribute('data-fecha-revision-tecnica');
            const seguroNombre = selectedOption.getAttribute('data-seguro-nombre');
            const seguroPoliza = selectedOption.getAttribute('data-seguro-poliza');
            const tipoCombustible = selectedOption.getAttribute('data-tipo-combustible');
            const estado = selectedOption.getAttribute('data-estado');

            vehiculoInfo.innerHTML = `
            <p class="vehiculo-info"><strong>Marca:</strong> ${marca}</p>
            <p class="vehiculo-info"><strong>Modelo:</strong> ${modelo}</p>
            <p class="vehiculo-info"><strong>Color:</strong> ${color}</p>
            <p class="vehiculo-info"><strong>Número Motor:</strong> ${numeroMotor}</p>
            <p class="vehiculo-info"><strong>Número Chasis:</strong> ${numeroChasis}</p>
            <p class="vehiculo-info"><strong>Cilindrada:</strong> ${cilindrada}</p>
            <p class="vehiculo-info"><strong>Primer Ingreso:</strong> ${primerIngreso}</p>
            <p class="vehiculo-info"><strong>Fecha Permiso Circulación:</strong> ${fechaPermisoCirculacion}</p>
            <p class="vehiculo-info"><strong>Fecha SOAP:</strong> ${fechaSoap}</p>
            <p class="vehiculo-info"><strong>Fecha Revisión Técnica:</strong> ${fechaRevisionTecnica}</p>
            <p class="vehiculo-info"><strong>Seguro Nombre:</strong> ${seguroNombre}</p>
            <p class="vehiculo-info"><strong>Seguro Poliza:</strong> ${seguroPoliza}</p>
            <p class="vehiculo-info"><strong>Tipo Combustible:</strong> ${tipoCombustible}</p>
            <p class="vehiculo-info"><strong>Estado:</strong> ${estado}</p>
            `;

            // Mostrar el contenedor de los conductores nominados
            conductoresNominadosContainer.classList.remove('hidden');

            // Obtener los conductores nominados
            conductoresNominadosSelect = document.getElementById('conductoresNominados');
            conductoresNominadosSelect.innerHTML = '';

            // Agregar opción vacía
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = 'Seleccionar conductor';
            conductoresNominadosSelect.appendChild(emptyOption);

            const vehiculoId = vehiculoSelect.value;
            const conductoresVinculadosVehiculo = conductoresVinculados[vehiculoId] || [];

            conductoresNominados.forEach(function (conductorId) {
                // Verificar si el conductor no está ocupado y no está vinculado al vehículo actual
                if (!conductoresOcupados.includes(conductorId) && (!conductoresVinculadosVehiculo || !conductoresVinculadosVehiculo.some(conductor => conductor.id === conductorId))) {
                    const conductorOption = document.createElement('option');
                    conductorOption.value = conductorId;
                    // Obtener el nombre del conductor a partir de su ID
                    const conductorElement = document.querySelector(`#columnPersonal .ficha-elemento[data-id="${conductorId}"]`);
                    const conductorNombre = conductorElement ? conductorElement.getAttribute('data-nombre') : 'Desconocido';

                    conductorOption.textContent = conductorNombre;
                    conductoresNominadosSelect.appendChild(conductorOption);
                }
            });

            actualizarListaConductoresVinculados(vehiculoId);

        } else {
            // Ocultar el contenedor de los conductores nominados cuando no se selecciona un vehículo
            conductoresNominadosContainer.classList.add('hidden');

            vehiculoInfo.innerHTML = '';
        }
    });

    const agregarConductorBtn = document.getElementById('agregarConductor');
    agregarConductorBtn.addEventListener('click', function () {
        const conductorSelect = document.getElementById('conductoresNominados');
        const conductorId = conductorSelect.value;
        const vehiculoId = vehiculoSelect.value;
        const conductoresVinculadosVehiculo = conductoresVinculados[vehiculoId] || [];

        // Verificar si se ha seleccionado un conductor y un vehículo
        if (conductorId && vehiculoId && conductorId !== '') {

            // Guardar el ID del vehículo seleccionado en la variable global
            vehiculoSeleccionadoId = vehiculoId;

            // Verificar si el conductor ya está vinculado al vehículo
            if (conductoresVinculadosVehiculo.some(conductor => conductor.id === conductorId)) {
                alert('El conductor ya está vinculado a este vehículo.');
                return;
            }

            // Verificar si ya hay dos conductores vinculados al vehículo
            if (conductoresVinculadosVehiculo.length >= 2) {
                alert('Ya hay dos conductores vinculados a este vehículo. No se pueden agregar más.');
                return;
            }

            // Obtener el nombre del conductor
            const conductorElement = document.querySelector(`#columnPersonal .ficha-elemento[data-id="${conductorId}"]`);
            const conductorNombre = conductorElement ? conductorElement.getAttribute('data-nombre') : 'Desconocido';

            // Agregar el conductor vinculado al vehículo en el objeto conductoresVinculados
            if (!conductoresVinculados[vehiculoId]) {
                conductoresVinculados[vehiculoId] = [];
            }
            conductoresVinculados[vehiculoId].push({ id: conductorId, nombre: conductorNombre });

            // Imprimir el objeto conductoresVinculados en la consola
            console.log('Conductores vinculados:', conductoresVinculados);

            // Actualizar la lista de conductores vinculados
            actualizarListaConductoresVinculados(vehiculoId);

            // Agregar el conductor al objeto conductoresOcupados si no está presente
            if (!conductoresOcupados.includes(conductorId)) {
                conductoresOcupados.push(conductorId);
                console.log('Conductores ocupados:', conductoresOcupados);
            }

            // Eliminar el conductor del arreglo conductoresNominados y del select
            const index = conductoresNominados.indexOf(conductorId);
            if (index > -1) {
                conductoresNominados.splice(index, 1);
                console.log('Conductores nominados:', conductoresNominados);
                conductorSelect.remove(conductorSelect.selectedIndex);
            }
        } else if (conductorId === '') {
            alert('Debe seleccionar un conductor.');
        } else {
            console.log('No se ha seleccionado un conductor o un vehículo');
        }
    });

    function actualizarListaConductoresVinculados(vehiculoId) {
        const conductoresVinculadosContainer = document.getElementById('conductoresVinculadosContainer');
        conductoresVinculadosContainer.innerHTML = '';
    
        if (conductoresVinculados[vehiculoId]) {
            const conductoresVinculadosList = document.createElement('ul');
            conductoresVinculadosList.id = 'conductoresVinculadosList';
            conductoresVinculados[vehiculoId].forEach(function (conductor) {
                const conductorItem = document.createElement('li');
                conductorItem.classList.add('especialidad');
                conductorItem.setAttribute('data-id', conductor.id);
                conductorItem.textContent = conductor.nombre;
    
                const eliminarBtn = document.createElement('button');
                eliminarBtn.textContent = 'X';
                eliminarBtn.classList.add('eliminar-especialidad');
                eliminarBtn.addEventListener('click', function () {
                    eliminarConductorVinculado(vehiculoId, conductor.id);
                });
    
                conductorItem.appendChild(eliminarBtn);
                conductoresVinculadosList.appendChild(conductorItem);
            });
            conductoresVinculadosContainer.appendChild(conductoresVinculadosList);
        }
    }

    function eliminarConductorVinculado(vehiculoId, conductorId) {
        const conductoresVinculadosVehiculo = conductoresVinculados[vehiculoId];
        const index = conductoresVinculadosVehiculo.findIndex(conductor => conductor.id === conductorId);
    
        if (index > -1) {
            conductoresVinculadosVehiculo.splice(index, 1);
            console.log('Conductores vinculados:', conductoresVinculados);
    
            // Agregar el conductor al arreglo conductoresNominados y al select
            conductoresNominados.push(conductorId);
            console.log('Conductores nominados:', conductoresNominados);
    
            const conductorSelect = document.getElementById('conductoresNominados');
            const conductorElement = document.querySelector(`#columnPersonal .ficha-elemento[data-id="${conductorId}"]`);
            const conductorNombre = conductorElement ? conductorElement.getAttribute('data-nombre') : 'Desconocido';
            const conductorOption = document.createElement('option');
            conductorOption.value = conductorId;
            conductorOption.textContent = conductorNombre;
            conductorSelect.appendChild(conductorOption);
    
            // Eliminar el conductor del arreglo conductoresOcupados
            const ocupadosIndex = conductoresOcupados.indexOf(conductorId);
            if (ocupadosIndex > -1) {
                conductoresOcupados.splice(ocupadosIndex, 1);
                console.log('Conductores ocupados:', conductoresOcupados);
            }
    
            // Actualizar la lista de conductores vinculados
            actualizarListaConductoresVinculados(vehiculoId);
        }
    }
});
