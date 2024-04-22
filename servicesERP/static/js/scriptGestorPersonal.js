function abrirModalAgregarPersonal() {
    var modal = document.getElementById("modalAgregarPersonal");
    modal.style.display = "block";
    document.body.classList.add('modal-active'); // Agregar clase al cuerpo
}

function cerrarModalAgregarPersonal() {
    var modal = document.getElementById("modalAgregarPersonal");
    modal.style.display = "none";
    document.body.classList.remove('modal-active'); // Eliminar clase del cuerpo
}

function validarFormulario() {
    var nombre = document.getElementById('nombre').value;
    var rut = document.getElementById('rut').value;
    var digitoVerificador = document.getElementById('digitoVerificador').value;
    var digitoVerificadorInput = document.getElementById('digitoVerificador');

    // Verificar que el rut y el dígito verificador solo contengan números o la letra k (mayúscula o minúscula)
    if (!/^\d+$/.test(rut) || !/^[\dK]$/.test(digitoVerificador)) {
        alert('El rut debe contener solo números y el dígito verificador debe ser un número o la letra "K".');
        return false;
    }
    // Formatear el rut
    var rutFormateado = rut.replace('-', ''); // Eliminar guión si existe
    rutFormateado += '-' + document.getElementById('digitoVerificador').value; // Agregar el dígito verificador

    // Asignar el rut formateado de vuelta al input
    document.getElementById('rut').value = rutFormateado;

    if (nombre === '' || rut === '' || cargo === '') {
        alert('Por favor, completa todos los campos.');
        return false;
    }
    return true;
}