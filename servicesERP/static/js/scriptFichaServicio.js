document.addEventListener('DOMContentLoaded', function () {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalAddButtons = document.querySelectorAll('.modal-add');

    modalTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    function resetPersonalModal() {
        const personalSelect = document.querySelector('#personalModal #personalSelect');
        personalSelect.selectedIndex = 0;
        const personalInfo = document.querySelector('#personalModal #personalInfo');
        personalInfo.innerHTML = '';

        // Reiniciar los checkbox de los cargos
        const cargoCheckboxes = document.querySelectorAll('#cargoCheckboxes input[type="checkbox"]');
        cargoCheckboxes.forEach(function (checkbox) {
            checkbox.checked = false;
        });

        // Mostrar todas las opciones del select de personal
        const personalOptions = personalSelect.options;
        for (let i = 0; i < personalOptions.length; i++) {
            const option = personalOptions[i];
            option.style.display = "block";
        }
    }

    function resetVehiculoModal() {
        const vehiculoSelect = document.querySelector('#vehiculoModal #vehiculoSelect');
        vehiculoSelect.selectedIndex = 0;
        const vehiculoInfo = document.querySelector('#vehiculoModal #vehiculoInfo');
        vehiculoInfo.innerHTML = '';
    }

    function resetQuimicoModal() {
        const quimicoSelect = document.querySelector('#quimicoModal #quimicoSelect');
        quimicoSelect.selectedIndex = 0;
        const quimicoInfo = document.querySelector('#quimicoModal #quimicoInfo');
        quimicoInfo.innerHTML = '';
    }

    function resetVarioModal() {
        const varioSelect = document.querySelector('#varioModal #varioSelect');
        varioSelect.selectedIndex = 0;
        const varioInfo = document.querySelector('#varioModal #varioInfo');
        varioInfo.innerHTML = '';
    }

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            const modalId = event.target.id;
    
            switch (modalId) {
                case 'personalModal':
                    resetPersonalModal();
                    break;
                case 'vehiculoModal':
                    resetVehiculoModal();
                    break;
                case 'quimicoModal':
                    resetQuimicoModal();
                    break;
                case 'varioModal':
                    resetVarioModal();
                    break;
            }
        }
    });

    modalAddButtons.forEach(function (addButton) {
        addButton.addEventListener('click', function () {
            const type = this.getAttribute('data-type');
            if (type) {
                const modal = this.closest('.modal');
                const select = modal.querySelector('select');
                const selectedOption = select.options[select.selectedIndex];
                const selectedText = selectedOption.textContent;

                const fichaElemento = document.createElement('div');
                fichaElemento.classList.add('ficha-elemento');
                fichaElemento.textContent = selectedText;
                fichaElemento.setAttribute('data-id', selectedOption.value);

                // Agregar evento de clic para eliminar el elemento
                fichaElemento.addEventListener('click', function () {
                    this.remove();
                    getSelectedElements();
                });

                const columnaContenido = document.querySelector(`#column${type.charAt(0).toUpperCase() + type.slice(1)} .columna-contenido`);
                columnaContenido.insertBefore(fichaElemento, columnaContenido.firstChild);

                modal.style.display = 'none';

                getSelectedElements();
            }
        });
    });

    const form = document.getElementById('fichaServicioForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de inmediato

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

        // Enviar el formulario manualmente
        this.submit();
    });

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
        } else {
            personalInfo.innerHTML = '';
        }
    });

    const vehiculoSelect = document.getElementById('vehiculoSelect');
    const vehiculoInfo = document.getElementById('vehiculoInfo');

    vehiculoSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
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
        } else {
            vehiculoInfo.innerHTML = '';
        }
    });

    const quimicoSelect = document.getElementById('quimicoSelect');
    const quimicoInfo = document.getElementById('quimicoInfo');

    quimicoSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const fechaIngreso = selectedOption.getAttribute('data-fecha-ingreso');
            const litrosIngreso = selectedOption.getAttribute('data-litros-ingreso');
            const numeroFactura = selectedOption.getAttribute('data-numero-factura');
            const estado = selectedOption.getAttribute('data-estado');

            quimicoInfo.innerHTML = `
            <p class="quimico-info"><strong>Fecha Ingreso:</strong> ${fechaIngreso}</p>
            <p class="quimico-info"><strong>Litros Ingreso:</strong> ${litrosIngreso}</p>
            <p class="quimico-info"><strong>Número Factura:</strong> ${numeroFactura}</p>
            <p class="quimico-info"><strong>Estado:</strong> ${estado}</p>
        `;
        } else {
            quimicoInfo.innerHTML = '';
        }
    });

    const varioSelect = document.getElementById('varioSelect');
    const varioInfo = document.getElementById('varioInfo');

    varioSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const fechaIngreso = selectedOption.getAttribute('data-fecha-ingreso');
            const estado = selectedOption.getAttribute('data-estado');

            varioInfo.innerHTML = `
            <p class="vario-info"><strong>Fecha Ingreso:</strong> ${fechaIngreso}</p>
            <p class="vario-info"><strong>Estado:</strong> ${estado}</p>
        `;
        } else {
            varioInfo.innerHTML = '';
        }
    });
});

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