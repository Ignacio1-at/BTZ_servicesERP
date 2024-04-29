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

var rutEsValido = false; // Declaración de la variable global rutEsValido

function validarRut(rutSinDigito, digitoVerificador) {
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
    var nombre = nombreInput.value.trim().toUpperCase();
    var rutSinDigito = document.getElementById('rutSinDigito').value;
    var digitoVerificador = document.getElementById('digitoVerificador').value;
    var conductor = document.getElementById('conductor').value;
    var tipoLicencia = document.getElementById('tipo_licencia').value;
    var especialidades = $('input[name="especialidad[]"]:checked');

    // Validar el RUT
    if (!validarRut(rutSinDigito, digitoVerificador)) {
        return false; // Detener el envío del formulario si el RUT no es válido
    }

    // Resto de validaciones...

    // Verificar si el nombre está vacío
    if (nombre === '') {
        alert('El campo Nombre no puede estar vacío.');
        return false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre)) {
        alert('El campo Nombre solo puede contener letras y espacios.');
        return false;
    }

    // Verificar si el Tipo de Licencia es válido
    if (conductor === 'Si') {
        // Si el conductor está seleccionado, el tipo de licencia debe ser válido
        if (!/^A[1-5]|B|C|D|E|F$/.test(tipoLicencia)) {
            alert('Tipo de Licencia inválida. Debe ser A1, A2, A3, A4, A5, B, C, D, E, F.');
            return false;
        }
    } else {
        // Si el conductor no está seleccionado, el tipo de licencia debe ser '--'
        if (tipoLicencia.trim() !== '--') {
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
    nombreInput.value = nombre;
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

var personalActual; // Variable para almacenar los datos del personal

function abrirDetallePersonal(personalId) {
    obtenerDetallesPersonal(personalId);
    guardarCambios(personalId)
}

function obtenerDetallesPersonal(personalId) {
    $.ajax({
        url: obtenerDetallesPersonalURL,
        type: 'GET',
        data: { personal_id: personalId },
        success: function (response) {
            var detallesPersonal = JSON.parse(response);
            var personal = detallesPersonal[0].fields;

            // Obtener los IDs de las especialidades del personal
            var especialidadesIds = personal.especialidades;

            // Hacer una solicitud para obtener los nombres de las especialidades por sus IDs
            obtenerNombresEspecialidades(especialidadesIds, function (nombresEspecialidades) {
                personal.especialidades = nombresEspecialidades;
                personalActual = personal;

                mostrarDetallesModal(personal);
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

function mostrarDetallesModal(personal, modoVisualizar = true) {
    // Obtener el contenido HTML de las especialidades
    var especialidadesHTML = personal.especialidades.map(function (nombre) {
        return '<li>' + nombre + '</li>';
    }).join('');

    // Verificar si estamos en modo visualizar o en modo editar
    if (modoVisualizar) {
        // Mostrar los detalles en modo visualizar
        var modalContent = `
            <p><strong>Nombre:</strong> ${personal.nombre}</p>
            <p><strong>Rut:</strong> ${personal.rut}</p>
            <p><strong>Cargo:</strong> ${personal.cargo}</p>
            <p><strong>Conductor:</strong> ${personal.conductor}</p>
            <p><strong>Tipo de Licencia:</strong> ${personal.tipo_licencia}</p>
            <p><strong>Estado:</strong> ${personal.estado}</p>
            <p><strong>Especialidades:</strong></p>
            <ul>${especialidadesHTML}</ul>
            <!-- Agrega más campos según sea necesario -->
        `;
    } else {
        // Mostrar los detalles en modo editar
        // Hacer una solicitud al servidor para obtener la lista de especialidades disponibles
        $.ajax({
            url: obtenerListaEspecialidadesURL,
            type: 'GET',
            success: function (response) {
                // Crear la lista de selección de especialidades
                var especialidades = response.especialidades;
                var opcionesEspecialidades = '<option value="">Seleccione una especialidad</option>';
                especialidades.forEach(function (especialidad) {
                    opcionesEspecialidades += `<option value="${especialidad.id}">${especialidad.nombre}</option>`;
                });

                // Actualizar el contenido del modal con los detalles obtenidos y la lista de selección de especialidades
                modalContent = `
                    <p><strong>Nombre:</strong> <input type="text" id="nombreInput" value="${personal.nombre}"></p>
                    <p><strong>Rut:</strong> <input type="text" id="rutInput" value="${personal.rut}"></p>
                    <p><strong>Cargo:</strong> 
                        <select id="cargoSelect" name="cargo" class="form-select" required>
                            <option value="Operario" ${personal.cargo === 'Operario' ? 'selected' : ''}>Operario</option>
                            <option value="Jefe de Cuadrilla" ${personal.cargo === 'Jefe de Cuadrilla' ? 'selected' : ''}>Jefe de Cuadrilla</option>
                            <option value="Supervisor" ${personal.cargo === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
                        </select>
                    </p>
                    <p><strong>Conductor:</strong> 
                        <select id="conductorSelect">
                            <option value="Si" ${personal.conductor === 'Si' ? 'selected' : ''}>Si</option>
                            <option value="No" ${personal.conductor === 'No' ? 'selected' : ''}>No</option>
                        </select>
                    </p>
                    <p><strong>Tipo de Licencia:</strong> 
                        <select id="tipoLicenciaSelect">
                            <option value="--" ${personal.tipo_licencia === '--' ? 'selected' : ''}>--</option>
                            <option value="A1" ${personal.tipo_licencia === 'A1' ? 'selected' : ''}>A1</option>
                            <option value="A2" ${personal.tipo_licencia === 'A2' ? 'selected' : ''}>A2</option>
                            <option value="A3" ${personal.tipo_licencia === 'A3' ? 'selected' : ''}>A3</option>
                            <option value="A4" ${personal.tipo_licencia === 'A4' ? 'selected' : ''}>A4</option>
                            <option value="A5" ${personal.tipo_licencia === 'A5' ? 'selected' : ''}>A5</option>
                            <option value="B" ${personal.tipo_licencia === 'B' ? 'selected' : ''}>B</option>
                            <option value="C" ${personal.tipo_licencia === 'C' ? 'selected' : ''}>C</option>
                            <option value="D" ${personal.tipo_licencia === 'D' ? 'selected' : ''}>D</option>
                            <option value="E" ${personal.tipo_licencia === 'E' ? 'selected' : ''}>E</option>
                            <option value="F" ${personal.tipo_licencia === 'F' ? 'selected' : ''}>F</option>
                            <!-- Agrega más opciones según sea necesario -->
                        </select>
                    </p>
                    <p><strong>Estado:  </strong>${personal.estado}</p>
                    <p><strong>Especialidades:</strong></p>
                    <ul id="especialidadesList">${especialidadesHTML}</ul>
                    <label for="nuevaEspecialidadSelect">Agregar nueva especialidad:</label>
                    <select id="nuevaEspecialidadSelect">${opcionesEspecialidades}</select>
                    <button onclick="agregarEspecialidadSeleccionada()">Agregar</button>
                `;

                // Actualizar el contenido del modal
                $('#modalDetallePersonal .modal-body').html(modalContent);
            },
            error: function (xhr, status, error) {
                console.error('Error al obtener la lista de especialidades:', error);
            }
        });
    }

    // Actualizar el contenido del modal y mostrarlo
    $('#modalDetallePersonal .modal-body').html(modalContent);
    $('#modalDetallePersonal').modal('show');
}

function agregarEspecialidadSeleccionada() {
    var nuevaEspecialidadId = $('#nuevaEspecialidadSelect').val();
    var nuevaEspecialidadNombre = $('#nuevaEspecialidadSelect option:selected').text();
    if (nuevaEspecialidadId && nuevaEspecialidadNombre) {
        // Agregar la nueva especialidad seleccionada a la lista
        $('#especialidadesList').append('<li>' + nuevaEspecialidadNombre + '</li>');
    } else {
        alert('Por favor, seleccione una especialidad.');
    }
}

// Variable para almacenar el modo actual
var modoVisualizacion = true; // Inicialmente en modo de visualización


// Función para cambiar entre los modos de visualización y edición
function cambiarModo() {
    modoVisualizacion = !modoVisualizacion; // Cambiar el modo

    // Actualizar el texto y la función del botón según el modo actual
    var btnCambiarModo = document.getElementById("btnCambiarModo");
    if (modoVisualizacion) {
        btnCambiarModo.textContent = "Editar";
        btnCambiarModo.setAttribute("onclick", "cambiarModo()");
        // Llamar a la función para mostrar en modo visualizar
        mostrarDetallesModal(personalActual, true);
        // Ocultar el botón de guardar
        document.getElementById("btnGuardar").style.display = "none";
    } else {
        btnCambiarModo.textContent = "Visualizar";
        btnCambiarModo.setAttribute("onclick", "cambiarModo()");
        // Llamar a la función para mostrar en modo editar
        mostrarDetallesModal(personalActual, false);
        // Mostrar el botón de guardar
        document.getElementById("btnGuardar").style.display = "inline-block";
    }
}

// Al ocultar el modal, restablecer el botón al estado inicial
$('#modalDetallePersonal').on('hidden.bs.modal', function () {
    var btnCambiarModo = document.getElementById("btnCambiarModo");
    btnCambiarModo.textContent = "Editar";
    btnCambiarModo.setAttribute("onclick", "cambiarModo()");
});

// Variable para verificar si la función guardarCambios está en proceso
var guardandoCambios = false;

// Función para guardar los cambios
function guardarCambios(personalId) {
    // Verificar si la función ya se está ejecutando
    if (guardandoCambios) {
        // Si ya se está ejecutando, salir de la función para evitar duplicados
        return;
    }

    // Establecer el estado de guardandoCambios como true para indicar que la función se está ejecutando
    guardandoCambios = true;

    // Deshabilitar el botón de guardar para evitar clics repetidos
    document.getElementById("btnGuardar").setAttribute("disabled", "disabled");

    // Obtener los valores actualizados de los campos de entrada
    var nombre = document.getElementById("nombreInput").value;
    var rut = document.getElementById("rutInput").value;
    var cargo = document.getElementById("cargoSelect").value;
    var conductor = document.getElementById("conductorSelect").value;
    var tipoLicencia = document.getElementById("tipoLicenciaSelect").value;
    // Obtener las especialidades seleccionadas
    var especialidades = [];
    $('#especialidadesList li').each(function () {
        especialidades.push($(this).text());
    });
    // Actualizar el objeto personal con los nuevos valores
    personalActual.id = personalId; 
    personalActual.nombre = nombre;
    personalActual.rut = rut;
    personalActual.cargo = cargo;
    personalActual.conductor = conductor;
    personalActual.tipo_licencia = tipoLicencia;
    personalActual.especialidades = especialidades;

    console.log(actualizarInformacionPersonalURL);
    // Enviar los datos actualizados al servidor
    $.ajax({
        url: actualizarInformacionPersonalURL,
        type: 'POST',
        data: JSON.stringify(personalActual), // Convertir el objeto a formato JSON
        contentType: 'application/json',
        success: function (response) {
            // Manejar la respuesta del servidor, si es necesario
            alert("Los cambios han sido guardados exitosamente.");
        },
        error: function (xhr, status, error) {
            // Manejar el error, si ocurre
            console.error('Error al enviar los datos:', error);
            alert("Ocurrió un error al guardar los cambios. Por favor, inténtalo de nuevo más tarde.");
        },
        complete: function () {
            // Establecer el estado de guardandoCambios como false después de que se haya completado la solicitud AJAX
            guardandoCambios = false;

            // Habilitar el botón de guardar después de que se haya completado la solicitud AJAX
            document.getElementById("btnGuardar").removeAttribute("disabled");
        }
    });
}


// Obtener el token CSRF desde la cookie
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Buscar el token CSRF
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Incluir el token CSRF en todas las solicitudes AJAX
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Solo incluir el token CSRF en las solicitudes del mismo origen
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    }
});


// Asignar la función guardarCambios() al botón de guardar
document.getElementById("btnGuardar").addEventListener("click", guardarCambios); 