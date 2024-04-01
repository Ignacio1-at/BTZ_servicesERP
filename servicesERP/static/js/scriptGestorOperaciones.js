// Función para validar el nombre de la motonave
function validarNombreMotonave(nombreMotonave) {
    var regex = /^[A-Za-z\s]+$/;
    return nombreMotonave.toUpperCase() === nombreMotonave && regex.test(nombreMotonave);
}

// Función para convertir el nombre de la motonave a mayúsculas
function convertirAMayusculas(input) {
    input.value = input.value.toUpperCase();
}

// Event listener para convertir a mayúsculas mientras se escribe en el campo de nombre de motonave
var nombreMotonaveInput = document.getElementById('nombreMotonave');
nombreMotonaveInput.addEventListener('input', function () {
    convertirAMayusculas(this);
});

// Función para verificar si la motonave ya existe en el sistema
function verificarMotonaveExistente(nombreMotonave) {
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            if (data.error) {
                submitForm(); // Llamar a submitForm solo si la verificación es exitosa
            } else {
                alert('La motonave ya existe en el sistema.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al verificar la existencia de la motonave:', error);
        }
    });
}

// Función para enviar el formulario de agregar motonave mediante AJAX
function submitForm() {
    var nombreMotonave = $('#nombreMotonave').val();
    if (!validarNombreMotonave(nombreMotonave)) {
        alert('El nombre de la motonave no es válido. Debe contener solo letras y estar en mayúsculas.');
        return;
    }
    var form = $('#formAgregarMotonave');
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (data) {
            $('#modalAgregarMotonave').modal('hide');
            setTimeout(function () {
                location.reload();
            }, 500);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// Función para abrir el panel lateral y mostrar los detalles de la motonave seleccionada
function abrirPanelLateral(nombreMotonave, estado) {
    $('#panelLateral').css('width', '550px');
    $('#detallesMotonave').html(`
        <h4>Detalles de la motonave</h4>
        <p><strong>Nombre:</strong> ${nombreMotonave}</p>
        <p style="display: inline-block; margin-right: 10px;"><strong>Estado:</strong></p>
        <select id="nuevoEstadoMotonave" class="form-select" style="width: 300px; display: inline-block;" onchange="guardarNuevoEstado('${nombreMotonave}')">
            <option value="Disponible" ${estado === 'Disponible' ? 'selected' : ''}>Disponible</option>
            <option value="Nominado" ${estado === 'Nominado' ? 'selected' : ''}>Nominado</option>
            <option value="En Proceso" ${estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="Terminado" ${estado === 'Terminado' ? 'selected' : ''}>Terminado</option>
        </select>
    `);
}

// Función para guardar el nuevo estado seleccionado en la base de datos
function guardarNuevoEstado(nombreMotonave) {
    var nuevoEstado = $('#nuevoEstadoMotonave').val();
    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: 'POST',
        url: nuevoEstadoMotonaveURL,
        headers: { 'X-CSRFToken': csrftoken },
        data: {
            'nombre_motonave': nombreMotonave,
            'nuevo_estado': nuevoEstado
        },
        success: function (response) {
            console.log('Nuevo estado guardado correctamente:', response);
            // Realizar un refresh de la página después de guardar el estado
            actualizarTableroMotonaves(); // Llamar a la función para actualizar el tablero de motonaves
        },
        error: function (xhr, status, error) {
            console.error('Error al guardar el nuevo estado:', error);
        }
    });
}

function actualizarTableroMotonaves() {
    $.ajax({
        type: 'GET',
        url: obtenerTablaMotonavesURL,
        success: function (data) {
            // Limpiar solo el contenido de las columnas
            $('.columna-contenido').empty();

            // Actualizar el contenido de cada columna
            var estados = ['Nominado', 'En Proceso', 'Terminado'];
            estados.forEach(function (estado) {
                // Filtrar las motonaves según el estado
                var motonavesEstado = data.filter(function (motonave) {
                    return motonave.estado_servicio === estado;
                });

                // Obtener el contenedor de contenido de la columna actual
                var contenidoColumna = $('#' + 'column' + estado.replace(/\s+/g, '')).find('.columna-contenido');

                // Crear fichas de motonaves para el estado actual
                motonavesEstado.forEach(function (motonave) {
                    var fichaMotonave = $('<div class="ficha-motonave">' + motonave.nombre + '</div>');
                    contenidoColumna.append(fichaMotonave);
                });
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la tabla de motonaves:', error);
        }
    });
}





// Función para obtener el valor de una cookie por su nombre
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function mostrarDetallesMotonave(nombreMotonave) {
    // Actualizar el contenido del panel lateral
    $('#detallesMotonave').html(`
        <h4>Detalles de la motonave</h4>
        <p><strong>Nombre:</strong> ${nombreMotonave}</p>
        <p><strong>Estado:</strong> ${estado}</p>
    `);
    // Abrir el panel lateral
    $('#panelLateral').css('width', '550px');
}

function cerrarPanelLateral() {
    // Cerrar el panel lateral
    $('#panelLateral').css('width', '0');
}

$(document).mouseup(function (e) {
    var panelLateral = $("#panelLateral");
    if (!panelLateral.is(e.target) && panelLateral.has(e.target).length === 0) {
        panelLateral.css('width', '0');
    }
});

function seleccionarMotonave(nombreMotonave) {
    // Cerrar el modal
    $('#motonaveExistenteModal').modal('hide');

    // Realizar una solicitud AJAX para obtener los detalles de la motonave seleccionada
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            // Verificar si se recibieron los detalles correctamente
            if (data.nombre && data.estado_servicio) {
                // Abrir el panel lateral y mostrar los detalles de la motonave
                abrirPanelLateral(data.nombre, data.estado_servicio);
            } else {
                console.error('No se recibieron los detalles de la motonave correctamente.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles de la motonave:', error);
        }
    });
}