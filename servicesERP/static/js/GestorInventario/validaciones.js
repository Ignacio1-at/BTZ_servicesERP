// Función para validar el formulario de agregar químico
function validarFormularioAgregarQuimico() {
    var tipoQuimico = $("#tipoQuimico").val();
    var fechaIngreso = $("#fechaIngreso").val();
    var litrosIngreso = $("#litrosIngreso").val();
    var numFactura = $("#numFactura").val();

    // Validar que se haya seleccionado un tipo de químico
    if (tipoQuimico === "") {
        alert("Por favor, seleccione un tipo de químico.");
        return false;
    }

    // Validar que se haya ingresado una fecha de ingreso
    if (fechaIngreso === "") {
        alert("Por favor, ingrese una fecha de ingreso.");
        return false;
    }

    // Validar que la fecha de ingreso no sea una fecha futura
    var fechaActual = new Date().toISOString().split("T")[0];
    if (fechaIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return false;
    }

    // Validar que los litros ingresados sean un número positivo
    if (litrosIngreso <= 0) {
        alert("Los litros ingresados deben ser un número positivo.");
        return false;
    }

    // Validar que el número de factura no esté vacío
    if (numFactura === "") {
        alert("Por favor, ingrese un número de factura.");
        return false;
    }

    // Validar que el número de factura tenga un formato válido (solo dígitos numéricos)
    if (!/^\d+$/.test(numFactura)) {
        alert("El número de factura debe contener solo dígitos numéricos.");
        return false;
    }

    return true;
}

