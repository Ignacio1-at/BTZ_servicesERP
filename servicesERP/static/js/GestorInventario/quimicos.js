// Función para eliminar químicos
function eliminarQuimico(quimicoId) {
    if (confirm("¿Estás seguro de eliminar este químico?")) {
        const form = document.getElementById(`formEliminarQuimico${quimicoId}`);
        form.submit();
    }
}