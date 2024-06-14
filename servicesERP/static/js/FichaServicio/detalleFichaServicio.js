async function generatePDF() {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF('p', 'pt', 'a4')

    const element = document.getElementById('imprimirContenido')
    if (!element) {
        console.error('Element with id "contenidoPrincipal" not found')
        return
    }

    // Ocultar el elemento con la clase 'arrow-down' antes de capturar el contenido
    const arrowDownElement = document.querySelector('.arrow-down')
    if (arrowDownElement) {
        arrowDownElement.style.display = 'none'
    }

    const canvas = await html2canvas(element, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')

    // Restaurar la visibilidad del elemento después de capturar el contenido
    if (arrowDownElement) {
        arrowDownElement.style.display = ''
    }

    const imgProps = doc.getImageProperties(imgData)
    const pdfWidth = doc.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    // Ajustar el tamaño de la página del PDF según la altura del contenido
    doc.internal.pageSize.setHeight(pdfHeight)

    doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    const fichaServicioElement = document.getElementById('fichaServicio')
    if (!fichaServicioElement) {
        console.error('Element with id "fichaServicio" not found')
        return
    }

    const fichaId = fichaServicioElement.getAttribute('data-id')
    if (!fichaId) {
        console.error('Attribute "data-id" not found on element with id "fichaServicio"')
        return
    }

    const nombreMotonaveElement = document.getElementById('nombre_mn')
    if (!nombreMotonaveElement) {
        console.error('Element with id "nombre_mn" not found')
        return
    }

    const nombreMotonave = nombreMotonaveElement.value

    const fileName = `detalleFichaServicio_${nombreMotonave}_${fichaId}.pdf`

    doc.save(fileName)
}