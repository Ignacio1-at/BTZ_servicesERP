// Función para validar el nombre de la motonave
function validarNombreMotonave(nombreMotonave) {
    // Expresión regular para permitir solo letras y espacios
    var regex = /^[A-Za-z\s]+$/;
    return regex.test(nombreMotonave);
}