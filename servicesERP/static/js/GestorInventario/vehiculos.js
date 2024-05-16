// Función para eliminar Vehículos
function eliminarVehiculo(vehiculoId) {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
        const form = document.getElementById(`formEliminarVehiculo${vehiculoId}`);
        form.submit();
    }
}

$('#formAgregarVehiculo').submit(function (event) { });