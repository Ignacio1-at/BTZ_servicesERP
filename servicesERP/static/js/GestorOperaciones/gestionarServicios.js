function obtenerServiciosMotonave(nombreMotonave) {
    $.ajax({
        url: obtenerServicioMotonaveURL,
        type: 'GET',
        data: {
            nombre_motonave: nombreMotonave
        },
        success: function (response) {
            var motonaveTerminada = response.every(function (servicio) {
                return servicio.estado_delServicio === 'Terminado';
            });

            $('#btnCrearServicio').prop('disabled', motonaveTerminada)
                .toggleClass('btn-disabled', motonaveTerminada);


            // Limpiar la tabla de servicios
            $('#tablaServicios tbody').empty();

            // Variable para controlar la habilitación del botón de agregar
            var agregarHabilitado = false;

            // Recorrer los servicios y agregarlos a la tabla
            response.forEach(function (servicio) {
                var fila = '<tr>' +
                    '<td>' + servicio.numero_servicio + '</td>' +
                    '<td>' + (servicio.tipo_servicio || '') + '</td>' +
                    '<td><input type="date" class="fecha-inicio-faena" value="' + (servicio.fecha_inicioFaena || '') + '" data-servicio-id="' + servicio.id + '"></td>' +
                    '<td>' + (servicio.estado_delServicio || '') + '</td>' +
                    '<td class="d-flex justify-content-center">' +
                    '<button type="button" style="border: none; background: none; opacity: ' + (servicio.estado_delServicio === 'Nominado' ? '1' : '0.5') + ';" title="Agregar" onclick="agregarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')" ' + (servicio.estado_delServicio === 'Nominado' ? '' : 'disabled') + '>' +
                    '<img src="' + staticUrls.agregar + '" alt="Agregar" width="40" height="40" style="cursor: ' + (servicio.estado_delServicio === 'Nominado' ? 'pointer' : 'not-allowed') + ';" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none; opacity: ' + (servicio.estado_delServicio === 'Nominado' ? '0.5' : '1') + ';" title="Editar" onclick="editarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')" ' + (servicio.estado_delServicio === 'Nominado' ? 'disabled' : '') + '>' +
                    '<img src="' + staticUrls.editar + '" alt="Editar" width="40" height="40" style="cursor: ' + (servicio.estado_delServicio === 'Nominado' ? 'not-allowed' : 'pointer') + ';" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none; opacity: ' + (servicio.estado_delServicio === 'Terminado' ? '0.5' : '1') + ';" title="Eliminar" onclick="eliminarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')" ' + (servicio.estado_delServicio === 'Terminado' ? 'disabled' : '') + '>' +
                    '<img src="' + staticUrls.eliminar + '" alt="Eliminar" width="40" height="40" style="cursor: ' + (servicio.estado_delServicio === 'Terminado' ? 'not-allowed' : 'pointer') + ';" />' +
                    '</button> ' +
                    '<button type="button" style="border: none; background: none; opacity: ' + (servicio.estado_delServicio === 'Nominado' ? '0.5' : '1') + ';" title="Visualizar" onclick="visualizarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')" ' + (servicio.estado_delServicio === 'Nominado' ? 'disabled' : '') + '>' +
                    '<img src="' + staticUrls.visualizar + '" alt="Visualizar" width="40" height="40" style="cursor: ' + (servicio.estado_delServicio === 'Nominado' ? 'not-allowed' : 'pointer') + ';" />' +
                    '</button>' +
                    '<button type="button" style="border: none; background: none; opacity: ' + (servicio.estado_delServicio === 'En Proceso' ? '1' : '0.5') + ';" title="Finalizar Servicio" onclick="finalizarServicio(\'' + nombreMotonave + '\', ' + servicio.id + ')" ' + (servicio.estado_delServicio !== 'En Proceso' ? 'disabled' : '') + '>' +
                    '<img src="' + staticUrls.check + '" alt="Finalizar Servicio" width="40" height="40" style="cursor: ' + (servicio.estado_delServicio === 'En Proceso' ? 'pointer' : 'not-allowed') + ';" />' +
                    '</button>' +
                    '</td>' +
                    '</tr>';
                $('#tablaServicios tbody').append(fila);

                // Si al menos un servicio tiene estado 'Nominado', habilitar el botón de agregar
                if (servicio.estado_delServicio === 'Nominado') {
                    agregarHabilitado = true;
                }
            });
            // Llamar a la función para ordenar la tabla automáticamente
            sortTable(0);
            // Agregar el atributo data-nombre-motonave al botón "Crear Servicio"
            $('#btnCrearServicio').attr('data-nombre-motonave', nombreMotonave);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

