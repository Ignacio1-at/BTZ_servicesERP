function filtrarInventario() {
    var textoBusqueda = document.getElementById('Buscar').value.toLowerCase();

    // Filtrar la tabla de químicos
    var filasQuimico = document.querySelectorAll('#tablaQuimico tr');
    filtrarTabla(filasQuimico, textoBusqueda);

    // Filtrar la tabla de vehículos
    var filasVehiculo = document.querySelectorAll('#tablaVehiculo tr');
    filtrarTabla(filasVehiculo, textoBusqueda);

    // Filtrar la tabla de Varios
    var filasVehiculo = document.querySelectorAll('#tablaVarios tr');
    filtrarTabla(filasVehiculo, textoBusqueda);
}

function filtrarTabla(filas, textoBusqueda) {
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



