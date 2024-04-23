// Función para validar el nombre de la motonave
function validarNombreMotonave(nombreMotonave) {
    // Expresión regular para permitir solo letras y espacios
    var regex = /^[A-Za-z\s]+$/;
    return regex.test(nombreMotonave);
}

function verificarNombreMotonaveExistente(nombreMotonave) {
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            console.log("Respuesta del servidor:", data); // Mostrar la respuesta del servidor en la consola
            if (data.error) {
                // Si hay un error en la respuesta, significa que la motonave no existe
                submitForm(); // Enviar el formulario
            } else {
                // Si la respuesta no contiene un error, la motonave existe
                alert('La motonave ya existe en el sistema.');
            }
        },
        error: function (xhr, status, error) {
            // Manejo de errores: mostrar mensaje de alerta
            if (xhr.status === 404) {
                // Si el código de estado es 404 (Not Found), significa que la motonave no existe
                submitForm(); // Enviar el formulario
            } else {
                alert('Error al verificar la existencia de la motonave.');
                console.error('Error al verificar la existencia de la motonave:', error);
            }
        }
    });
}

// Event listener para convertir el texto a mayúsculas al escribir en el campo del nombre
$('#nombreMotonave').on('input', function () {
    var input = $(this);
    var texto = input.val();
    input.val(texto.toUpperCase());
});

/*/ Función para validar el número de viaje
function validarNumeroViaje(numeroViaje) {
    // Expresión regular para permitir solo números positivos
    var regex = /^\d+$/;
    return regex.test(numeroViaje);
}*/

// Event listener para validar el nombre de la motonave al enviar el formulario
$('#formAgregarMotonave').submit(function (event) {
    var nombreMotonave = $('#nombreMotonave').val();

    if (!validarNombreMotonave(nombreMotonave)) {
        // Mostrar mensaje de error si el nombre de la motonave no es válido
        alert('El nombre de la motonave no es válido. Debe contener solo letras y espacios.');
        event.preventDefault(); // Evitar que se envíe el formulario
    } else {
        // Verificar si el nombre de la motonave ya existe antes de enviar el formulario
        verificarNombreMotonaveExistente(nombreMotonave);
        event.preventDefault(); // Evitar que se envíe el formulario
    }
});

