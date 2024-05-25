function obtenerServiciosMotonave(nombreMotonave) {
    console.log('Nombre de la motonave:', nombreMotonave);

    $.ajax({
        url: obtenerServicioMotonaveURL,
        type: 'GET',
        data: {
            nombre_motonave: nombreMotonave
        },
        success: function (response) {
            // Limpiar la tabla de servicios
            $('#tablaServicios tbody').empty();

            // Recorrer los servicios y agregarlos a la tabla
            response.forEach(function (servicio) {
                var fila = '<tr>' +
                    '<td>' + servicio.numero_servicio + '</td>' +
                    '<td>' + servicio.tipo_servicio + '</td>' +
                    '<td>' + servicio.fecha_inicioFaena + '</td>' +
                    '<td>' + servicio.estado_delServicio + '</td>' +
                    '<td>' +
                    '<button type="button" style="border: none; background: none;" title="Nominacion" onclick="nominacion(\'' + nombreMotonave + '\', ' + servicio.id + ')">' +
                    '<img src="' + staticUrls.nominacion + '" alt="Nominacion" width="40" height="40" style="cursor: pointer;" />' +
                    '</button> ' +
                    '</td>' +
                    '<td>' +
                    '<button type="button" style="border: none; background: none;" title="Agregar" onclick="agregarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')">' +
                    '<img src="' + staticUrls.agregar + '" alt="Agregar" width="40" height="40" style="cursor: pointer;" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none;" title="Editar" onclick="editarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')">' +
                    '<img src="' + staticUrls.editar + '" alt="Editar" width="40" height="40" style="cursor: pointer;" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none;" title="Eliminar" onclick="eliminarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')">' +
                    '<img src="' + staticUrls.eliminar + '" alt="Eliminar" width="40" height="40" style="cursor: pointer;" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none;" title="Visualizar" onclick="visualizarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')">' +
                    '<img src="' + staticUrls.visualizar + '" alt="Visualizar" width="40" height="40" style="cursor: pointer;" />' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
                $('#tablaServicios tbody').append(fila);
            });
            // Agregar el atributo data-nombre-motonave al botón "Crear Servicio"
            $('#btnCrearServicio').attr('data-nombre-motonave', nombreMotonave);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).ready(function () {
    // Manejar el evento de clic del botón "Crear Servicio"
    $('#btnCrearServicio').click(function () {
        var nombreMotonave = $('#nombreMotonave').text();
        crearServicio(nombreMotonave);
    });
});

function crearServicio() {
    var nombreMotonave = $('#btnCrearServicio').attr('data-nombre-motonave');
    console.log('Crear servicio para la motonave:', nombreMotonave);

    // Obtener el token CSRF
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    // Realizar una solicitud AJAX al servidor para crear el nuevo servicio
    $.ajax({
        url: crearServicioIndividualURL,
        type: 'POST',
        data: {
            nombre_motonave: nombreMotonave,
            csrfmiddlewaretoken: csrfToken
        },
        success: function (response) {
            if (response.success) {
                // Actualizar la tabla de servicios después de crear el nuevo servicio
                obtenerServiciosMotonave(nombreMotonave);

                // Actualizar la cantidad de servicios en el panel lateral
                var cantidadServicios = parseInt($('#cantidadServiciosActual').text()) + 1;
                $('#cantidadServiciosActual').text(cantidadServicios);
            } else {
                console.log('Error al crear el servicio:', response.message);
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function nominacion(servicioId) {
    console.log('Nominación para el servicio con ID:', servicioId);
    // Implementa la lógica que deseas para el botón de nominación personal
}

function agregarServicio(nombreMotonave, servicioId) {
    console.log('Agregar servicio con ID:', servicioId);
    
    // Construye la URL con el parámetro servicio_id
    var urlConParametros = fichaServicioURL + "?servicio_id=" + servicioId;

    // Redirige a la URL construida
    window.location.href = urlConParametros;
}

function editarServicio(nombreMotonave, servicioId) {
    console.log('Editar servicio con ID:', servicioId);
    // Implementa la lógica que deseas para el botón de editar servicio
}

function eliminarServicio(nombreMotonave, servicioId) {
    console.log('Eliminar servicio con ID:', servicioId);

    // Obtener el token CSRF
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

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
            // Realizar una solicitud AJAX al servidor para eliminar el servicio
            $.ajax({
                url: eliminarServicioIndividualURL,
                type: 'POST',
                data: {
                    servicio_id: servicioId,
                    csrfmiddlewaretoken: csrfToken
                },
                success: function (response) {
                    if (response.success) {
                        // El servicio se eliminó exitosamente
                        console.log('Servicio eliminado exitosamente');

                        // Actualizar la cantidad de servicios en el panel lateral
                        var cantidadServicios = parseInt($('#cantidadServiciosActual').text()) - 1;
                        $('#cantidadServiciosActual').text(cantidadServicios);

                        // Actualizar la tabla de servicios después de eliminar el servicio
                        obtenerServiciosMotonave(nombreMotonave);

                        // Mostrar una alerta de éxito utilizando SweetAlert
                        Swal.fire(
                            '¡Eliminado!',
                            'El servicio ha sido eliminado correctamente.',
                            'success'
                        );
                    } else {
                        console.log('Error al eliminar el servicio:', response.message);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}


function visualizarServicio(nombreMotonave, servicioId) {
    console.log('Visualizar servicio con ID:', servicioId);
    // Implementa la lógica que deseas para el botón de visualizar servicio
}

