// Función para validar el campo nombre
function validarNombre() {
    var nombreInput = $("#nombreInput").val().trim().toUpperCase();
    var regex = /^[A-Z\s]+$/;

    if (nombreInput === "") {
        alert("Por favor, ingrese un nombre.");
        return false;
    }

    if (!regex.test(nombreInput)) {
        alert("El nombre solo puede contener letras y espacios.");
        return false;
    }

    if (nombreInput.length > 100) {
        alert("El nombre no puede tener más de 100 caracteres.");
        return false;
    }

    return true;
}

// Función para validar el campo rut
function validarRut(rut) {
    // Validar el formato del rut
    if (!rut.match(/^\d{7,8}-[0-9Kk]$/)) {
        alert('Por favor, ingrese un RUT válido en el formato 12345678-9.');
        return false;
    }

    // Verificar si el RUT está duplicado en la base de datos
    var isDuplicate = false;
    $.ajax({
        url: obtenerDetallesPersonalURL,
        type: 'GET',
        dataType: 'json',
        data: { rut: rut },
        async: false, // Necesario para que la validación funcione correctamente
        success: function(response) {
            if (response.duplicado) {
                alert('Este RUT ya está registrado. Por favor, ingrese un RUT diferente.');
                isDuplicate = true;
            }
        },
        error: function() {
            alert('Error al verificar el RUT.');
            isDuplicate = true;
        }
    });

    return !isDuplicate; // La validación pasa solo si no está duplicado
}

// Función para validar el campo cargo
function validarCargo(cargo) {
    // Validar que se haya seleccionado un cargo
    if (cargo === '') {
        alert('Por favor, seleccione un cargo.');
        return false;
    }

    return true; // La validación pasó
}

// Función para validar el campo conductor y tipo de licencia
function validarConductorYLicencia(conductor, tipoLicencia) {
    // Si el conductor no está seleccionado, el tipo de licencia debe ser '--'
    if (conductor === 'No') {
        return '--';
    }

    // Si el conductor está seleccionado, validar el tipo de licencia
    if (!/^A[1-5]|B|C|D|E|F$/.test(tipoLicencia)) {
        alert('Tipo de Licencia inválida. Debe ser A1, A2, A3, A4, A5, B, C, D, E, F.');
        return false;
    }

    return tipoLicencia; // La validación pasó
}

// Función para validar la nueva especialidad
function validarNuevaEspecialidad(nuevaEspecialidad) {
    // Validar que se haya seleccionado una nueva especialidad
    if (nuevaEspecialidad === '') {
        alert('Por favor, seleccione una nueva especialidad.');
        return false;
    }

    return true; // La validación pasó
}

function validarActualizacion() {
    var nombre = $("#nombreInput").val().trim().toUpperCase();
    var rut = $("#rutInput").val().trim();
    var cargo = $("#cargoSelect").val();
    var conductor = $("#conductorSelect").val();
    var tipoLicencia = $("#tipoLicenciaSelect").val();
    var nuevaEspecialidad = $("#nuevaEspecialidadSelect").val();

    // Obtener los valores originales de los campos
    var nombreOriginal = $("#nombreInput").data('original-value');
    var rutOriginal = $("#rutInput").data('original-value');
    var cargoOriginal = $("#cargoSelect").data('original-value');
    var conductorOriginal = $("#conductorSelect").data('original-value');
    var tipoLicenciaOriginal = $("#tipoLicenciaSelect").data('original-value');

    // Validar solo si los valores han cambiado
    if (nombre !== nombreOriginal && !validarNombre(nombre)) return false;
    if (rut !== rutOriginal && !validarRut(rut)) return false;
    if (cargo !== cargoOriginal && !validarCargo(cargo)) return false;
    if ((conductor !== conductorOriginal || tipoLicencia !== tipoLicenciaOriginal) && !validarConductorYLicencia(conductor, tipoLicencia)) return false;

    // Validar la nueva especialidad sólo si se ha seleccionado una opción diferente de la opción vacía
    if (nuevaEspecialidad !== '') {
        if (!validarNuevaEspecialidad(nuevaEspecialidad)) return false;
    }

    return true; // Todas las validaciones pasaron
}

