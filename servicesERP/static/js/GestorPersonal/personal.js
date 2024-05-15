// Función para eliminar personal
function eliminarPersonal(personalId) {
    if (confirm("¿Estás seguro de eliminar este registro de personal?")) {
        const form = document.getElementById(`formEliminarPersonal${personalId}`);
        form.submit();
    }
}

function filtrarPersonal() {
    // Obtener el texto ingresado en el campo de búsqueda
    var textoBusqueda = document.getElementById('Buscar').value.toUpperCase();

    // Obtener todas las filas de la tabla
    var filas = document.getElementsByTagName('tr');

    // Iterar sobre las filas de la tabla, empezando desde la segunda fila (índice 1) para evitar la fila de encabezados
    for (var i = 1; i < filas.length; i++) {
        var fila = filas[i];
        var nombre = fila.getElementsByTagName('td')[0]; // Obtener el nombre de la primera columna

        // Si la fila no es nula y el nombre no es nulo
        if (fila && nombre) {
            var textoNombre = nombre.textContent.toUpperCase() || nombre.innerText.toUpperCase(); // Obtener el texto del nombre y convertirlo a mayúsculas

            // Si el texto del nombre contiene el texto de búsqueda, mostrar la fila; de lo contrario, ocultarla
            if (textoNombre.indexOf(textoBusqueda) > -1) {
                fila.style.display = '';
            } else {
                fila.style.display = 'none';
            }
        }
    }
}

function abrirDetallePersonal(personalId) {
    obtenerDetallesPersonal(personalId);
    console.log(personalId)
}

var personal; // Declarar personal fuera de la función para que esté disponible en todo el alcance del archivo

function obtenerDetallesPersonal(personalId) {
    $.ajax({
        url: obtenerDetallesPersonalURL,
        type: 'GET',
        data: { personal_id: personalId },
        success: function (response) {
            var detallesPersonal = JSON.parse(response);
            personal = detallesPersonal[0].fields; // Asignar los detalles del personal a la variable personal

            // Agregar la ID del personal a la variable personal
            personal.id = personalId;

            // Obtener los IDs de las especialidades del personal
            var especialidadesIds = personal.especialidades;

            // Hacer una solicitud para obtener los nombres de las especialidades por sus IDs
            obtenerNombresEspecialidades(especialidadesIds, function (nombresEspecialidades) {
                // Asignar los nombres de las especialidades al objeto personal
                personal.especialidades = nombresEspecialidades;

                // Llamar a mostrarDetallesModal y pasar el objeto personal
                mostrarDetallesModalVisualizacion(personal);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del personal:', error);
        }
    });
}

function obtenerNombresEspecialidades(especialidadesIds, callback) {
    // Hacer una solicitud al servidor para obtener los nombres de las especialidades por sus IDs
    $.ajax({
        url: obtenerNombresEspecialidadesURL,
        type: 'GET',
        data: { especialidades_ids: especialidadesIds },
        success: function (response) {
            callback(response); // Pasar directamente el array de strings al callback
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los nombres de las especialidades:', error);
        }
    });
}