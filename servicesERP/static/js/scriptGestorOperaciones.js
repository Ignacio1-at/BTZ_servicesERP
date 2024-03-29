// Función para enviar el formulario de agregar motonave mediante AJAX
function submitForm() {
    // Envía el formulario usando AJAX
    var form = $('#formAgregarMotonave');
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (data) {
            // Cierra el modal después de que se haya creado la motonave
            $('#modalAgregarMotonave').modal('hide');
            // Recargar la página después de 0.5 segundo
            setTimeout(function () {
                location.reload();
            }, 500);
        },
        error: function (xhr, status, error) {
            // Manejar errores si es necesario
            console.error(error);
        }
    });
}

function seleccionarMotonave(nombreMotonave) {
    // Cerrar el modal
    $('#motonaveExistenteModal').modal('hide');

    // Abrir el panel lateral
    abrirPanelLateral(nombreMotonave);
}

function abrirPanelLateral(nombreMotonave) {
    // Mostrar el panel lateral
    $('#panelLateral').css('width', '550px');

    // Mostrar los detalles de la motonave seleccionada
    $('#detallesMotonave').html('Detalles de la motonave: ' + nombreMotonave);
}

function mostrarDetallesMotonave(nombreMotonave) {
    // Aquí puedes hacer una petición AJAX al servidor para obtener los detalles de la motonave con el nombre especificado
    // Por ahora, simplemente actualizaremos el contenido del panel lateral con un mensaje de demostración
    $('#detallesMotonave').html('Detalles de la motonave ' + nombreMotonave);
    // Abre el panel lateral
    $('#panelLateral').css('width', '550px');
}

// Función para cerrar el panel lateral al hacer clic fuera de él
$(document).mouseup(function (e) {
    var panelLateral = $("#panelLateral");
    if (!panelLateral.is(e.target) && panelLateral.has(e.target).length === 0) {
        panelLateral.css('width', '0');
    }
});
