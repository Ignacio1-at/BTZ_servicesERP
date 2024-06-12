var rutEsValido = false; // Declaración de la variable global rutEsValido

function validarRutAgregar(rutSinDigito, digitoVerificador) {
    console.log('La función validarRut se está llamando correctamente.');

    // Verificar si el RUT está vacío
    if (rutSinDigito.trim() === '' || digitoVerificador.trim() === '') {
        alert('El campo RUT no puede estar vacío.');
        return false;
    }

    // Verificar que el rut y el dígito verificador solo contengan números o la letra k (mayúscula o minúscula)
    if (!/^\d+$/.test(rutSinDigito) || !/^[\dKk]$/.test(digitoVerificador)) {
        alert('El rut debe contener solo números y el dígito verificador debe ser un número o la letra "K".');
        return false;
    }

    // Formatear el rut
    var rutFormateado = rutSinDigito.replace(/\D/g, ''); // Remover todos los caracteres no numéricos
    rutFormateado += '-' + digitoVerificador.toUpperCase(); // Agregar el dígito verificador, convertido a mayúscula

    // Realizar la solicitud AJAX para validar el rut
    $.ajax({
        url: validarRutURL,
        data: { 'rut': rutFormateado },
        async: false, // Hacer la solicitud síncrona para esperar la respuesta antes de continuar
        success: function (response) {
            if (response.existe) {
                alert('El RUT ingresado ya existe en la base de datos.');
            } else {
                // Si el RUT no existe en la base de datos, marcarlo como válido
                rutEsValido = true;
            }
        },
        error: function (xhr, status, error) {
            // Manejar errores de la solicitud AJAX, si es necesario
            alert('Ocurrió un error al validar el RUT: ' + error);
        }
    });

    // Devolver true solo si el RUT no existe en la base de datos
    return rutEsValido;
}

function validarFormulario() {
    // Obtener los valores del formulario
    var nombreInput = document.getElementById('nombre');
    var nombreNuevo = nombreInput.value.trim().toUpperCase();
    var rutSinDigito = document.getElementById('rutSinDigito').value;
    var digitoVerificador = document.getElementById('digitoVerificador').value;
    var conductorNew = document.getElementById('conductor').value;
    var tipoLicenciaNew = document.getElementById('tipoLicencia').value;
    var especialidades = $('input[name="especialidad[]"]:checked');

    // Validar el RUT
    if (!validarRutAgregar(rutSinDigito, digitoVerificador)) {
        return false; // Detener el envío del formulario si el RUT no es válido
    }

    // Resto de validaciones...

    // Verificar si el nombre está vacío
    if (nombreNuevo === '') {
        alert('El campo Nombre no puede estar vacío.');
        return false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombreNuevo)) {
        alert('El campo Nombre solo puede contener letras y espacios.');
        return false;
    }

    // Verificar si el Tipo de Licencia es válido
    if (conductorNew === 'Si') {
        // Si el conductor está seleccionado, el tipo de licencia debe ser válido
        if (!/^A[1-5]|B|C|D|E|F$/.test(tipoLicenciaNew)) {
            alert('Tipo de Licencia inválida. Debe ser A1, A2, A3, A4, A5, B, C, D, E, F.');
            return false;
        }
    } else {
        // Si el conductor no está seleccionado, el tipo de licencia debe ser '--'
        if (tipoLicenciaNew !== '--') {
            alert('El Tipo de Licencia debe ser "--" si el conductor no está seleccionado.');
            return false;
        }
    }

    // Verificar si se ha seleccionado al menos una especialidad
    if (especialidades.length === 0) {
        alert('Debes seleccionar al menos una especialidad.');
        return false;
    }

    // Si todas las validaciones pasan, asignar el nombre y devolver true
    nombreInput.value = nombreNuevo;
    return true;
}

function limpiarFormularioPersonal() {
    // Limpia los valores de los campos del formulario
    document.getElementById('nombre').value = '';
    document.getElementById('rutSinDigito').value = '';
    document.getElementById('digitoVerificador').value = '';

    // Valores predeterminado
    document.getElementById('cargo').value = 'Operario';
    document.getElementById('conductor').value = 'Si';
    document.getElementById('tipo_licencia').value = 'A1';

    // Desmarca todas las casillas de verificación de especialidades
    var especialidades = document.querySelectorAll('input[name="especialidad"]');
    especialidades.forEach(function (checkbox) {
        checkbox.checked = false;
    });

    // Llama a la función para actualizar el estado del botón "Agregar"
    actualizarEstadoBoton();
}

// Función para actualizar el estado del botón "Agregar" y el atributo "data-has-specialty"
function actualizarEstadoBoton() {
    var checkboxes = document.getElementsByName('especialidad[]');
    var btnAgregar = document.getElementById('btnAgregar');
    var seleccionadas = false;

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            seleccionadas = true;
            break;
        }
    }

    if (seleccionadas) {
        btnAgregar.disabled = false;
    } else {
        btnAgregar.disabled = true;
    }
}
// Llama a la función al cargar la página para asegurarse de que el estado inicial sea correcto
actualizarEstadoBoton();