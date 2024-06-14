function abrirPanelLateral(nombreMotonave, estado, viaje, fechaNominacion, cantidad_serviciosActual, comentarioActual, puerto, proxPuerto, procedencia_carga, armador, agencia) {
    actualizarEstadoBotonFinalizarMotonave(estado);
    $('#panelLateral').css('width', '30vw');
    $('#panelLateral').css('height', '100vh');
    $('#panelNombre h4').text(nombreMotonave);
    $('#viajeMotonave').text(viaje);
    $('#fechaNominacionMotonave').text(fechaNominacion);
    $('#cantidadServiciosActual').text(cantidad_serviciosActual);
    $('#cargaMotonave').text(procedencia_carga);
    $('#puertoMotonave').text(puerto);
    $('#armadorMotonave').text(armador);
    $('#agenciaMotonave').text(agencia);
    $('#estadoMotonave').text(estado);

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

    // Agregar evento de clic al botón de finalizar para capturar el nombre de la motonave
    $('#btnFinalizarMotonave').off('click').on('click', function () {
        finalizarMotonave(nombreMotonave);
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
    panel.style.width = (startWidth + startX - e.clientX) + 'px';
}


// Función para detener el arrastre
function stopDrag(e) {
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}

function guardarNuevoComentario(nombreMotonave) {
    var nuevoComentario = $('#comentarioActual').val();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: nuevoComentarioMotonaveURL,
        headers: { 'X-CSRFToken': csrftoken },
        data: {
            'nombre_motonave': nombreMotonave,
            'comentarioActual': nuevoComentario
        },
        success: function (response) {
            console.log('Nuevo comentario guardado correctamente:', response);
            actualizarTableroMotonaves();
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

function finalizarMotonave(nombreMotonave, estadoMotonave) {
    // Mostrar una confirmación antes de finalizar la motonave
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres finalizar esta motonave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8d000e',
        cancelButtonColor: '#01152a',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar una solicitud AJAX para finalizar la motonave
            $.ajax({
                url: '/erp/gestor-operaciones/finalizar-motonave/',
                type: 'POST',
                data: {
                    'nombre_motonave': nombreMotonave,
                    'csrfmiddlewaretoken': '{{ csrf_token }}'
                },
                success: function (response) {
                    if (response.success) {
                        // La motonave se finalizó correctamente
                        console.log('La motonave se finalizó correctamente');

                        // Actualizar tabla motonaves
                        actualizarTablaMotonavesModal();

                        // Llamar a la función actualizarTableroMotonaves
                        actualizarTableroMotonaves();

                        // Mostrar una alerta de éxito
                        Swal.fire(
                            '¡Finalizada!',
                            'La motonave ha sido finalizada correctamente.',
                            'success'
                        );
                    } else {
                        // Hubo un error al finalizar la motonave
                        console.error(response.message);
                        // Mostrar una alerta de error
                        Swal.fire(
                            'Error',
                            'Hubo un error al finalizar la motonave.',
                            'error'
                        );
                    }
                },
                error: function (xhr, status, error) {
                    // Manejar errores de la solicitud AJAX
                    console.error('Error al finalizar la motonave:', error);
                    // Mostrar una alerta de error
                    Swal.fire(
                        'Error',
                        'Hubo un error al finalizar la motonave.',
                        'error'
                    );
                }
            });
        }
    });
}

function actualizarEstadoBotonFinalizarMotonave(estadoMotonave) {
    const botonFinalizarMotonave = document.getElementById('btnFinalizarMotonave');

    // Verifica si el estado de la motonave está "terminado"
    const motonaveTerminada = estadoMotonave === 'Terminado';

    // Actualiza el botón según el estado de la motonave
    botonFinalizarMotonave.disabled = !motonaveTerminada;
    botonFinalizarMotonave.style.opacity = motonaveTerminada ? '1' : '0.5';
}