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