// Función para validar el formulario de agregar vehículo
function validarFormularioAgregarVehiculo() {
    var marca = $("#marca").val();
    var modelo = $("#modelo").val();
    var color = $("#color").val();
    var numeroMotor = $("#numero_motor").val();
    var numeroChasis = $("#numero_chasis").val();
    var cilindrada = $("#cilindrada").val();
    var tipoVehiculo = $("#tipo_vehiculo").val();
    var tipoCombustible = $("#tipo_combustible").val();
    var primerIngreso = $("#primer_ingreso").val();
    var patente = $("#patente").val();
    var fechaPermisoCirculacion = $("#fecha_permiso_circulacion").val();
    var fechaSoap = $("#fecha_soap").val();
    var fechaRevisionTecnica = $("#fecha_revision_tecnica").val();
    var seguroNombre = $("#seguro_nombre").val();
    var seguroPoliza = $("#seguro_poliza").val();

    // Validar que la marca no esté vacía y tenga una longitud máxima de 100 caracteres
    if (marca === "" || marca.length > 100) {
        alert("Por favor, ingrese una marca válida (máximo 100 caracteres).");
        return false;
    }

    // Validar que el modelo no esté vacío y tenga una longitud máxima de 100 caracteres
    if (modelo === "" || modelo.length > 100) {
        alert("Por favor, ingrese un modelo válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que el color no esté vacío y tenga una longitud máxima de 50 caracteres
    if (color === "" || color.length > 50) {
        alert("Por favor, ingrese un color válido (máximo 50 caracteres).");
        return false;
    }

    // Validar que el número de motor no esté vacío y tenga una longitud máxima de 100 caracteres
    if (numeroMotor === "" || numeroMotor.length > 100) {
        alert("Por favor, ingrese un número de motor válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que el número de chasis no esté vacío y tenga una longitud máxima de 100 caracteres
    if (numeroChasis === "" || numeroChasis.length > 100) {
        alert("Por favor, ingrese un número de chasis válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que la cilindrada no esté vacía y tenga una longitud máxima de 50 caracteres
    if (cilindrada === "" || cilindrada.length > 50) {
        alert("Por favor, ingrese una cilindrada válida (máximo 50 caracteres).");
        return false;
    }

    // Validar que el tipo de vehículo no esté vacío y tenga una longitud máxima de 100 caracteres
    if (tipoVehiculo === "" || tipoVehiculo.length > 100) {
        alert("Por favor, ingrese un tipo de vehículo válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que se haya seleccionado un tipo de combustible válido
    var tiposCombustibleValidos = ['93', '95', '97', 'diésel', 'electrico'];
    if (!tiposCombustibleValidos.includes(tipoCombustible)) {
        alert("Por favor, seleccione un tipo de combustible válido.");
        return false;
    }

    // Validar que la fecha de ingreso no sea una fecha futura
    var fechaActual = new Date().toISOString().split("T")[0];
    if (primerIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return false;
    }

    // Validar que la patente no esté vacía, tenga un formato válido con al menos una letra y una longitud máxima de 6 caracteres
    if (patente === "" || !/^(?=.*[A-Za-z])[A-Za-z0-9]{6}$/.test(patente)) {
        alert("Por favor, ingrese una patente válida (exactamente 6 caracteres alfanuméricos con al menos una letra).");
        return false;
    }

    // Validar que se haya ingresado una fecha de permiso de circulación válida
    if (fechaPermisoCirculacion === "") {
        alert("Por favor, ingrese una fecha de permiso de circulación válida.");
        return false;
    }

    // Validar que se haya ingresado una fecha de SOAP válida
    if (fechaSoap === "") {
        alert("Por favor, ingrese una fecha de SOAP válida.");
        return false;
    }

    // Validar que se haya ingresado una fecha de revisión técnica válida
    if (fechaRevisionTecnica === "") {
        alert("Por favor, ingrese una fecha de revisión técnica válida.");
        return false;
    }

    // Validar que el nombre del seguro no esté vacío y tenga una longitud máxima de 100 caracteres
    if (seguroNombre === "" || seguroNombre.length > 100) {
        alert("Por favor, ingrese un nombre de seguro válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que el número de póliza no esté vacío
    if (seguroPoliza === "") {
        alert("Por favor, ingrese un número de póliza válido.");
        return false;
    }

    // Validar que el número de motor sea único
    if (!validarCampoUnico(numeroMotor, 'numero_motor')) {
        alert("El número de motor ingresado ya existe. Por favor, ingrese un número de motor único.");
        return false;
    }

    // Validar que el número de chasis sea único
    if (!validarCampoUnico(numeroChasis, 'numero_chasis')) {
        alert("El número de chasis ingresado ya existe. Por favor, ingrese un número de chasis único.");
        return false;
    }

    // Validar que la patente sea única
    if (!validarCampoUnico(patente, 'patente')) {
        alert("La patente ingresada ya existe. Por favor, ingrese una patente única.");
        return false;
    }

    return true;
}


// Función para validar si un campo es único utilizando AJAX
function validarCampoUnico(valor, campo) {
    var esUnico = true;
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        url: validarCampoUnicoVehiculoURL,
        method: 'POST',
        data: {
            valor: valor,
            campo: campo,
            csrfmiddlewaretoken: csrftoken
        },
        async: false,
        success: function (response) {
            if (response.existe) {
                esUnico = false;
            }
        }
    });

    console.log("Campo:", campo, "Valor:", valor, "Es único:", esUnico);
    return esUnico;
}

//VALIDACIONES DE AGREGAR VARIOS

// Función para validar el formulario de agregar varios
function validarFormularioAgregarVarios() {
    var nombre = $("#nombre").val();
    var fechaIngreso = $("#fecha_ingreso").val();

    // Validar que el nombre no esté vacío y tenga una longitud máxima de 100 caracteres
    if (nombre === "" || nombre.length > 100) {
        alert("Por favor, ingrese un nombre válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que la fecha de ingreso no sea una fecha futura
    var fechaActual = new Date().toISOString().split("T")[0];
    if (fechaIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return false;
    }

    return true;
}

// Validar cambios de quimico
function validarCambiosQuimico(quimicoId) {
    var tipoQuimico = $(`#tipoQuimicoInput${quimicoId}`).val();
    var fechaIngreso = $(`#fechaIngresoInput${quimicoId}`).val();
    var numeroFactura = $(`#numeroFacturaInput${quimicoId}`).val();
    var litrosIngreso = $(`#litrosIngresoInput${quimicoId}`).val();

    // Validar que se haya seleccionado un tipo de químico
    if (tipoQuimico === "") {
        alert("Por favor, seleccione un tipo de químico.");
        return false;
    }

    // Validar que se haya ingresado una fecha de ingreso
    if (fechaIngreso === "") {
        alert("Por favor, ingrese una fecha de ingreso.");
        return false;
    }

    // Validar que la fecha de ingreso no sea una fecha futura
    var fechaActual = new Date().toISOString().split("T")[0];
    if (fechaIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return false;
    }

    // Validar que los litros ingresados sean un número positivo
    if (litrosIngreso <= 0) {
        alert("Los litros ingresados deben ser un número positivo.");
        return false;
    }

    // Validar que el número de factura no esté vacío
    if (numeroFactura === "") {
        alert("Por favor, ingrese un número de factura.");
        return false;
    }

    // Validar que el número de factura tenga un formato válido (solo dígitos numéricos)
    if (!/^\d+$/.test(numeroFactura)) {
        alert("El número de factura debe contener solo dígitos numéricos.");
        return false;
    }

    return true;

}

// Validar cambios de vario
function validarCambiosVario() {
    var nombre = $('#nombreInput').val();
    var fechaIngreso = $('#fechaIngresoInput').val();

    // Validar que el nombre no esté vacío y tenga una longitud máxima de 100 caracteres
    if (nombre === "" || nombre.length > 100) {
        alert("Por favor, ingrese un nombre válido (máximo 100 caracteres).");
        return false;
    }

    // Validar que la fecha de ingreso no sea una fecha futura
    var fechaActual = new Date().toISOString().split("T")[0];
    if (fechaIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return false;
    }

    return true;
}
