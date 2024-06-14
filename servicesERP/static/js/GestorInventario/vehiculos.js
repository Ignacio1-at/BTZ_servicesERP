// Función para eliminar Vehículos
function eliminarVehiculo(vehiculoId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este vehículo?',
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#8d000e',
        cancelButtonColor: '#01152a',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const form = document.getElementById(`formEliminarVehiculo${vehiculoId}`);
            form.submit();
        }
    });
}

$('#formAgregarVehiculo').submit(function (event) { });

function abrirDetalleVehiculo(vehiculoId) {
    obtenerDetallesVehiculo(vehiculoId);
    console.log('El id es: ', vehiculoId)
}


// Declarar la variable vehiculo en un ámbito global
var vehiculo;

function obtenerDetallesVehiculo(vehiculoId) {
    $.ajax({
        url: obtenerDetallesVehiculoURL,
        type: 'GET',
        data: { vehiculo_id: vehiculoId },
        success: function (response) {
            // Verificar si hay algún error en la respuesta
            if (response.error) {
                console.error('Error al obtener los detalles del vehículo:', response.error);
                return;
            }

            // Asignar los detalles del vehículo a la variable vehiculo
            vehiculo = response;

            // Llamar a mostrarDetallesModalVisualizacion y pasar el objeto vehiculo
            mostrarDetallesModalVisualizacion(vehiculo);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los detalles del vehículo:', error);
        }
    });
}

// Función para mostrar los detalles del vehículo en modo visualización
function mostrarDetallesModalVisualizacion(vehiculo) {
    // Construir el contenido del modal en modo visualización
    var modalContent = `
    <div class="inputBodyDatosGenerales" id="inputBodyDatosGenerales">
        <div class="inputTextoDatosGenerales" id="inputTextoDatosGenerales" style="height: 550px;>
            <div class="modal-body">
                <div class="container" style="padding: 1px !important;">
                    <div class="grid-container">
                        <div class="grid-item grid-item-titulo"><strong>Marca:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.marca}</div>
                        <div class="grid-item grid-item-titulo"><strong>Modelo:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.modelo}</div>
                        <div class="grid-item grid-item-titulo"><strong>Color:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.color}</div>
                        <div class="grid-item grid-item-titulo"><strong>Número de Chasis:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.numero_chasis}</div>
                        <div class="grid-item grid-item-titulo"><strong>Número de Motor:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.numero_motor}</div>
                        <div class="grid-item grid-item-titulo"><strong>Tipo de Vehículo:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.tipo_vehiculo}</div>
                        <div class="grid-item grid-item-titulo"><strong>Cilindrada:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.cilindrada}</div>
                        <div class="grid-item grid-item-titulo"><strong>Patente:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.patente}</div>
                        <div class="grid-item grid-item-titulo"><strong>Primer Ingreso:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.primer_ingreso}</div>
                        <div class="grid-item grid-item-titulo"><strong>Fecha SOAP:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.fecha_soap}</div>
                        <div class="grid-item grid-item-titulo"><strong>Fecha de Permiso de Circulación:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.fecha_permiso_circulacion}</div>
                        <div class="grid-item grid-item-titulo"><strong>Nombre del Seguro:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.seguro_nombre}</div>
                        <div class="grid-item grid-item-titulo"><strong>Fecha de Revisión Técnica:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.fecha_revision_tecnica}</div>
                        <div class="grid-item grid-item-titulo"><strong>Número de Póliza:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.seguro_poliza}</div>
                        <div class="grid-item grid-item-titulo"><strong>Tipo de Combustible:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.tipo_combustible}</div>
                        <div class="grid-item grid-item-titulo"><strong>Estado:</strong></div>
                        <div class="grid-item grid-item-informacion">${vehiculo.estado}</div>
                        <!-- Añadir los demás elementos según sea necesario -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Actualizar el contenido del modal y ocultar el botón de guardar
    $('#modalDetalleVehiculo .modal-body').html(modalContent);
    $('#modalDetalleVehiculo').modal('show');
    $('#btnGuardarAuto').hide();
}

// Función para mostrar los detalles del vehículo en modo edición
function mostrarDetallesModalEdicion(vehiculo) {
    // Construir el contenido del modal en modo edición
    var modalContent = `
        <div class="modal-body"style="height: 632px;>
            <div class="container">
                <div class="row">
                    <div class="col"><strong>Marca:</strong></div>
                    <div class="col"><input type="text" id="marcaInput" value="${vehiculo.marca}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Modelo:</strong></div>
                    <div class="col"><input type="text" id="modeloInput" value="${vehiculo.modelo}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Color:</strong></div>
                    <div class="col"><input type="text" id="colorInput" value="${vehiculo.color}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Número de Motor:</strong></div>
                    <div class="col"><input type="text" id="numeroMotorInput" value="${vehiculo.numero_motor}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Número de Chasis:</strong></div>
                    <div class="col"><input type="text" id="numeroChasisInput" value="${vehiculo.numero_chasis}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Cilindrada:</strong></div>
                    <div class="col"><input type="text" id="cilindradaInput" value="${vehiculo.cilindrada}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Tipo de Vehículo:</strong></div>
                    <div class="col"><input type="text" id="tipoVehiculoInput" value="${vehiculo.tipo_vehiculo}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Primer Ingreso:</strong></div>
                    <div class="col"><input type="date" id="primerIngresoInput" value="${vehiculo.primer_ingreso}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Patente:</strong></div>
                    <div class="col"><input type="text" id="patenteInput" value="${vehiculo.patente}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Fecha de Permiso de Circulación:</strong></div>
                    <div class="col"><input type="date" id="fechaPermisoCirculacionInput" value="${vehiculo.fecha_permiso_circulacion}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Fecha SOAP:</strong></div>
                    <div class="col"><input type="date" id="fechaSoapInput" value="${vehiculo.fecha_soap}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Fecha de Revisión Técnica:</strong></div>
                    <div class="col"><input type="date" id="fechaRevisionTecnicaInput" value="${vehiculo.fecha_revision_tecnica}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Nombre del Seguro:</strong></div>
                    <div class="col"><input type="text" id="seguroNombreInput" value="${vehiculo.seguro_nombre}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Número de Póliza:</strong></div>
                    <div class="col"><input type="number" id="seguroPolizaInput" value="${vehiculo.seguro_poliza}"></div>
                </div>
                <div class="row">
                    <div class="col"><strong>Tipo de Combustible:</strong></div>
                    <div class="col">
                        <select id="tipoCombustibleInput">
                            <option value="93" ${vehiculo.tipo_combustible === '93' ? 'selected' : ''}>93</option>
                            <option value="95" ${vehiculo.tipo_combustible === '95' ? 'selected' : ''}>95</option>
                            <option value="97" ${vehiculo.tipo_combustible === '97' ? 'selected' : ''}>97</option>
                            <option value="diésel" ${vehiculo.tipo_combustible === 'diésel' ? 'selected' : ''}>Diesel</option>
                            <option value="electrico" ${vehiculo.tipo_combustible === 'electrico' ? 'selected' : ''}>Electrico</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Actualizar el contenido del modal y mostrar el botón de guardar
    $('#modalDetalleVehiculo .modal-body').html(modalContent);
    $('#btnGuardarAuto').show();
}

