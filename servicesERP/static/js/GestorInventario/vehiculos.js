// Función para eliminar Vehículos
function eliminarVehiculo(vehiculoId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este vehículo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById(`formEliminarVehiculo${vehiculoId}`);
            form.submit();
        }
    });
}

$('#formAgregarVehiculo').submit(function (event) { });