$(document).on('change', '.fecha-inicio-faena', function () {
    var fechaInicioFaena = new Date($(this).val());
    var servicioId = $(this).data('servicio-id');
    var fechaArriboCuadrilla = new Date($(this).closest('tr').find('td:eq(2)').text());
  
    if (fechaInicioFaena >= fechaArriboCuadrilla) {
      Swal.fire({
        title: 'Error',
        text: 'La fecha de inicio de faena debe ser anterior a la fecha de arribo de cuadrilla.',
        icon: 'error',
        confirmButtonColor: '#8d000e'
      });
      $(this).val(''); // Limpiar el valor del campo de fecha de inicio de faena
    } else {
      // Realizar una solicitud AJAX para actualizar la fecha de inicio de faena en el servidor
      $.ajax({
        url: actualizarFechaInicioFaenaURL,
        type: 'POST',
        data: {
          servicio_id: servicioId,
          fecha_inicio_faena: $(this).val(),
          csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        },
        success: function (response) {
          // Manejar la respuesta del servidor si es necesario
        },
        error: function (error) {
          console.log(error);
        }
      });
    }
  });

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

                //Actualizar tabla motonaves
                actualizarTablaMotonavesModal()

                //Actualizar Tablero
                actualizarTableroMotonaves()

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

function agregarServicio(nombreMotonave, servicioId) {
    console.log('Agregar servicio con ID:', servicioId);

    // Construye la URL con el parámetro servicio_id
    var urlConParametros = fichaServicioURL + servicioId + "/";

    // Redirige a la URL construida
    window.location.href = urlConParametros;
}

function editarServicio(nombreMotonave, servicioId) {
    console.log('Editar servicio con ID:', servicioId);

    // Construye la URL con el parámetro servicio_id
    var urlConParametros = '/erp/gestor-operaciones/ficha-servicio/' + servicioId + "/editar/";

    // Redirige a la URL construida
    window.location.href = urlConParametros;
}

function eliminarServicio(nombreMotonave, servicioId) {
    console.log('Eliminar servicio con ID:', servicioId);

    // Obtener el token CSRF
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    // Obtener la cantidad de servicios activos
    var serviciosActivos = $('#tablaServicios tbody tr').filter(function () {
        var estado = $(this).find('td').eq(3).text();
        return estado !== 'Terminado';
    }).length;

    // Si hay un solo servicio activo, mostrar una alerta y no proceder con la eliminación
    if (serviciosActivos <= 1) {
        Swal.fire({
            title: 'Error',
            text: 'No se puede eliminar el último servicio activo.',
            icon: 'error',
            confirmButtonColor: '#8d000e'
        });
        return;
    }

    // Confirmar con el usuario si realmente desea eliminar el servicio
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este servicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8d000e',
        cancelButtonColor: '#01152a',
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
                        //Actualizar tabla motonaves
                        actualizarTablaMotonavesModal();
                        //Actualizar Tablero
                        actualizarTableroMotonaves();
                        // Mostrar una alerta de éxito utilizando SweetAlert
                        Swal.fire(
                            '¡Eliminado!',
                            'El servicio ha sido eliminado correctamente.',
                            'success'
                        );
                    } else {
                        console.log('Error al eliminar el servicio:', response.message);
                        // Mostrar una alerta de error utilizando SweetAlert
                        Swal.fire(
                            'Error',
                            response.error,
                            'error'
                        );
                    }
                },
                error: function (error) {
                    console.log(error);
                    // Mostrar una alerta de error utilizando SweetAlert
                    Swal.fire(
                        'Error',
                        'Ha ocurrido un error al eliminar el servicio.',
                        'error'
                    );
                }
            });
        }
    });
}

function visualizarServicio(nombreMotonave, servicioId) {
    console.log('Visualizar servicio con ID:', servicioId);

    // Construye la URL con el parámetro servicio_id
    var urlConParametros = '/erp/gestor-operaciones/detalle_ficha_servicio/' + servicioId + "/";

    // Redirige a la URL construida
    window.location.href = urlConParametros;
}

$('#modalGestionarServicios').on('hidden.bs.modal', function () {
    // Actualizar la URL eliminando los parámetros open_modal y nombre_motonave
    var newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
});

$('#modalGestionarServicios').on('hidden.bs.modal', function () {
    // Actualizar la URL eliminando los parámetros open_modal y nombre_motonave
    var newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
});

function finalizarServicio(nombreMotonave, servicioId) {
    console.log('Finalizar servicio con ID:', servicioId);

    // Obtener el token CSRF
    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

    // Confirmar con el usuario si realmente desea finalizar el servicio
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres finalizar este servicio?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8d000e',
        cancelButtonColor: '#01152a',
        confirmButtonText: 'Sí, finalizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar una solicitud AJAX al servidor para finalizar el servicio
            $.ajax({
                url: finalizarServicioURL,
                type: 'POST',
                data: {
                    servicio_id: servicioId,
                    csrfmiddlewaretoken: csrfToken
                },
                success: function (response) {
                    if (response.success) {
                        // El servicio se finalizó exitosamente
                        console.log('Servicio finalizado exitosamente');

                        // Actualizar la tabla de servicios después de finalizar el servicio
                        obtenerServiciosMotonave(nombreMotonave);

                        //Actualizar tabla motonaves
                        actualizarTablaMotonavesModal()

                        //Actualizar Tablero
                        actualizarTableroMotonaves()

                        // Mostrar una alerta de éxito utilizando SweetAlert
                        Swal.fire(
                            '¡Finalizado!',
                            'El servicio ha sido finalizado correctamente.',
                            'success'
                        );
                    } else {
                        console.log('Error al finalizar el servicio:', response.message);
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    });
}