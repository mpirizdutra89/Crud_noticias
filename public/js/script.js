const form = document.querySelector("form#formData")
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);


    try {
        const respuesta = await fetch('./nueva-noticia', {
            method: 'POST',
            body: data
            //JSON.stringify(data) cuando se usan archivos ¡sin headers y sin JSON.stringify!// headers: { 'Content-Type': 'application/json' },
        });
        const resultado = await respuesta.json();
        console.log('Respuesta del servidor:', resultado);

        document.querySelector("p#info").innerHTML = resultado.msj



    } catch (error) {
        console.error('Error al enviar el formulario:', error.ok);
        document.querySelector("p#info").innerHTML = error.msj

    }


})





















/* modifica el formualario  para interactuar con el file solo es algo visual, podria estar en otro archivo para tener el codigo mas limpio */
document.addEventListener('DOMContentLoaded', function () {
    const imagenDestacadaInput = document.getElementById('imagenDestacada');
    const nombreArchivoSpan = document.querySelector('.input-file-name');
    const body = document.body;
    let tooltipElement = null;

    imagenDestacadaInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            const fileName = this.files[0].name;
            nombreArchivoSpan.textContent = fileName;
            nombreArchivoSpan.setAttribute('data-full-name', fileName);
        } else {
            nombreArchivoSpan.textContent = 'Ningún archivo seleccionado';
            nombreArchivoSpan.removeAttribute('data-full-name');
        }
    });

    nombreArchivoSpan.addEventListener('mouseover', function (event) {
        const fullName = this.getAttribute('data-full-name');
        if (fullName) {
            tooltipElement = document.createElement('div');
            tooltipElement.classList.add('tooltip-active');
            tooltipElement.textContent = fullName;
            tooltipElement.style.position = 'absolute';
            tooltipElement.style.left = event.clientX + 'px';
            tooltipElement.style.top = event.clientY + 'px';
            body.appendChild(tooltipElement);
        }
    });

    nombreArchivoSpan.addEventListener('mouseout', function () {
        if (tooltipElement) {
            body.removeChild(tooltipElement);
            tooltipElement = null;
        }
    });
});