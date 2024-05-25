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

// Función para abrir el modal y cargar los detalles del químico
function abrirModalQuimico(quimicoId) {
    console.log('La id del químico es:', quimicoId);
    console.log('Realizando solicitud AJAX...');

    $.ajax({
        url: `/erp/gestor-inventario/obtener_detalles_quimico/?quimicoId=${quimicoId}`,
        type: 'GET',
        success: function (quimico) {
            console.log('Respuesta del servidor:', quimico);
            // Mostrar el modal primero
            $(`#modalDetalleQuimico${quimico.id}`).modal('show');
            // Luego, cargar el contenido en modo visualización
            mostrarDetallesQuimicoVisualizacion(quimico);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del químico:', error);
        }
    });
}

// Función para mostrar los detalles del químico en modo visualización
function mostrarDetallesQuimicoVisualizacion(quimico) {
    var contenidoModal = `
        <div class="datosGenerales" id="datosGenerales">
            <div class="headerDatosGenerales" id="headerDatosGenerales">
                <p style="font-size: 2.5vh;">Datos Generales</p>
            </div>
            <div class="bodyDatosGenerales" id="bodyDatosGenerales">
                <div class="textoDatosGenerales" id="textoDatosGenerales" style="margin-left: 3vw;">
                    <p><strong>Tipo de Químico:</strong> ${quimico.tipo_quimico}</p>
                    <p><strong>Fecha de Ingreso:</strong> ${quimico.fecha_ingreso}</p>
                    <p><strong>Número de Factura:</strong> ${quimico.numero_factura}</p>
                    <p><strong>Litros Ingresados:</strong> ${quimico.litros_ingreso}</p>
                </div>
            </div>
        </div>
        <div class="Estado" id="Estado">
            <div class="headerEstado" id="headerEstado">
                <p style="font-size: 2.5vh;">Estado</p>
            </div>
            <div class="bodyEstado" id="bodyEstado">
                <div class="textoEstado" id="textoEstado" style="margin-left: 3vw;">
                    <p><strong>Estado:</strong> ${quimico.estado}</p>
                </div>
            </div>
        </div>
    `;

    $(`#modalBodyQuimico${quimico.id}`).html(contenidoModal);
    $(`#btnGuardarQuimico${quimico.id}`).hide();
}

// Función para cambiar entre el modo visualización y edición
function cambiarModoQuimico(quimico) {
    var btnCambiarModo = $(`#btnCambiarModoQuimico${quimico.id}`);
    var modoVisualizacion = btnCambiarModo.hasClass("modo-visualizacion");

    if (modoVisualizacion) {
        mostrarDetallesQuimicoEdicion(quimico);
        btnCambiarModo.removeClass("modo-visualizacion").addClass("modo-edicion");
    } else {
        mostrarDetallesQuimicoVisualizacion(quimico);
        btnCambiarModo.removeClass("modo-edicion").addClass("modo-visualizacion");
    }
}

// Función para mostrar los detalles del químico en modo edición
// Función para mostrar los detalles del químico en modo edición
function mostrarDetallesQuimicoEdicion(quimico) {
    var contenidoModal = `
        <div class="datosGenerales" id="datosGenerales">
            <div class="headerDatosGenerales" id="headerDatosGenerales">
                <p style="font-size: 2.5vh;">Datos Generales</p>
            </div>
            <div class="bodyDatosGenerales" id="bodyDatosGenerales">
                <div class="textoDatosGenerales" id="textoDatosGenerales" style="margin-left: 3vw;">
                    <p><strong>Tipo de Químico:</strong> 
                        <select id="tipoQuimicoInput${quimico.id}">
                            <option value="Bidones OCN 01" ${quimico.tipo_quimico === 'Bidones OCN 01' ? 'selected' : ''}>Bidones OCN 01</option>
                            <option value="Bidones OCN 08" ${quimico.tipo_quimico === 'Bidones OCN 08' ? 'selected' : ''}>Bidones OCN 08</option>
                            <option value="Bidones Acido Clorhídrico" ${quimico.tipo_quimico === 'Bidones Acido Clorhídrico' ? 'selected' : ''}>Bidones Acido Clorhídrico</option>
                            <option value="Bidones Hipoclorito" ${quimico.tipo_quimico === 'Bidones Hipoclorito' ? 'selected' : ''}>Bidones Hipoclorito</option>
                            <option value="Bidones Hold Coat" ${quimico.tipo_quimico === 'Bidones Hold Coat' ? 'selected' : ''}>Bidones Hold Coat</option>
                        </select>
                    </p>
                    <p><strong>Fecha de Ingreso:</strong> <input type="date" id="fechaIngresoInput${quimico.id}" value="${quimico.fecha_ingreso}"></p>
                    <p><strong>Número de Factura:</strong> <input type="number" id="numeroFacturaInput${quimico.id}" value="${quimico.numero_factura}"></p>
                    <p><strong>Litros Ingresados:</strong> <input type="number" id="litrosIngresoInput${quimico.id}" value="${quimico.litros_ingreso}"></p>
                </div>
            </div>
        </div>
    `;

    $(`#modalBodyQuimico${quimico.id}`).html(contenidoModal);
    $(`#btnGuardarQuimico${quimico.id}`).show();
}


// Función para guardar los cambios realizados en el modo de edición
function guardarCambiosQuimico(quimicoId) {

    if (!validarCambiosQuimico(quimicoId)) {
        // Si la validación falla, se detiene el proceso de guardado
        return;
    }

    var tipoQuimico = $(`#tipoQuimicoInput${quimicoId}`).val();
    var fechaIngreso = $(`#fechaIngresoInput${quimicoId}`).val();
    var numeroFactura = $(`#numeroFacturaInput${quimicoId}`).val();
    var litrosIngreso = $(`#litrosIngresoInput${quimicoId}`).val();

    var datos = {
        quimico_id: quimicoId,
        tipo_quimico: tipoQuimico,
        fecha_ingreso: fechaIngreso,
        numero_factura: numeroFactura,
        litros_ingreso: litrosIngreso,
    };

    $.ajax({
        url: `/erp/gestor-inventario/guardar_cambios_quimico/`,
        type: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: datos,
        success: function (response) {
            console.log('Cambios guardados:', response);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error('Error al guardar los cambios del químico:', error);
        }
    });
}

// Asociar el evento de cambio de modo y guardar cambios al abrir el modal
$(document).on('click', '[id^=btnCambiarModoQuimico]', function () {
    var quimicoId = $(this).attr('id').replace('btnCambiarModoQuimico', '');
    $.ajax({
        url: `/erp/gestor-inventario/obtener_detalles_quimico/?quimicoId=${quimicoId}`,
        type: 'GET',
        success: function (quimico) {
            cambiarModoQuimico(quimico);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del químico:', error);
        }
    });
});

$(document).on('click', '[id^=btnGuardarQuimico]', function () {
    var quimicoId = $(this).attr('id').replace('btnGuardarQuimico', '');
    guardarCambiosQuimico(quimicoId);
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