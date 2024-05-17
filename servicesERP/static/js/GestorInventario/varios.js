// Función para eliminar varios
function eliminarVario(variosId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este elemento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById(`formEliminarVario${variosId}`);
            form.submit();
        }
    });
}