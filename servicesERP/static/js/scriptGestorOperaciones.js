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

function abrirPanelLateral(nombreMotonave, estado, viaje, fechaNominacion, cantidad_serviciosActual, comentarioActual) {
    $('#panelLateral').css('width', '30vw');
    $('#panelLateral').css('height', '100vh');
    $('#panelNombre h4').text(nombreMotonave); // Establecer el nombre de la motonave
    $('#viajeMotonave').text(viaje); // Establecer el valor del viaje
    $('#fechaNominacionMotonave').text(fechaNominacion); // Mostrar la fecha de nominación
    $('#cantidadServiciosActual').text(cantidad_serviciosActual); // Mostrar la cantidad de servicios actuales

    console.log('Estado:', estado); // Agregar console.log para verificar el valor del estado

    $('#nuevoEstadoMotonave').val(estado); // Establecer el estado seleccionado

    // Asignar evento onchange al select
    $('#nuevoEstadoMotonave').off('change').on('change', function () {
        guardarNuevoEstado(nombreMotonave);
    });

    $('#comentarioActual').val(comentarioActual);

    // Asignar evento onchange al select
    $('#comentarioActual').off('change').on('change', function () {
        guardarNuevoComentario(nombreMotonave);
    });

    // Agregar evento de clic al botón de eliminar para capturar el nombre de la motonave
    $('#BotonEliminacionNomina').off('click').on('click', function () {
        eliminarServicio(nombreMotonave);
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
                        '<div class="numeroViaje">' + motonave.viaje + '</div>' +
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
                abrirPanelLateral(data.nombre, data.estado_servicio, data.viaje, data.fecha_nominacion, data.cantidad_serviciosActual, data.comentarioActual);
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
    // Obtener el select de las motonaves
    const selectMotonave = document.querySelector('#modalServicio select[name="nombreMotonave"]');

    function cargarNombresMotonavesDisponibles() {
        fetch(rendFormularioURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa');
                }
                return response.json();
            })
            .then(data => {
                // Limpiar el select antes de agregar las nuevas opciones
                selectMotonave.innerHTML = "";

                // Verificar si hay nombres disponibles
                if (data.nombres_motonaves_disponibles && data.nombres_motonaves_disponibles.length > 0) {
                    // Iterar sobre los nombres de las motonaves disponibles
                    data.nombres_motonaves_disponibles.forEach(nombre => {
                        const option = document.createElement('option');
                        option.value = nombre;
                        option.textContent = nombre;
                        selectMotonave.appendChild(option);
                    });
                } else {
                    console.error('No se encontraron nombres de motonaves disponibles.');
                }
            })
            .catch(error => console.error('Error al cargar los nombres de las motonaves:', error));
    }

    // Llamar a la función para cargar los nombres de las motonaves disponibles cuando se abre el modal
    document.getElementById('modalServicio').addEventListener('show.bs.modal', function () {
        cargarNombresMotonavesDisponibles();
    });
});

// Crear Servicio
$(document).ready(function () {
    // Agregar un evento de clic al botón "Ingresar" para enviar el formulario al servidor
    $('#btnMostrarModalGestion').click(function () {
        // Obtener los valores de cantidad de servicios y número de viaje
        var cantidadServicios = parseInt($('#cantidadServicios').val());
        var numeroViaje = parseInt($('#numeroViaje').val());

        // Validar que los valores sean números enteros positivos
        if (isNaN(cantidadServicios) || cantidadServicios <= 0 || !Number.isInteger(cantidadServicios) ||
            isNaN(numeroViaje) || numeroViaje <= 0 || !Number.isInteger(numeroViaje)) {
            // Mostrar un mensaje de error al usuario
            alert('Por favor, ingrese números validos para servicios y viaje.');
            return; // Detener la ejecución del código
        }

        // Si la validación es exitosa, enviar la solicitud AJAX
        // Obtener los datos del formulario
        var formData = $('#formCrearServicio').serialize();

        // Obtener la fecha de nominación actual
        var fechaNominacion = new Date().toISOString().split('T')[0];

        // Agregar la fecha de nominación al formData
        formData += '&fechaNominacion=' + fechaNominacion;

        // Ocultar el modal de servicios
        $('#modalServicio').modal('hide');

        // Enviar los datos al servidor utilizando AJAX
        $.ajax({
            url: crearServicioURL,
            method: 'POST',
            data: formData,
            success: function (response) {
                // Manejar la respuesta del servidor aquí
                console.log('Respuesta del servidor:', response);

                // Si la respuesta del servidor es verdadera (true), abrir el modal de gestión de servicios
                if (response.success) {
                    // Mostrar el modal de gestión de servicios
                    $('#modalGestionarServicios').modal('show');
                }

                // Llamar a la función para actualizar el tablero de motonaves
                actualizarTableroMotonaves();
            },
            error: function (xhr, status, error) {
                // Manejar errores de AJAX aquí
                console.error('Error de AJAX:', error);
            }
        });
    });
});

// Función para eliminar el servicio
function eliminarServicio(nombreMotonave) {
    // Obtener el token CSRF de las cookies
    var csrftoken = getCookie('csrftoken');

    // Confirmar con el usuario si realmente desea eliminar el servicio
    if (confirm("¿Estás seguro de que quieres eliminar este servicio?")) {
        // Realizar la petición AJAX para eliminar el servicio
        $.ajax({
            url: eliminarServicioURL,
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },  // Incluir el token CSRF en los headers de la solicitud
            data: {
                nombreMotonave: nombreMotonave
            },
            success: function (response) {
                if (response.success) {
                    // Eliminación exitosa, actualizar la interfaz de usuario según sea necesario
                    alert("El servicio se ha eliminado correctamente.");
                    // Aquí podrías recargar la página o realizar otras acciones necesarias después de eliminar el servicio
                    location.reload();
                } else {
                    // Error al eliminar el servicio, mostrar un mensaje de error si es necesario
                    alert("Ha ocurrido un error al eliminar el servicio.");
                }
            },
            error: function (xhr, errmsg, err) {
                // Manejar el error de la petición AJAX si es necesario
                alert("Ha ocurrido un error al eliminar el servicio.");
            }
        });
    }
}

function abrirModalGestorServicios() {
    $('#modalGestionarServicios').modal('show');
}