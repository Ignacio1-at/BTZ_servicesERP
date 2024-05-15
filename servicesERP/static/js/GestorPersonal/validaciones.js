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

    return true;
}

// Función para validar el campo rut
function validarRut(rut) {
    // Validar el formato del rut
    if (!rut.match(/^\d{7,8}-[0-9Kk]$/)) {
        alert('Por favor, ingrese un RUT válido en el formato 12345678-9.');
        return false;
    }

    return true; // La validación pasó
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
    var nombre = $("#nombreInput").val();
    var rut = $("#rutInput").val();
    var cargo = $("#cargoSelect").val();
    var conductor = $("#conductorSelect").val();
    var tipoLicencia = $("#tipoLicenciaSelect").val();
    var nuevaEspecialidad = $("#nuevaEspecialidadSelect").val();

    // Llamar a las funciones de validación correspondientes según el campo que se esté modificando
    if (nombre !== '' && !validarNombre(nombre)) return false;
    if (rut !== '' && !validarRut(rut)) return false;
    if (cargo !== '' && !validarCargo(cargo)) return false;
    if (!validarConductorYLicencia(conductor, tipoLicencia)) return false;

    // Validar la nueva especialidad sólo si se ha seleccionado una opción diferente de la opción vacía
    if (nuevaEspecialidad !== '') {
        if (!validarNuevaEspecialidad(nuevaEspecialidad)) return false;
    }

    return true; // Todas las validaciones pasaron
}