document.addEventListener('DOMContentLoaded', function () {
    const quimicoSelect = document.getElementById('quimicoSelect');
    const quimicoInfo = document.getElementById('quimicoInfo');

    quimicoSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const fechaIngreso = selectedOption.getAttribute('data-fecha-ingreso');
            const litrosIngreso = selectedOption.getAttribute('data-litros-ingreso');
            const numeroFactura = selectedOption.getAttribute('data-numero-factura');
            const estado = selectedOption.getAttribute('data-estado');

            quimicoInfo.innerHTML = `
        <p class="quimico-info"><strong>Fecha Ingreso:</strong> ${fechaIngreso}</p>
        <p class="quimico-info"><strong>Litros Ingreso:</strong> ${litrosIngreso}</p>
        <p class="quimico-info"><strong>Número Factura:</strong> ${numeroFactura}</p>
        <p class="quimico-info"><strong>Estado:</strong> ${estado}</p>
    `;
        } else {
            quimicoInfo.innerHTML = '';
        }
    });

    const varioSelect = document.getElementById('varioSelect');
    const varioInfo = document.getElementById('varioInfo');

    varioSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            const fechaIngreso = selectedOption.getAttribute('data-fecha-ingreso');
            const estado = selectedOption.getAttribute('data-estado');

            varioInfo.innerHTML = `
        <p class="vario-info"><strong>Fecha Ingreso:</strong> ${fechaIngreso}</p>
        <p class="vario-info"><strong>Estado:</strong> ${estado}</p>
    `;
        } else {
            varioInfo.innerHTML = '';
        }
    });
});