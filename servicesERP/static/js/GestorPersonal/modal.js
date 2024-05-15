function abrirModalAgregarPersonal() {
    var modal = document.getElementById("modalAgregarPersonal");
    modal.style.display = "block";
    document.body.classList.add('modal-active'); // Agregar clase al cuerpo
}

function cerrarModalAgregarPersonal() {
    var modal = document.getElementById("modalAgregarPersonal");
    modal.style.display = "none";
    document.body.classList.remove('modal-active'); // Eliminar clase del cuerpo
    limpiarFormularioPersonal(); // Limpia los campos del formulario
}

function mostrarTipoLicencia() {
    var conductor = document.getElementById('conductor').value;
    var campoTipoLicencia = document.getElementById('campoTipoLicencia');

    if (conductor === 'Si') {
        campoTipoLicencia.style.display = 'block';
    } else {
        campoTipoLicencia.style.display = 'none';
    }
}

// Llamar a la función al cargar la página para asegurarse de que el estado inicial sea correcto
mostrarTipoLicencia();