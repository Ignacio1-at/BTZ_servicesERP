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
    var cargo = document.getElementById('cargo').value;

    if (nombre === '' || rut === '' || cargo === '') {
        alert('Por favor, completa todos los campos.');
        return false;
    }
    return true;
}


