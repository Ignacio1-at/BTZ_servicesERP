// Función para restablecer el modal de personal
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

    // Ocultar el checkbox de conductor nominado al restablecer el modal
    document.getElementById('conductorCheckboxContainer').innerHTML = '';
}

// Función para restablecer el modal de vehículo
function resetVehiculoModal() {
    const vehiculoSelect = document.querySelector('#vehiculoModal #vehiculoSelect');
    vehiculoSelect.selectedIndex = 0;
    const vehiculoInfo = document.querySelector('#vehiculoModal #vehiculoInfo');
    vehiculoInfo.innerHTML = '';

    // Ocultar el contenedor de los conductores nominados al restablecer el modal
    const conductoresNominadosContainer = document.getElementById('conductoresNominadosContainer');
    conductoresNominadosContainer.classList.add('hidden');
}

// Función para restablecer el modal de químico
function resetQuimicoModal() {
    const quimicoSelect = document.querySelector('#quimicoModal #quimicoSelect');
    quimicoSelect.selectedIndex = 0;
    const quimicoInfo = document.querySelector('#quimicoModal #quimicoInfo');
    quimicoInfo.innerHTML = '';
}

// Función para restablecer el modal de vario
function resetVarioModal() {
    const varioSelect = document.querySelector('#varioModal #varioSelect');
    varioSelect.selectedIndex = 0;
    const varioInfo = document.querySelector('#varioModal #varioInfo');
    varioInfo.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function () {
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    // Agregar evento de clic a los botones que abren los modales
    modalTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (event) {
            event.preventDefault();
            const modalId = this.getAttribute('data-target');
            const modal = document.getElementById(modalId);

            // Verificar si hay al menos dos conductores nominados antes de abrir el modal de vehículo
            if (modalId === 'vehiculoModal') {
                if (conductoresNominados.length < 2) {
                    alert('Debe haber al menos dos conductores nominados antes de abrir el modal de vehículo.');
                    return;
                }
            }

            modal.style.display = 'block';
        });
    });

    // Agregar evento de clic al documento para cerrar los modales al hacer clic fuera de ellos
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            const modalId = event.target.id;

            // Restablecer el modal correspondiente según su ID
            switch (modalId) {
                case 'personalModal':
                    resetPersonalModal();
                    break;
                case 'vehiculoModal':
                    resetVehiculoModal();
                    limpiarVinculacionesConductoresVehiculo(); // Llamar a la nueva función
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
});

let vehiculoSeleccionadoId = null;

function limpiarVinculacionesConductoresVehiculo() {
    const vehiculoId = vehiculoSeleccionadoId;

    if (vehiculoId && conductoresVinculados[vehiculoId]) {
        const conductoresAsignados = conductoresVinculados[vehiculoId];

        conductoresAsignados.forEach(function (conductor) {
            const index = conductoresOcupados.indexOf(conductor.id);
            if (index > -1) {
                conductoresOcupados.splice(index, 1);
            }

            // Agregar el conductor al arreglo conductoresNominados solo si no está presente
            if (!conductoresNominados.includes(conductor.id)) {
                conductoresNominados.push(conductor.id);
            }
        });

        // Eliminar solo los conductores vinculados del vehículo seleccionado
        delete conductoresVinculados[vehiculoId];

        console.log('Conductores vinculados después de la limpieza:', conductoresVinculados);
    } else {
        console.log('No se encontraron conductores vinculados para el vehículo:', vehiculoId);
    }

    // Reiniciar la variable vehiculoSeleccionadoId después de la limpieza
    vehiculoSeleccionadoId = null;
}