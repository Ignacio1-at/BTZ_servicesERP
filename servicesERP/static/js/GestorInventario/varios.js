// Función para eliminar varios
function eliminarVario(variosId) {
    if (confirm("¿Estás seguro de eliminar?")) {
        const form = document.getElementById(`formEliminarVario${variosId}`);
        form.submit();
    }
}