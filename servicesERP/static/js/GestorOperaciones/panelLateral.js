function abrirPanelLateral(nombreMotonave, estado, viaje, fechaNominacion, cantidad_serviciosActual, comentarioActual, puerto, proxPuerto, procedencia_carga, armador, agencia) {
    $('#panelLateral').css('width', '30vw');
    $('#panelLateral').css('height', '100vh');
    $('#panelNombre h4').text(nombreMotonave); // Establecer el nombre de la motonave
    $('#viajeMotonave').text(viaje); // Establecer el valor del viaje
    $('#fechaNominacionMotonave').text(fechaNominacion); // Mostrar la fecha de nominación
    $('#cantidadServiciosActual').text(cantidad_serviciosActual); // Mostrar la cantidad de servicios actuales
    $('#cargaMotonave').text(procedencia_carga); // Establecer el valor de la procedencia
    $('#puertoMotonave').text(puerto); // Establecer el valor del puerto
    $('#armadorMotonave').text(armador); // Establecer el valor del armador
    $('#agenciaMotonave').text(agencia); // Establecer el valor de la agencia
    $('#estadoMotonave').text(estado); // Establecer el valor del estado de la motonave

    $('#comentarioActual').val(comentarioActual);

    // Asignar evento onchange al select
    $('#comentarioActual').off('change').on('change', function () {
        guardarNuevoComentario(nombreMotonave);
    });

    // Agregar evento de clic al botón de eliminar para capturar el nombre de la motonave
    $('#BotonEliminacionNomina').off('click').on('click', function () {
        eliminarServicioMotonave(nombreMotonave);
    });

    // Agregar evento de clic al botón "AbrirGestorServicio" y pasar el nombre de la motonave
    $('#AbrirGestorServicio').off('click').on('click', function () {
        abrirModalGestionServicios(nombreMotonave);
        $('#panelLateral').css('width', '0');
    });
}

var panel = document.getElementById('panelLateral');
var dragBar = document.getElementById('dragbar');
var startX, startWidth;

// Agregar evento de mouse para iniciar el arrastre
dragBar.addEventListener('mousedown', initDrag, false);

// Función para iniciar el arrastre
function initDrag(e) {
    startX = e.clientX;
    startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
}

// Función para arrastrar el dragbar y ajustar el tamaño del panel
function doDrag(e) {
    panel.style.width = (startWidth + startX - e.clientX) + 'px'; // Invertir la dirección del cambio
}


// Función para detener el arrastre
function stopDrag(e) {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}

function guardarNuevoComentario(nombreMotonave) {
    var nuevoComentario = $('#comentarioActual').val(); // Obtener el valor del textarea
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: nuevoComentarioMotonaveURL,
        headers: { 'X-CSRFToken': csrftoken },
        data: {
            'nombre_motonave': nombreMotonave,
            'comentarioActual': nuevoComentario // Asegúrate de que coincida con el nombre del campo en tu vista de Django
        },
        success: function (response) {
            console.log('Nuevo comentario guardado correctamente:', response);
            // Realizar un refresh de la página después de guardar el comentario
            actualizarTableroMotonaves(); // Llamar a la función para actualizar el tablero de motonaves
        },
        error: function (xhr, status, error) {
            console.error('Error al guardar el nuevo comentario:', error);
        }
    });
}

$(document).mouseup(function (e) {
    var panelLateral = $("#panelLateral");
    if (!panelLateral.is(e.target) && panelLateral.has(e.target).length === 0) {
        panelLateral.css('width', '0');
    }
});