// Función para validar el nombre de la motonave
function validarNombreMotonave(nombreMotonave) {
    // Expresión regular para permitir solo letras y espacios
    var regex = /^[A-Za-z\s]+$/;
    return regex.test(nombreMotonave);
}

// Event listener para convertir el texto a mayúsculas al escribir en el campo del nombre
$('#nombreMotonave').on('input', function () {
    var input = $(this);
    var texto = input.val();
    input.val(texto.toUpperCase());
});

function validarCantidadBodegas(cantBodegas) {
    // Verificar que la cantidad de bodegas no esté vacía
    if (cantBodegas === '') {
        return false;
    }

    // Convertir la cantidad de bodegas a un número entero
    var cantidadBodegas = parseInt(cantBodegas);

    // Verificar que la cantidad de bodegas sea un número positivo y no mayor a 15
    if (isNaN(cantidadBodegas) || cantidadBodegas <= 0 || cantidadBodegas > 15) {
        return false;
    }

    return true;
}

function validarCantidadBodegas(cantidadBodegas) {
    // Verificar que la cantidad de bodegas sea un número entero positivo
    return Number.isInteger(Number(cantidadBodegas)) && Number(cantidadBodegas) > 0;
}

function validarNumeroViaje(numeroViaje) {
    // Verificar que el número de viaje sea un número entero positivo
    return Number.isInteger(Number(numeroViaje)) && Number(numeroViaje) > 0;
}

//EDITAR MOTONAVE
function verificarNombreMotonaveExistenteEditar(nombreMotonave, callback) {
    
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            console.log("Respuesta del servidor:", data);
            if (data.error) {
                // Si hay un error en la respuesta, significa que la motonave no existe
                callback(false);
            } else {
                // Si la respuesta no contiene un error, la motonave existe
                callback(true);
            }
        },
        error: function (xhr, status, error) {
            // Manejo de errores: mostrar mensaje de alerta
            if (xhr.status === 404) {
                // Si el código de estado es 404 (Not Found), significa que la motonave no existe
                callback(false);
            } else {
                alert('Error al verificar la existencia de la motonave.');
                console.error('Error al verificar la existencia de la motonave:', error);
            }
        }
    });
}

//AGREGAR MOTONAVE
function verificarNombreMotonaveExistente(nombreMotonave) {
    $.ajax({
        type: 'GET',
        url: obtenerDetallesMotonaveURL,
        data: { 'nombre_motonave': nombreMotonave },
        success: function (data) {
            console.log("Respuesta del servidor:", data);
            if (data.error) {
                // Si hay un error en la respuesta, significa que la motonave no existe
                submitForm();
            } else {
                // Si la respuesta no contiene un error, la motonave existe
                alert('La motonave ya existe en el sistema.');
            }
        },
        error: function (xhr, status, error) {
            // Manejo de errores: mostrar mensaje de alerta
            if (xhr.status === 404) {
                // Si el código de estado es 404 (Not Found), significa que la motonave no existe
                submitForm();
            } else {
                alert('Error al verificar la existencia de la motonave.');
                console.error('Error al verificar la existencia de la motonave:', error);
            }
        }
    });
}