// Función para enviar el formulario de agregar motonave mediante AJAX
function submitForm() {
    var nombreMotonave = $('#nombreMotonave').val();

    var form = $('#formAgregarMotonave');
    var csrfToken = form.find('input[name="csrfmiddlewaretoken"]').val(); // Obtener el token CSRF del formulario

    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: {
            'nombreMotonave': nombreMotonave,
            'csrfmiddlewaretoken': csrfToken // Incluir el token CSRF en los datos de la solicitud
        },
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
        <p><strong>Viaje:</strong> <input type="text" id="inputViaje" style="margin-left: 10px;margin-bottom: 20px; width: 50px; text-align:center;"></p>
        <p style="display: inline-block; margin-right: 20px;"><strong>Estado:</strong></p>
        <select id="nuevoEstadoMotonave" class="form-select" style="width: 300px; display: inline-block; margin-bottom: 20px;" onchange="guardarNuevoEstado('${nombreMotonave}')">
            <option value="Disponible" ${estado === 'Disponible' ? 'selected' : ''}>Disponible</option>
            <option value="Nominado" ${estado === 'Nominado' ? 'selected' : ''}>Nominado</option>
            <option value="En Proceso" ${estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
            <option value="Terminado" ${estado === 'Terminado' ? 'selected' : ''}>Terminado</option>
        </select>
        <p style="margin-bottom: 10px;"><strong>Descripción:</strong></p>
        <textarea id="inputDescripcion" rows="4" cols="50" style="margin-bottom: 20px;"></textarea>
    `);

    // Agregar evento de cambio al campo de descripción
    $('#inputDescripcion').on('input', function () {
        var nuevaDescripcion = $(this).val();
        // Llamar a la función para guardar automáticamente la nueva descripción
        guardarNuevaDescripcion(nombreMotonave, nuevaDescripcion);
    });

    // Agregar evento de cambio al campo de entrada de viaje
    $('#inputViaje').change(function () {
        var nuevoViaje = $(this).val();
        // Verificar si el valor ingresado es un número positivo
        if (!/^(\d+)$/.test(nuevoViaje)) {
            alert('Por favor, ingresa solo números en el campo de viaje.');
            // Restaurar el valor anterior del campo
            $(this).val(''); // Limpiar el campo
            return; // Detener la ejecución
        }
        // Llamar a la función para guardar automáticamente el nuevo viaje
        guardarNuevoViaje(nombreMotonave, nuevoViaje);
    });
}

/*/ Función para guardar la nueva descripción en la base de datos
function guardarNuevaDescripcion(nombreMotonave, nuevaDescripcion) {
    // Realizar una solicitud AJAX para enviar la nueva descripción al servidor
    // Obtener el token CSRF del campo oculto en el formulario
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    $.ajax({
        type: 'POST',
        url: guardarDescripcionURL,
        data: {
            nombre_motonave: nombreMotonave,
            descripcion: nuevaDescripcion,
            'csrfmiddlewaretoken': csrfToken // Incluir el token CSRF en los datos de la solicitud
        },
        success: function (response) {
            // Manejar la respuesta del servidor si es necesario
            console.log('Descripción guardada correctamente.');
        },
        error: function (xhr, status, error) {
            // Manejar errores si es necesario
            console.error('Error al guardar la descripción.');
        }
    });
}*/


/*/ Función para guardar automáticamente el nuevo viaje
function guardarNuevoViaje(nombreMotonave, nuevoViaje) {
    // Obtener el token CSRF del campo oculto en el formulario
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    $.ajax({
        type: 'POST',
        url: guardarNuevoViajeURL, // Ajusta esta URL según tu configuración
        data: {
            'nombreMotonave': nombreMotonave,
            'nuevoViaje': nuevoViaje,
            'csrfmiddlewaretoken': csrfToken // Incluir el token CSRF en los datos de la solicitud
        },
        success: function (data) {
            console.log('El nuevo viaje se guardó automáticamente.');
            actualizarTableroMotonaves();
            // Puedes hacer algo aquí, como actualizar el tablero de motonaves
        },
        error: function (xhr, status, error) {
            console.error('Error al guardar el nuevo viaje automáticamente:', error);
        }
    });
} */

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
                    // Crear fichas de motonaves para el estado actual
                    var fichaMotonave = $('<div class="ficha-motonave">' +
                        '<div class="nombre">' + motonave.nombre + '</div>' +
                        '</div>');
                    contenidoColumna.append(fichaMotonave);
                });
            });

            // Asignar evento de clic a las fichas de motonave
            asignarEventoClicFichasMotonave();
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

$(document).mouseup(function (e) {
    var panelLateral = $("#panelLateral");
    if (!panelLateral.is(e.target) && panelLateral.has(e.target).length === 0) {
        panelLateral.css('width', '0');
    }
});

function seleccionarMotonaveDesdeLista(nombreMotonave) {
    // Cerrar el modal
    $('#listaMotonaveModal').modal('hide');

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

// Asignar evento de click a las fichas de motonave en el tablero
function asignarEventoClicFichasMotonave() {
    $('.ficha-motonave').click(function () {
        var nombreMotonave = $(this).find('.nombre').text();
        console.log('Se ha hecho clic en la ficha de motonave:', nombreMotonave);
        seleccionarMotonaveDesdeTablero(nombreMotonave);
    });
}

function seleccionarMotonaveDesdeTablero(nombreMotonave) {
    // Realizar una solicitud AJAX para obtener los detalles de la motonave seleccionada desde el tablero
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            // Verificar si se recibieron los detalles correctamente
            if (data.nombre && data.estado_servicio) {
                // Abrir el panel lateral y mostrar los detalles de la motonave desde el tablero
                abrirPanelLateral(data.nombre, data.estado_servicio);
            } else {
                console.error('No se recibieron los detalles de la motonave correctamente desde el tablero.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles de la motonave desde el tablero:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Obtener el botón "Ingresar" del formulario
    var btnMostrarModalGestion = document.getElementById('btnMostrarModalGestion');

    // Obtener el modal de cantidad de servicios
    var modalServicio = new bootstrap.Modal(document.getElementById('modalServicio'));

    // Obtener el modal de gestión de servicios
    var modalGestionarServicios = new bootstrap.Modal(document.getElementById('modalGestionarServicios'));

    // Agregar un evento de clic al botón "Ingresar" para cerrar el modal actual y mostrar el modal de gestión de servicios
    btnMostrarModalGestion.addEventListener('click', function () {
        // Cerrar el modal de cantidad de servicios
        modalServicio.hide();

        // Mostrar el modal de gestión de servicios
        modalGestionarServicios.show();
    });
});

$(document).ready(function() {
    // Agregar un evento de clic al botón "Ingresar" para enviar el formulario al servidor
    $('#btnMostrarModalGestion').click(function() {
        // Obtener los datos del formulario
        var formData = $('#formCrearServicio').serialize();

        // Enviar los datos al servidor utilizando AJAX
        $.ajax({
            url: crearServicioURL, 
            method: 'POST',
            data: formData,
            success: function(response) {
                // Manejar la respuesta del servidor aquí
                console.log('Datos del formulario:', formData);
                console.log('Respuesta del servidor:', response);
                actualizarTableroMotonaves(); // Llamar a la función para actualizar el tablero de motonaves
            },
            error: function(xhr, status, error) {
                // Manejar errores de AJAX aquí
                console.error('Error de AJAX:', error);
            }
        });
    });
});



