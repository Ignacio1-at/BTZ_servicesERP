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

// Función para abrir el modal y cargar los detalles del vario
function abrirModalVario(varioId) {
    console.log('La id del vario es:', varioId);
    console.log('Realizando solicitud AJAX...');

    $.ajax({
        url: `/erp/gestor-inventario/obtener_detalles_vario/?varioId=${varioId}`,
        type: 'GET',
        success: function (vario) {
            console.log('Respuesta del servidor:', vario);
            $(`#modalDetalleVario${vario.id}`).modal('show');
            mostrarDetallesVarioVisualizacion(vario);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del vario:', error);
        }
    });
}

// Función para mostrar los detalles del vario en modo visualización
function mostrarDetallesVarioVisualizacion(vario) {
    var contenidoModal = `
        <div class="datosGenerales">
            <div class="inputHeaderDatosGeneralesQuimico">
                <p style="font-size: 2.5vh; margin-left: 2vw;">Datos</p>
            </div>
            <div class="bodyDatosGenerales">
                <div class="textoDatosGenerales" style="margin-left: 3vw;">
                    <p><strong>Nombre:</strong> ${vario.nombre}</p>
                    <p><strong>Fecha de Ingreso:</strong> ${vario.fecha_ingreso}</p>
                </div>
            </div>
            <div class="Estado">
                <div class="headerEstado">
                    <p style="font-size: 2.5vh; margin-left: 2vw;"">Estado</p>
                </div>
                <div class="bodyEstado">
                    <div class="textoEstado" style="margin-left: 3vw;">
                        <p><strong>Estado:</strong> ${vario.estado}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    $(`#modalBodyVario${vario.id}`).html(contenidoModal);
    $(`#btnGuardarVario${vario.id}`).hide();
}

// Función para cambiar entre el modo visualización y edición
function cambiarModoVario(vario) {
    var btnCambiarModo = $(`#btnCambiarModoVario${vario.id}`);
    var modoVisualizacion = btnCambiarModo.hasClass("modo-visualizacion");

    if (modoVisualizacion) {
        mostrarDetallesVarioEdicion(vario);
        btnCambiarModo.removeClass("modo-visualizacion").addClass("modo-edicion");
    } else {
        mostrarDetallesVarioVisualizacion(vario);
        btnCambiarModo.removeClass("modo-edicion").addClass("modo-visualizacion");
    }
}

// Función para mostrar los detalles del vario en modo edición
function mostrarDetallesVarioEdicion(vario) {
    var contenidoModal = `
        <div class="datosGenerales">
            <div class="inputHeaderDatosGeneralesQuimico">
                <p style="font-size: 2.5vh; margin-left: 2vw;">Datos</p>
            </div>
            <div class="bodyDatosGenerales" id="bodyDatosGenerales">
                <div class="textoDatosGenerales" id="textoDatosGenerales" style="margin-left: 3vw;">
                    <p><strong>Nombre:</strong> <input type="text" id="nombreInput" value="${vario.nombre}" style=" border-radius: 10px; font-family: 'mifuente'; padding-left: 5px;" required></p>
                    <p><strong>Fecha de Ingreso:</strong> <input type="date" id="fechaIngresoInput" value="${vario.fecha_ingreso}" style=" border-radius: 10px; font-family: 'mifuente'; padding-left: 5px;" required></p>
                </div>
            </div>
        </div>
    `;

    $(`#modalBodyVario${vario.id}`).html(contenidoModal);
    $(`#btnGuardarVario${vario.id}`).show();
}


function guardarCambiosVario(varioId) {

    if (!validarCambiosVario()) {
        // Si la validación falla, se detiene el proceso de guardado
        return;
    }

    var nombre = $('#nombreInput').val();
    var fechaIngreso = $('#fechaIngresoInput').val();

    var datos = {
        vario_id: varioId,
        nombre: nombre,
        fecha_ingreso: fechaIngreso,
    };
    console.log(datos);
    $.ajax({
        url: '/erp/gestor-inventario/actualizar_vario/',
        type: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: datos,
        success: function (response) {
            console.log('Cambios guardados exitosamente:', response);
            location.reload();
            // Aquí puedes realizar acciones adicionales, como cerrar el modal o recargar la página
        },
        error: function (xhr, status, error) {
            console.error('Error al guardar los cambios:', error);
        }
    });
}

// Asociar el evento de cambio de modo y guardar cambios al abrir el modal
$(document).on('click', '[id^=btnCambiarModoVario]', function () {
    var varioId = $(this).attr('id').replace('btnCambiarModoVario', '');
    $.ajax({
        url: `/erp/gestor-inventario/obtener_detalles_vario/?varioId=${varioId}`,
        type: 'GET',
        success: function (vario) {
            cambiarModoVario(vario);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del vario:', error);
        }
    });
});

$(document).on('click', '[id^=btnGuardarVario]', function () {
    var varioId = $(this).attr('id').replace('btnGuardarVario', '');
    guardarCambiosVario(varioId);
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');