function guardarCambiosVehiculo() {
    var vehiculoId = vehiculo.id;
    var marca = $('#marcaInput').val().trim();
    var modelo = $('#modeloInput').val().trim();
    var color = $('#colorInput').val().trim();
    var numeroMotor = $('#numeroMotorInput').val().trim();
    var numeroChasis = $('#numeroChasisInput').val().trim();
    var cilindrada = $('#cilindradaInput').val().trim();
    var tipoVehiculo = $('#tipoVehiculoInput').val().trim();
    var primerIngreso = $('#primerIngresoInput').val().trim();
    var patente = $('#patenteInput').val().trim();
    var fechaPermisoCirculacion = $('#fechaPermisoCirculacionInput').val().trim();
    var fechaSoap = $('#fechaSoapInput').val().trim();
    var fechaRevisionTecnica = $('#fechaRevisionTecnicaInput').val().trim();
    var seguroNombre = $('#seguroNombreInput').val().trim();
    var seguroPoliza = $('#seguroPolizaInput').val().trim();
    var tipoCombustible = $('#tipoCombustibleInput').val().trim();

    // Validaciones
    if (marca === "" || marca.length > 100) {
        alert("Por favor, ingrese una marca válida (máximo 100 caracteres).");
        return;
    }
    if (modelo === "" || modelo.length > 100) {
        alert("Por favor, ingrese un modelo válido (máximo 100 caracteres).");
        return;
    }
    if (color === "" || color.length > 50) {
        alert("Por favor, ingrese un color válido (máximo 50 caracteres).");
        return;
    }
    if (numeroMotor === "" || numeroMotor.length > 100) {
        alert("Por favor, ingrese un número de motor válido (máximo 100 caracteres).");
        return;
    }
    if (numeroChasis === "" || numeroChasis.length > 100) {
        alert("Por favor, ingrese un número de chasis válido (máximo 100 caracteres).");
        return;
    }
    if (cilindrada === "" || cilindrada.length > 50) {
        alert("Por favor, ingrese una cilindrada válida (máximo 50 caracteres).");
        return;
    }
    if (tipoVehiculo === "" || tipoVehiculo.length > 100) {
        alert("Por favor, ingrese un tipo de vehículo válido (máximo 100 caracteres).");
        return;
    }
    var tiposCombustibleValidos = ['93', '95', '97', 'diésel', 'electrico'];
    if (!tiposCombustibleValidos.includes(tipoCombustible)) {
        alert("Por favor, seleccione un tipo de combustible válido.");
        return;
    }
    if (primerIngreso === "") {
        alert("Por favor, ingrese una fecha de ingreso válida.");
        return;
    }
    var fechaActual = new Date().toISOString().split("T")[0];
    if (primerIngreso > fechaActual) {
        alert("La fecha de ingreso no puede ser una fecha futura.");
        return;
    }
    if (patente === "" || !/^(?=.*[A-Za-z])[A-Za-z0-9]{6}$/.test(patente)) {
        alert("Por favor, ingrese una patente válida (6 caracteres alfanuméricos, al menos una letra).");
        return;
    }
    if (fechaPermisoCirculacion === "") {
        alert("Por favor, ingrese una fecha de permiso de circulación válida.");
        return;
    }
    if (fechaSoap === "") {
        alert("Por favor, ingrese una fecha de SOAP válida.");
        return;
    }
    if (fechaRevisionTecnica === "") {
        alert("Por favor, ingrese una fecha de revisión técnica válida.");
        return;
    }
    if (seguroNombre === "" || seguroNombre.length > 100) {
        alert("Por favor, ingrese un nombre de seguro válido (máximo 100 caracteres).");
        return;
    }
    if (seguroPoliza === "") {
        alert("Por favor, ingrese un número de póliza válido.");
        return;
    }

    // Validar campos únicos (número de motor, chasis y patente)
    $.when(
        validarCampoUnicoCambio(numeroMotor, 'numero_motor', vehiculoId),
        validarCampoUnicoCambio(numeroChasis, 'numero_chasis', vehiculoId),
        validarCampoUnicoCambio(patente, 'patente', vehiculoId)
    ).done(function (resultMotor, resultChasis, resultPatente) {
        if (resultMotor[0] === false || resultChasis[0] === false || resultPatente[0] === false) {
            // Al menos uno de los campos no es único, no se envían los datos al servidor
            return;
        }

        // Todos los campos son únicos, se puede proceder a enviar los datos al servidor
        enviarDatosAlServidor();
    });

    function enviarDatosAlServidor() {
        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        // Enviar los datos actualizados al servidor
        $.ajax({
            url: guardarCambiosVehiculoURL,
            type: 'POST',
            data: {
                vehiculo_id: vehiculoId,
                marca: marca,
                modelo: modelo,
                color: color,
                numero_motor: numeroMotor,
                numero_chasis: numeroChasis,
                cilindrada: cilindrada,
                tipo_vehiculo: tipoVehiculo,
                primer_ingreso: primerIngreso,
                patente: patente,
                fecha_permiso_circulacion: fechaPermisoCirculacion,
                fecha_soap: fechaSoap,
                fecha_revision_tecnica: fechaRevisionTecnica,
                seguro_nombre: seguroNombre,
                seguro_poliza: seguroPoliza,
                tipo_combustible: tipoCombustible,
                csrfmiddlewaretoken: csrfToken
            },
            success: function (response) {
                if (response.success) {
                    console.log("Cambios guardados exitosamente:", response);
                    $('#tablaVehiculo').load(location.href + ' #tablaVehiculo>*', function () {
                        $('#modalDetalleVehiculo').modal('hide');
                    });
                } else {
                    console.log('Error al guardar los cambios:', response.message);
                    alert('Error al guardar los cambios: ' + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.log('Error en la solicitud:', error);
                alert('Ha ocurrido un error al guardar los cambios. Por favor, intenta nuevamente.');
            }
        });
    }
}

function validarCampoUnicoCambio(valor, campo, vehiculoId) {
    return $.ajax({
        url: validarCampoUnicoVehiculoCambioURL,
        type: 'POST',
        data: {
            valor: valor,
            campo: campo,
            vehiculo_id: vehiculoId,
            csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
        }
    }).then(function (response) {
        if (response.existe) {
            alert("El " + campo + " ingresado ya existe en otro vehículo.");
            return false;
        }
        return true;
    }).fail(function (xhr, status, error) {
        console.log('Error en la solicitud de validación:', error);
        alert("Ocurrió un error al validar el " + campo + ". Por favor, intenta nuevamente.");
        return false;
    });
}

// Variable para controlar el modo actual (true: visualización, false: edición)
var modoVisualizacionAuto = true;

// Función para cambiar entre los modos de visualización y edición
function cambiarModoAuto() {
    modoVisualizacionAuto = !modoVisualizacionAuto;

    if (modoVisualizacionAuto) {
        mostrarDetallesModalVisualizacion(vehiculo);
    } else {
        mostrarDetallesModalEdicion(vehiculo);
    }
}

// Asignar el evento click al botón "Cambiar Modo"
$('#btnCambiarModoAuto').click(function () {
    cambiarModoAuto();
});

$(document).ready(function () {
    // Evento de clic en el botón de guardar
    $("#btnGuardarAuto").click(guardarCambiosVehiculo);
});