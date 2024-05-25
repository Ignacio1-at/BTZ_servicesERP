//ACTUALIZAR TABLERO REFRESH
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

function actualizarTablaMotonavesModal() {
    // Realizar una solicitud AJAX para obtener los datos actualizados de las motonaves
    $.ajax({
        url: obtenerTablaMotonavesURL, // URL para obtener los datos actualizados de las motonaves
        type: 'GET',
        success: function (data) {

            // Verificar si data es un arreglo
            if (!Array.isArray(data)) {
                console.error('El formato de los datos no es correcto. Se esperaba un arreglo.');
                return;
            }

            // Actualizar el contenido del tbody de la tabla con los nuevos datos
            var tablaMotonaves = $('#listaMotonaveModal table tbody');
            tablaMotonaves.empty(); // Limpiar el contenido actual del tbody

            // Iterar sobre los nuevos datos y agregar filas a la tabla
            $.each(data, function (index, motonave) {

                var fila = $('<tr style="color: white;"></tr>');
                fila.append('<td>' + motonave.nombre + '</td>');
                fila.append('<td>' + motonave.estado_servicio + '</td>');
                fila.append('<td>' + motonave.cantBodegas + '</td>'); // Agregar la cantidad de bodegas
                fila.append('<td>' + motonave.viaje + '</td>');
                fila.append('<td><button type="button" class="editarMotonave" style="border: none; background: none;" title="Editar" data-motonave-id="' + motonave.id + '"><img src="/static/images/Editar.png" alt="Editar" width="40" height="40" style="cursor: pointer;" /></button><button type="button" class="eliminarMotonave" style="border: none; background: none;" title="Eliminar" data-motonave-id="' + motonave.id + '"><img src="/static/images/Basurero.png" alt="Eliminar" width="40" height="40" style="cursor: pointer;" /></button></td>');
                tablaMotonaves.append(fila);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los datos de las motonaves:', error);
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
                abrirPanelLateral(data.nombre, data.estado_servicio, data.viaje, data.fecha_nominacion, data.cantidad_serviciosActual, data.comentarioActual, data.puerto, data.proxPuerto, data.procedencia_carga, data.armador, data.agencia);
            } else {
                console.error('No se recibieron los detalles de la motonave correctamente desde el tablero.');
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles de la motonave desde el tablero:', error);
        }
    });
}

// Event listener para validar el nombre de la motonave al enviar el formulario
$('#formAgregarMotonave').submit(function (event) {
    var nombreMotonave = $('#nombreMotonave').val();
    var cantidadBodegas = $('#cantidadBodegas').val();

    if (!validarNombreMotonave(nombreMotonave)) {
        // Mostrar mensaje de error si el nombre de la motonave no es válido
        alert('El nombre de la motonave no es válido. Debe contener solo letras y espacios.');
        event.preventDefault(); // Evitar que se envíe el formulario
    } else if (!validarCantidadBodegas(cantidadBodegas)) {
        // Mostrar mensaje de error si la cantidad de bodegas no es válida
        alert('La cantidad de bodegas debe ser un número positivo no mayor a 15.');
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
    var cantidadBodegas = $('#cantidadBodegas').val();
    var form = $('#formAgregarMotonave');
    var csrfToken = form.find('input[name="csrfmiddlewaretoken"]').val(); // Obtener el token CSRF del formulario

    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: {
            'nombreMotonave': nombreMotonave,
            'cantidadBodegas': cantidadBodegas,
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

// Función para manejar la apertura del modal de edición de motonave
$(document).on('click', '.btn-editar-motonave', function () {
    var motonaveId = $(this).data('motonave-id');
    var motonaveNombre = $(this).data('motonave-nombre');
    var motonaveBodegas = $(this).data('motonave-bodegas');
    var motonaveViaje = $(this).data('motonave-viaje');

    $('#editarMotonaveId').val(motonaveId);
    $('#editarNombreMotonave').val(motonaveNombre).data('original-value', motonaveNombre);
    $('#editarCantidadBodegas').val(motonaveBodegas).data('original-value', motonaveBodegas);
    $('#editarNumeroViaje').val(motonaveViaje).data('original-value', motonaveViaje);
});

// Función para manejar el envío del formulario de edición de motonave
$('#formEditarMotonave').submit(function (event) {
    event.preventDefault();

    var motonaveId = $('#editarMotonaveId').val();
    var nombreMotonave = $('#editarNombreMotonave').val();
    var cantidadBodegas = $('#editarCantidadBodegas').val();
    var numeroViaje = $('#editarNumeroViaje').val();
    var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();

    // Obtener los valores originales de los campos
    var nombreMotonaveOriginal = $('#editarNombreMotonave').data('original-value');
    var cantidadBodegasOriginal = $('#editarCantidadBodegas').data('original-value');
    var numeroViajeOriginal = $('#editarNumeroViaje').data('original-value');

    // Validar el nombre de la motonave (solo si se modificó)
    if (nombreMotonave !== nombreMotonaveOriginal) {
        if (!validarNombreMotonave(nombreMotonave)) {
            alert('El nombre de la motonave no es válido. Debe contener solo letras y espacios.');
            return;
        }
        // Verificar si el nuevo nombre de la motonave ya existe
        verificarNombreMotonaveExistenteEditar(nombreMotonave, function (existe) {
            if (existe) {
                alert('La motonave ya existe en el sistema.');
                return;
            } else {
                // Si el nuevo nombre no existe, continuar con las demás validaciones y el envío del formulario
                validarYEnviarFormulario();
            }
        });
    } else {
        // Si no se modificó el nombre, continuar con las demás validaciones y el envío del formulario
        validarYEnviarFormulario();
    }

    function validarYEnviarFormulario() {
        // Validar la cantidad de bodegas (solo si se modificó)
        if (cantidadBodegas !== cantidadBodegasOriginal && !validarCantidadBodegas(cantidadBodegas)) {
            alert('La cantidad de bodegas debe ser un número entero positivo.');
            return;
        }

        // Validar el número de viaje (solo si se modificó)
        if (numeroViaje !== numeroViajeOriginal && !validarNumeroViaje(numeroViaje)) {
            alert('El número de viaje debe ser un número entero positivo.');
            return;
        }

        // Enviar el formulario
        $.ajax({
            url: modificarMotonaveURL,
            method: 'POST',
            data: {
                'motonave_id': motonaveId,
                'nombre_motonave': nombreMotonave,
                'cantidad_bodegas': cantidadBodegas,
                'numero_viaje': numeroViaje,
                'csrfmiddlewaretoken': csrftoken
            },
            success: function (response) {
                if (response.success) {
                    // Actualizar la tabla de motonaves después de una edición exitosa
                    location.reload();
                } else {
                    console.error('Error al modificar la motonave:', response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error al modificar la motonave:', error);
            }
        });
    }
});

$(document).ready(function () {
    // Manejar el evento de clic en el botón "Eliminar"
    $('#listaMotonaveModal').on('click', '#eliminarMotonave', function () {
        var motonaveId = $(this).data('motonave-id');
        var fila = $(this).closest('tr');

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la motonave de forma permanente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                var csrfToken = getCookie('csrftoken');

                $.ajax({
                    url: eliminarMotonaveURL,
                    type: 'POST',
                    data: {
                        motonaveId: motonaveId,
                        csrfmiddlewaretoken: csrfToken
                    },
                    success: function (response) {
                        console.log('Motonave eliminada:', response);
                        fila.remove();
                        Swal.fire(
                            '¡Eliminado!',
                            'La motonave ha sido eliminada correctamente.',
                            'success'
                        );
                        location.reload();
                    },
                    error: function (xhr, status, error) {
                        console.error('Error al eliminar la motonave:', error);
                        Swal.fire(
                            '¡Error!',
                            'Ha ocurrido un error al eliminar la motonave.',
                            'error'
                        );
                    }
                });
            }
        });
    });
});