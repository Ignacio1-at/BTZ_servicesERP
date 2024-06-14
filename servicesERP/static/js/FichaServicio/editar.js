const editForm = document.getElementById('fichaServicioEditarForm');
editForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de inmediato

    // Validar datos de la motonave o navío
    const puerto = document.getElementById('puerto');
    const procedenciaCarga = document.querySelector('input[name="procedencia_carga"]');
    const armador = document.querySelector('input[name="armador"]');
    const agencia = document.querySelector('input[name="agencia"]');
    const proxPuerto = document.getElementById('proxPuerto');

    if (puerto.value === '') {
        alert('Debe seleccionar un puerto.');
        return;
    }

    if (procedenciaCarga.value.trim() === '') {
        alert('Debe ingresar la procedencia de la carga.');
        return;
    }

    if (armador.value.trim() === '') {
        alert('Debe ingresar el armador.');
        return;
    }

    if (agencia.value.trim() === '') {
        alert('Debe ingresar la agencia.');
        return;
    }

    if (proxPuerto.value === '') {
        alert('Debe seleccionar un próximo puerto.');
        return;
    }

    // Validar datos del servicio
    const tipoServicio = document.querySelector('input[name="tipo_servicio"]');
    const bodegasARealizar = document.querySelector('input[name="bodegas_a_realizar"]');
    const bodegasTotales = document.querySelector('input[name="bodegas_totales"]');
    const hospedaje = document.getElementById('hospedaje');
    const lancha = document.getElementById('lancha');
    const grua = document.getElementById('grua');
    const arriendoBomba = document.getElementById('arriendo_bomba');
    const navegacion = document.querySelector('input[name="navegacion"]');

    if (tipoServicio.value.trim() === '') {
        alert('Debe ingresar el tipo de servicio.');
        return;
    }

    const bodegasARealizarValue = parseInt(bodegasARealizar.value);
    const bodegasTotalesValue = parseInt(bodegasTotales.value);

    if (isNaN(bodegasARealizarValue) || bodegasARealizarValue <= 0 || bodegasARealizarValue > bodegasTotalesValue) {
        alert('Las bodegas a realizar deben ser un número entero positivo y menor o igual a las bodegas totales.');
        return;
    }

    if (hospedaje.value === '') {
        alert('Debe seleccionar una opción para hospedaje.');
        return;
    }

    if (lancha.value === '') {
        alert('Debe seleccionar una opción para lancha.');
        return;
    }

    if (grua.value === '') {
        alert('Debe seleccionar una opción para grúa.');
        return;
    }

    if (arriendoBomba.value === '') {
        alert('Debe seleccionar una opción para arriendo de bomba.');
        return;
    }

    if (navegacion.value.trim() === '') {
        alert('Debe ingresar la navegación.');
        return;
    }

    // Si todas las validaciones pasan, envía el formulario
    this.submit();
});