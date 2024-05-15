const csrftoken = getCookie('csrftoken');

// Agregar evento de escucha para el campo de nombre
$("#nombreInput").on("input", function () {
    // Convertir el valor a mayúsculas
    var nombreInput = $(this).val().toUpperCase();
    // Asignar el valor convertido de vuelta al campo de entrada
    $(this).val(nombreInput);
});

// Agregar controladores de eventos para activar las validaciones cuando se modifican los campos
$("#nombreInput").on("input", function () {
    validarNombre($(this).val());
});

$("#rutInput").on("input", function () {
    validarRut($(this).val());
});

$("#cargoSelect").on("change", function () {
    validarCargo($(this).val());
});

$("#conductorSelect").on("change", function () {
    validarConductorYLicencia($(this).val(), $("#tipoLicenciaSelect").val());
});

$("#tipoLicenciaSelect").on("change", function () {
    validarConductorYLicencia($("#conductorSelect").val(), $(this).val());
});

$("#nuevaEspecialidadSelect").on("change", function () {
    validarNuevaEspecialidad($(this).val());
});