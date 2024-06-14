//Funciona para manejar como funciona y filtra el menu
$(document).ready(function () {
    $('.menu-item').click(function (e) {
        e.preventDefault();
        var seccion = $(this).data('seccion');
        var submenu = $(this).next('.submenu');

        if (seccion === "Todos") {
            // Mostrar todos los documentos
            $('#tabla-documentos-body tr').show();
        } else if (seccion === "Otros") {
            // Mostrar solo los documentos de la sección "Otros"
            $('#tabla-documentos-body tr').hide();
            $('#tabla-documentos-body tr').each(function () {
                var documentoSeccion = $(this).find('td:nth-child(3)').text();
                if (documentoSeccion === "Otros") {
                    $(this).show();
                }
            });
        } else {
            if (submenu.is(':visible')) {
                submenu.slideUp();
                $(this).removeClass('active');
            } else {
                $('.submenu').slideUp();
                submenu.slideDown();
                $('.menu-item').removeClass('active');
                $(this).addClass('active');
            }
        }
    });

    $('.sub-menu-item').click(function (e) {
        e.preventDefault();
        var subseccion = $(this).data('subseccion');

        // Ocultar todas las filas de la tabla
        $('#tabla-documentos-body tr').hide();

        // Mostrar solo las filas que coinciden con la subsección seleccionada
        $('#tabla-documentos-body tr').each(function () {
            var documentoSeccion = $(this).find('td:nth-child(3)').text();
            var documentoSubseccion = $(this).find('td:nth-child(4)').text();
            if (documentoSeccion === subseccion || documentoSubseccion === subseccion) {
                $(this).show();
            }
        });
    });

    // Manejar cambios en el select de sección
    $('#id_seccion').change(function () {
        var seccion = $(this).val();
        var subseccionContainer = $('#subseccion-container');
        var personalContainer = $('#personal-container');
        var fichaServicioContainer = $('#ficha-servicio-container');

        // Ocultar todos los contenedores
        subseccionContainer.hide();
        personalContainer.hide();
        fichaServicioContainer.hide();

        // Mostrar los contenedores correspondientes y habilitar/deshabilitar los campos
        if (seccion === 'Personal') {
            subseccionContainer.show();
            $('#id_sub_seccion option').prop('disabled', true);
            $('#id_sub_seccion option[value="Contrato"]').prop('disabled', false);
            $('#id_sub_seccion option[value="Ficha de Ingreso"]').prop('disabled', false);
            personalContainer.show();

            // Aplicar estilos CSS
            $('#id_sub_seccion').addClass('custom-select');
            $('#id_personal').addClass('custom-select');
            $('#modalSubirDocumento label[for="id_sub_seccion"]').addClass('custom-label');
            $('#modalSubirDocumento label[for="id_personal"]').addClass('custom-label');
        } else if (seccion === 'Inventario') {
            subseccionContainer.show();
            $('#id_sub_seccion option').prop('disabled', true);
            $('#id_sub_seccion option[value="Boletas"]').prop('disabled', false);
            $('#id_sub_seccion option[value="Facturas"]').prop('disabled', false);

            // Aplicar estilos CSS
            $('#id_sub_seccion').addClass('custom-select');
            $('#modalSubirDocumento label[for="id_sub_seccion"]').addClass('custom-label');
        } else if (seccion === 'Servicio') {
            subseccionContainer.show();
            $('#id_sub_seccion option').prop('disabled', true);
            $('#id_sub_seccion option[value="Reportes"]').prop('disabled', false);
            $('#id_sub_seccion option[value="Fichas"]').prop('disabled', false);
            fichaServicioContainer.show();

            // Aplicar estilos CSS
            $('#id_sub_seccion').addClass('custom-select');
            $('#id_ficha_servicio').addClass('custom-select');
            $('#modalSubirDocumento label[for="id_sub_seccion"]').addClass('custom-label');
            $('#modalSubirDocumento label[for="id_ficha_servicio"]').addClass('custom-label');
        } else if (seccion === 'Otros') {
            $('#id_sub_seccion').val('');
            $('#id_sub_seccion option').prop('disabled', true);
        }
    });

    // Simular cambio en el select de sección para mostrar la sección "Personal" inicialmente
    $('#id_seccion').trigger('change');
});

// Función para manejar el envío del formulario de subida de documentos
$('#modalSubirDocumento form').on('submit', function (e) {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los datos del formulario
    var formData = new FormData(this);

    $.ajax({
        url: '/erp/gestor-documentos/',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.success) {
                console.log('Documento subido exitosamente');
                $('#modalSubirDocumento').modal('hide');
                location.reload();
            } else {
                console.error('Errores en el formulario:', response.errors);
            }
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
});

$(document).ready(function () {
    // Inicializar componentes de Bootstrap
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    $('.modal').modal({
        backdrop: 'static',
        keyboard: false
    });
});

/*TRABAJANDO funcion para previzualisar documentos como en google drive
function verDocumento(documentoId) {
    // Obtener la URL del documento
    var documentoUrl = `/erp/gestor-documentos/obtener_documentos/?documento_id=${documentoId}`;

    // Obtener la extensión del archivo
    var extension = documentoUrl.split('.').pop().toLowerCase();

    // Renderizar el archivo según su tipo
    if (extension === 'pdf') {
        // Renderizar PDF
        PDFViewerWrapper.renderPDF(documentoUrl, '#visorArchivos');
    } else if (['doc', 'docx'].includes(extension)) {
        // Renderizar documento de Microsoft Word
        PDFViewerWrapper.renderOfficeDocument(documentoUrl, '#visorArchivos');
    } else if (['xls', 'xlsx'].includes(extension)) {
        // Renderizar hoja de cálculo de Microsoft Excel
        PDFViewerWrapper.renderOfficeDocument(documentoUrl, '#visorArchivos');
    } else if (['ppt', 'pptx'].includes(extension)) {
        // Renderizar presentación de Microsoft PowerPoint
        PDFViewerWrapper.renderOfficeDocument(documentoUrl, '#visorArchivos');
    } else {
        // Otros tipos de archivos
        PDFViewerWrapper.renderGenericFile(documentoUrl, '#visorArchivos');
    }

    // Abrir el modal
    $('#modalVerDocumento').modal('show');
}*/

// Función para eliminar documento
function eliminarDocumento(documentoId) {
    console.log('Eliminar documento ID:', documentoId);
    if (documentoId === undefined) {
        console.error('El ID del documento es undefined.');
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres eliminar este documento?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8d000e',
        cancelButtonColor: '#01152a',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            // Crear un formulario temporal para enviar la solicitud POST
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/erp/gestor-documentos/eliminar_documento/${documentoId}/`;

            // Agregar el token CSRF al formulario
            const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);

            // Agregar el formulario al documento y enviarlo
            document.body.appendChild(form);
            form.submit();
        }
    });
}

// Función para descargar documento
function descargarDocumento(documentoId) {
    // Obtener la URL base del sitio
    var baseUrl = window.location.origin;

    // Construir la URL del documento
    var documentoUrl = baseUrl + "/erp/gestor-documentos/obtener_documentos/?documento_id=" + documentoId;

    // Crear un elemento <a> temporal para iniciar la descarga
    var link = document.createElement('a');
    link.href = documentoUrl;
    link.download = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Función para buscar documento
function buscarDocumento() {
    var textoBusqueda = document.getElementById('Buscar').value.toLowerCase();
    var filas = document.querySelectorAll('#tabla-documentos tr');

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