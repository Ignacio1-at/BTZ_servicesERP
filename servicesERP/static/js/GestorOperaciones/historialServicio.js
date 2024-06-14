// Función para buscar documento
function buscarHistorial() {
    var textoBusqueda = document.getElementById('Buscar').value.toLowerCase();
    var filas = document.querySelectorAll('#tabla-historial tr');

    for (var i = 1; i < filas.length; i++) {
        var fila = filas[i];
        var coincide = false;

        for (var j = 0; j < fila.cells.length; j++) {
            var celda = fila.cells[j];
            var textoCelda = celda.textContent.toLowerCase() || celda.innerText.toLowerCase();

            if (textoCelda.indexOf(textoBusqueda) > -1) {
                coincide = true;
                break;
            }
        }

        if (coincide) {
            fila.style.display = '';
        } else {
            fila.style.display = 'none';
        }
    }
}
