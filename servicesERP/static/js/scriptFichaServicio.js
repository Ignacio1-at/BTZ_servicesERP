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

                const columnaContenido = document.querySelector(`#column${type.charAt(0).toUpperCase() + type.slice(1)} .columna-contenido`);
                columnaContenido.insertBefore(fichaElemento, columnaContenido.firstChild);

                modal.style.display = 'none';
            }
        });
    });
});

function getSelectedElements() {
    const selectedPersonalIds = Array.from(document.querySelectorAll('#columnPersonal .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedVehiculoIds = Array.from(document.querySelectorAll('#columnVehiculo .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedQuimicoIds = Array.from(document.querySelectorAll('#columnQuimico .ficha-elemento')).map(el => el.getAttribute('data-id'));
    const selectedVarioIds = Array.from(document.querySelectorAll('#columnVario .ficha-elemento')).map(el => el.getAttribute('data-id'));

    const selectedElements = {};

    if (selectedPersonalIds.length > 0) {
        selectedElements.personal = selectedPersonalIds;
    }

    if (selectedVehiculoIds.length > 0) {
        selectedElements.vehiculos = selectedVehiculoIds;
    }

    if (selectedQuimicoIds.length > 0) {
        selectedElements.quimicos = selectedQuimicoIds;
    }

    if (selectedVarioIds.length > 0) {
        selectedElements.varios = selectedVarioIds;
    }

    return selectedElements;
}

const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    const selectedElements = getSelectedElements();

    // Limpiar los valores de los campos ocultos antes de actualizar
    document.getElementById('personal_nominado').value = '';
    document.getElementById('vehiculos_nominados').value = '';
    document.getElementById('quimicos_nominados').value = '';
    document.getElementById('varios_nominados').value = '';

    // Actualizar los valores de los campos ocultos solo si hay elementos seleccionados
    if (selectedElements.personal) {
        document.getElementById('personal_nominado').value = selectedElements.personal.join(',');
    }

    if (selectedElements.vehiculos) {
        document.getElementById('vehiculos_nominados').value = selectedElements.vehiculos.join(',');
    }

    if (selectedElements.quimicos) {
        document.getElementById('quimicos_nominados').value = selectedElements.quimicos.join(',');
    }

    if (selectedElements.varios) {
        document.getElementById('varios_nominados').value = selectedElements.varios.join(',');
    }
});