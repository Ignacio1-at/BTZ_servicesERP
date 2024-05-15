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
    var tipoLicenciaNew = document.getElementById('tipo_licencia').value;
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
        if (tipoLicenciaNew.trim() !== '--') {
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

// Función para mostrar los detalles del personal en modo visualización
function mostrarDetallesModalVisualizacion(personal) {
    // Obtener el contenido HTML de las especialidades
    var especialidadesHTML = personal.especialidades.map(function (nombre) {
        return '<li>' + nombre + '</li>';
    }).join('');

    // Construir el contenido del modal en modo visualización
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

    // Actualizar el contenido del modal y ocultar el botón de guardar
    $('#modalDetallePersonal .modal-body').html(modalContent);
    $('#modalDetallePersonal').modal('show');
    $('#btnGuardar').hide();
}

// Función para mostrar los detalles del personal en modo edición
function mostrarDetallesModalEdicion(personal) {
    // Inicializar especialidadesHTML como cadena vacía
    var especialidadesHTML = '';

    if (personal.especialidades && personal.especialidades.length > 0) {
        // Obtener el contenido HTML de las especialidades con ID y nombre
        especialidadesHTML = personal.especialidades.map(function (nombre) {
            return `<li data-id="undefined">${nombre}</li>`;
        }).join('');
    }

    $.ajax({
        url: obtenerListaEspecialidadesURL,
        type: 'GET',
        success: function (response) {
            // Crear la lista de selección de especialidades con ID y nombre
            var especialidades = response.especialidades;
            var opcionesEspecialidades = '<option value="">Seleccione una especialidad</option>';
            especialidades.forEach(function (especialidad) {
                opcionesEspecialidades += `<option value="${especialidad.id}">${especialidad.nombre}</option>`;
            });

            // Obtener las IDs de las especialidades existentes comparando los nombres
            var especialidadesExistentes = [];
            personal.especialidades.forEach(function (nombreEspecialidad) {
                var especialidadEncontrada = especialidades.find(function (especialidad) {
                    return especialidad.nombre === nombreEspecialidad;
                });
                if (especialidadEncontrada) {
                    especialidadesExistentes.push(especialidadEncontrada.id);
                }
            });

            console.log("Especialidades existentes ID al finalizar carga del modal:", especialidadesExistentes);

            // Generar el HTML de las especialidades existentes con la ID correcta
            especialidadesHTML = personal.especialidades.map(function (nombreEspecialidad) {
                var especialidadEncontrada = especialidades.find(function (especialidad) {
                    return especialidad.nombre === nombreEspecialidad;
                });
                var idEspecialidad = especialidadEncontrada ? especialidadEncontrada.id : '';
                return `<li data-id="${idEspecialidad}">${nombreEspecialidad}</li>`;
            }).join('');

            // Actualizar el contenido del modal con los detalles obtenidos y la lista de selección de especialidades
            var modalContent = `
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
                    </select>
                </p>
                <p><strong>Estado:  </strong>${personal.estado}</p>
                <p><strong>Especialidades:</strong></p>
                <ul id="especialidadesList">${especialidadesHTML}</ul>
                <label for="nuevaEspecialidadSelect">Agregar nueva especialidad:</label>
                <select id="nuevaEspecialidadSelect">${opcionesEspecialidades}</select>
                <button onclick="agregarEspecialidadSeleccionada(${JSON.stringify(especialidadesExistentes)})">Agregar</button>
            `;

            // Actualizar el contenido del modal y mostrar el botón de guardar
            $('#modalDetallePersonal .modal-body').html(modalContent);
            $('#btnGuardar').show();

            // Manejar la visibilidad del campo de selección de licencia
            if (personal.conductor === 'No') {
                $('#tipoLicenciaSelect').hide();
            }

            // Manejar la visibilidad del campo de selección de licencia al cambiar la selección del campo "Conductor"
            $('#conductorSelect').change(function () {
                var seleccion = $(this).val();
                if (seleccion === 'No') {
                    $('#tipoLicenciaSelect').val('--'); // Establecer el valor del tipo de licencia como '--'
                    $('#tipoLicenciaSelect').hide();
                } else {
                    $('#tipoLicenciaSelect').show();
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener la lista de especialidades:', error);
        }
    });
}

// Función para agregar una especialidad seleccionada a la lista
function agregarEspecialidadSeleccionada(especialidadesExistentes) {
    var nuevaEspecialidadId = $("#nuevaEspecialidadSelect").val(); // Obtener la ID de la especialidad seleccionada
    var nuevaEspecialidadNombre = $("#nuevaEspecialidadSelect option:selected").text(); // Obtener el nombre de la especialidad seleccionada

    console.log("Nueva especialidad ID:", nuevaEspecialidadId);
    console.log("Nueva especialidad nombre:", nuevaEspecialidadNombre);

    if (nuevaEspecialidadId === "") {
        alert("No se ha seleccionado una especialidad válida.");
        return;
    }

    // Verificar si la especialidad ya está presente en la lista de especialidades del personal
    if (especialidadesExistentes.includes(parseInt(nuevaEspecialidadId))) {
        alert("La especialidad seleccionada ya está asociada al personal.");
        return;
    }

    // Agregar la nueva especialidad a la lista de especialidades del personal
    var nuevaEspecialidadItem = `<li data-id="${nuevaEspecialidadId}">${nuevaEspecialidadNombre}</li>`;
    $("#especialidadesList").append(nuevaEspecialidadItem);
}


// Función para cambiar entre el modo visualización y edición
function cambiarModo() {
    var btnCambiarModo = $("#btnCambiarModo");
    var modoVisualizacion = btnCambiarModo.hasClass("modo-visualizacion");

    if (modoVisualizacion) {
        // Cambiar al modo de edición
        mostrarDetallesModalEdicion(personal);
        btnCambiarModo.removeClass("modo-visualizacion").addClass("modo-edicion");
    } else {
        // Cambiar al modo de visualización
        mostrarDetallesModalVisualizacion(personal);
        btnCambiarModo.removeClass("modo-edicion").addClass("modo-visualizacion");
    }
}

// Función para guardar los cambios realizados en el modo de edición
function guardarCambios() {
    // Llama a la función de validación antes de enviar los datos al servidor
    if (!validarActualizacion()) {
        // Si la validación falla, detén el proceso de guardado
        return;
    }

    // Obtener los nuevos valores de los campos
    var nombre = $("#nombreInput").val();
    var rut = $("#rutInput").val();
    var cargo = $("#cargoSelect").val();
    var conductor = $("#conductorSelect").val();
    var tipoLicencia = $("#tipoLicenciaSelect").val(); // Obtener el valor del tipo de licencia

    // Validar el tipo de licencia usando la función validarConductorYLicencia
    tipoLicencia = validarConductorYLicencia(conductor, tipoLicencia);

    // Obtener la ID del personal
    var personalId = personal.id;

    // Obtener las especialidades seleccionadas desde el formulario
    var especialidadesSeleccionadas = [];
    $("#especialidadesList li").each(function () {
        especialidadesSeleccionadas.push($(this).data('id'));
    });

    // Datos a enviar al servidor
    var datos = {
        personal_id: personalId,
        nombre: nombre,
        rut: rut,
        cargo: cargo,
        conductor: conductor,
        tipo_licencia: tipoLicencia,  // Utilizar el valor validado del tipo de licencia
        especialidades: especialidadesSeleccionadas
        // Agrega más campos según sea necesario
    };

    console.log(datos)

    // Realizar la solicitud AJAX para guardar los cambios
    $.ajax({
        url: actualizarInformacionPersonalURL,
        type: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        data: datos,
        success: function (response) {
            // Manejar la respuesta del servidor si es necesario
            console.log("Cambios guardados exitosamente:", response);
            location.reload();
        },
        error: function (xhr, status, error) {
            // Manejar errores si la solicitud falla
            console.error('Error al guardar los cambios:', error);
        }
    });
}


$(document).ready(function () {
    // Evento de clic en el botón de cambiar modo
    $("#btnCambiarModo").click(cambiarModo);
});

$(document).ready(function () {
    // Evento de clic en el botón de guardar
    $("#btnGuardar").click(guardarCambios);
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Buscar el token CSRF en las cookies
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


// Agregar evento de escucha para el campo de nombre
$("#nombreInput").on("input", function () {
    // Convertir el valor a mayúsculas
    var nombreInput = $(this).val().toUpperCase();
    // Asignar el valor convertido de vuelta al campo de entrada
    $(this).val(nombreInput);
});

// Función para validar el campo nombre
function validarNombre() {
    var nombreInput = $("#nombreInput").val().trim().toUpperCase();
    var regex = /^[A-Z\s]+$/;

    if (nombreInput === "") {
        alert("Por favor, ingrese un nombre.");
        return false;
    }

    if (!regex.test(nombreInput)) {
        alert("El nombre solo puede contener letras y espacios.");
        return false;
    }

    return true;
}

// Función para validar el campo rut
function validarRut(rut) {
    // Validar el formato del rut
    if (!rut.match(/^\d{7,8}-[0-9Kk]$/)) {
        alert('Por favor, ingrese un RUT válido en el formato 12345678-9.');
        return false;
    }

    return true; // La validación pasó
}

// Función para validar el campo cargo
function validarCargo(cargo) {
    // Validar que se haya seleccionado un cargo
    if (cargo === '') {
        alert('Por favor, seleccione un cargo.');
        return false;
    }

    return true; // La validación pasó
}

// Función para validar el campo conductor y tipo de licencia
function validarConductorYLicencia(conductor, tipoLicencia) {
    // Si el conductor no está seleccionado, el tipo de licencia debe ser '--'
    if (conductor === 'No') {
        return '--';
    }

    // Si el conductor está seleccionado, validar el tipo de licencia
    if (!/^A[1-5]|B|C|D|E|F$/.test(tipoLicencia)) {
        alert('Tipo de Licencia inválida. Debe ser A1, A2, A3, A4, A5, B, C, D, E, F.');
        return false;
    }

    return tipoLicencia; // La validación pasó
}

// Función para validar la nueva especialidad
function validarNuevaEspecialidad(nuevaEspecialidad) {
    // Validar que se haya seleccionado una nueva especialidad
    if (nuevaEspecialidad === '') {
        alert('Por favor, seleccione una nueva especialidad.');
        return false;
    }

    return true; // La validación pasó
}

function validarActualizacion() {
    var nombre = $("#nombreInput").val();
    var rut = $("#rutInput").val();
    var cargo = $("#cargoSelect").val();
    var conductor = $("#conductorSelect").val();
    var tipoLicencia = $("#tipoLicenciaSelect").val();
    var nuevaEspecialidad = $("#nuevaEspecialidadSelect").val();

    // Llamar a las funciones de validación correspondientes según el campo que se esté modificando
    if (nombre !== '' && !validarNombre(nombre)) return false;
    if (rut !== '' && !validarRut(rut)) return false;
    if (cargo !== '' && !validarCargo(cargo)) return false;
    if (!validarConductorYLicencia(conductor, tipoLicencia)) return false;

    // Validar la nueva especialidad sólo si se ha seleccionado una opción diferente de la opción vacía
    if (nuevaEspecialidad !== '') {
        if (!validarNuevaEspecialidad(nuevaEspecialidad)) return false;
    }

    return true; // Todas las validaciones pasaron
}

// Agregar controladores de eventos para activar las validaciones cuando se modifican los campos
$("#nombreInput").on("input", function () {
    validarNombre($(this).val());
});

$("#rutInput").on("input", function () {
    validarRut($(this).val());
});

$("#cargoSelect").on("change", function () {
    validarCargo($(this).val());
});

$("#conductorSelect").on("change", function () {
    validarConductorYLicencia($(this).val(), $("#tipoLicenciaSelect").val());
});

$("#tipoLicenciaSelect").on("change", function () {
    validarConductorYLicencia($("#conductorSelect").val(), $(this).val());
});

$("#nuevaEspecialidadSelect").on("change", function () {
    validarNuevaEspecialidad($(this).val());
});
