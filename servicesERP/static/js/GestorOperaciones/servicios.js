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

        // Validar que se haya seleccionado un puerto
        var puerto = $('#puerto').val();
        if (puerto === '') {
            alert('Por favor, seleccione un puerto válido.');
            return; // Detener la ejecución del código
        }

        // Validar que se haya seleccionado un próximo puerto
        var proxPuerto = $('#proxPuerto').val();
        if (proxPuerto === '') {
            alert('Por favor, seleccione un próximo puerto válido.');
            return; // Detener la ejecución del código
        }

        // Validar que se haya ingresado una procedencia de carga
        var procedenciaCarga = $('#procedenciaCarga').val();
        if (procedenciaCarga === '') {
            alert('Por favor, ingrese la procedencia de la carga.');
            return; // Detener la ejecución del código
        }

        // Validar que se haya ingresado un armador
        var armador = $('#armador').val();
        if (armador === '') {
            alert('Por favor, ingrese el armador.');
            return; // Detener la ejecución del código
        }

        // Validar que se haya ingresado una agencia
        var agencia = $('#agencia').val();
        if (agencia === '') {
            alert('Por favor, ingrese la agencia.');
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
                    // Obtener el nombre de la motonave desde los datos del formulario
                    var formData = $('#formCrearServicio').serialize();
                    var nombreMotonave = getParameterByName('nombreMotonave', formData);
                    abrirModalGestionServicios(nombreMotonave);
                    actualizarTableroMotonaves();
                }
            },
            error: function (xhr, status, error) {
                // Manejar errores de AJAX aquí
                console.error('Error de AJAX:', error);
            }
        });
    });
});

function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function abrirModalGestionServicios(nombreMotonave) {
    // Abrir el modal
    $('#modalGestionarServicios').modal('show');

    // Establecer el título del modal con el nombre de la motonave
    $('#nombreMotonaveSeleccionada').text(nombreMotonave);
    // Cargar los servicios de la motonave
    obtenerServiciosMotonave(nombreMotonave);
}

// Función para eliminar el servicio
function eliminarServicioMotonave(nombreMotonave) {
    // Obtener el token CSRF de las cookies
    var csrftoken = getCookie('csrftoken');

    // Confirmar con el usuario si realmente desea eliminar el servicio
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este servicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la petición AJAX para eliminar el servicio
            $.ajax({
                url: eliminarServicioURL,
                type: 'POST',
                headers: { 'X-CSRFToken': csrftoken }, // Incluir el token CSRF en los headers de la solicitud
                data: {
                    nombreMotonave: nombreMotonave
                },
                success: function (response) {
                    if (response.success) {
                        // Eliminación exitosa, actualizar la interfaz de usuario según sea necesario
                        Swal.fire(
                            '¡Eliminado!',
                            'El servicio ha sido eliminado correctamente.',
                            'success'
                        );
                        // Aquí podrías realizar otras acciones necesarias después de eliminar el servicio
                        location.reload();
                    } else {
                        // Error al eliminar el servicio, mostrar un mensaje de error
                        Swal.fire(
                            '¡Error!',
                            'Ha ocurrido un error al eliminar el servicio.',
                            'error'
                        );
                    }
                },
                error: function (xhr, errmsg, err) {
                    // Manejar el error de la petición AJAX
                    Swal.fire(
                        '¡Error!',
                        'Ha ocurrido un error al eliminar el servicio.',
                        'error'
                    );
                }
            });
        }
    });
}

