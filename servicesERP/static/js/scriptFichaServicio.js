document.addEventListener('DOMContentLoaded', function () {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const modalAddButtons = document.querySelectorAll('.modal-add');

    modalTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);
            modal.style.display = 'block';
        });
    });

    modalCloseButtons.forEach(function (closeButton) {
        closeButton.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
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