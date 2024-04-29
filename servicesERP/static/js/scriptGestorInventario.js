//Cambiar contendio de la tabla segun lo seleccionado (Quimicos, Vehiculos, Varios)
$(document).ready(function() {
    // Ocultar todas las filas de tabla al cargar la página
    $('.tablaContenido table').hide();

    // Manejar el clic en los botones del menú
    $('.btn-menu').click(function() {
        // Obtener el data-tab correspondiente al botón clicado
        var tablaToShow = $(this).data('tab');

        // Ocultar todas las filas de tabla
        $('.tablaContenido table').hide();

        // Mostrar solo las filas de la tabla correspondiente al data-tab clicado
        $('#' + tablaToShow).show();
    });

    // Mostrar la tabla de químicos por defecto al cargar la página
    $('#tablaQuimico').show();
});

// Función para eliminar químicos
function eliminarQuimico(quimicoId) {
    if (confirm("¿Estás seguro de eliminar este químico?")) {
        const form = document.getElementById(`formEliminarQuimico${quimicoId}`);
        form.submit();
    }
}

// Función para eliminar Vehículos
function eliminarVehiculo(vehiculoId) {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
        const form = document.getElementById(`formEliminarVehiculo${vehiculoId}`);
        form.submit();
    }
}

// Función para eliminar varios
function eliminarVarios(variosId) {
    if (confirm("¿Estás seguro de eliminar?")) {
        const form = document.getElementById(`formEliminarVario${variosId}`);
        form.submit();
    }
}


//-----------------VALIDACIONES ENTRAN PERO NO FUNCIONAN
// Función para verificar el número de motor
function verificarNumeroMotor(numeroMotor, callback) {
    $.ajax({
        type: 'GET',
        url: obtenerNumeroMotor,
        data: { 'numero_motor': numeroMotor },
        success: function (data) {
            console.log("Respuesta del servidor:", data);
            if (data.error) {
                callback(true); // Llama al callback con true si hay un error
            } else {
                callback(false); // Llama al callback con false si no hay error
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al verificar el número de motor:', error);
            callback(true); // Llama al callback con true en caso de error
        }
    });
}

// Función para verificar el número de chasis
function verificarNumeroChasis(numeroChasis, callback) {
    $.ajax({
        type: 'GET',
        url: obtenerNumeroChasis,
        data: { 'numero_chasis': numeroChasis },
        success: function (data) {
            console.log("Respuesta del servidor:", data);
            if (data.error) {
                callback(true); // Llama al callback con true si hay un error
            } else {
                callback(false); // Llama al callback con false si no hay error
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al verificar el número de chasis:', error);
            callback(true); // Llama al callback con true en caso de error
        }
    });
}

// Función para verificar la patente
function verificarPatente(patente, callback) {
    $.ajax({
        type: 'GET',
        url: obtenerPatente,
        data: { 'patente': patente },
        success: function (data) {
            console.log("Respuesta del servidor:", data);
            if (data.error) {
                callback(true); // Llama al callback con true si hay un error
            } else {
                callback(false); // Llama al callback con false si no hay error
            }
        },
        error: function (xhr, status, error) {
            console.error('Error al verificar la patente:', error);
            callback(true); // Llama al callback con true en caso de error
        }
    });
}

// Event listener para validar que sea único el número de motor, número de chasis y patente
$('#formAgregarVehiculo').submit(function (event) {
    var numero_motor = $('#numero_motor').val();
    var numero_chasis = $('#numero_chasis').val();
    var patente = $('#patente').val();

    // Función para manejar la respuesta de la validación
    function handleValidationResponse(numeroMotorExiste, numeroChasisExiste, patenteExiste) {
        if (numeroMotorExiste) {
            alert('Ya existe un vehículo con ese número de motor.');
            event.preventDefault(); // Evita que el formulario se envíe
        } else if (numeroChasisExiste) {
            alert('Ya existe un vehículo con ese número de chasis.');
            event.preventDefault(); // Evita que el formulario se envíe
        } else if (patenteExiste) {
            alert('Ya existe un vehículo con esa patente.');
            event.preventDefault(); // Evita que el formulario se envíe
        } else {
            // Si ninguna de las verificaciones detecta un problema, permite el envío del formulario
        }
    }

    // Realiza las solicitudes AJAX para verificar la unicidad de los campos
    verificarNumeroMotor(numero_motor, function(numeroMotorExiste) {
        verificarNumeroChasis(numero_chasis, function(numeroChasisExiste) {
            verificarPatente(patente, function(patenteExiste) {
                // Maneja la respuesta de la validación
                handleValidationResponse(numeroMotorExiste, numeroChasisExiste, patenteExiste);
            });
        });
    });
});
