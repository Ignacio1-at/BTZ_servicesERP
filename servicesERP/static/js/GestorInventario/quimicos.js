// Función para eliminar químicos
function eliminarQuimico(quimicoId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este químico?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById(`formEliminarQuimico${quimicoId}`);
            form.submit();
        }
    });
}