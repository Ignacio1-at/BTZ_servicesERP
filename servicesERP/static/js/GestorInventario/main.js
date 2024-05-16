$(document).ready(function () {
  // Ocultar todas las filas de tabla al cargar la página
  $('.tablaContenido table').hide();

  // Obtener la última tabla visitada desde la URL
  var urlParams = new URLSearchParams(window.location.search);
  var lastVisitedTab = urlParams.get('lastVisitedTab');

  // Mostrar la última tabla visitada si existe, de lo contrario mostrar la tabla de químicos por defecto
  if (lastVisitedTab) {
    $('#' + lastVisitedTab).show();
  } else {
    $('#tablaQuimico').show();
  }

  // Manejar el clic en los botones del menú
  $('.btn-menu').click(function () {
    // Obtener el data-tab correspondiente al botón clicado
    var tablaToShow = $(this).data('tab');

    // Ocultar todas las filas de tabla
    $('.tablaContenido table').hide();

    // Mostrar solo las filas de la tabla correspondiente al data-tab clicado
    $('#' + tablaToShow).show();
  });
});