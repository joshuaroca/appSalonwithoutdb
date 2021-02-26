let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //Resalta el div Actal segun el tab seleccionado
    mostrarSeccion();

    // Oculta o muestra una sección segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita ( o mensaje de error en caso de no pasar la validación )
    mostrarResumen();


    // Almacena el nombre de la cita en el objeto
    nombreCita();


    // Almacena la fecha de la cita en el objeto
    fechaCita();


    // deshabilita dias pasados
    deshabilitarFechaAnterior();
    // Almacena la hora de la cita en el objeto
    horaCita();
}


function cambiarSeccion() {
    const enlaces = document.querySelectorAll(".tabs button");

    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);


            mostrarSeccion();
            botonesPaginador()
        })
    })
}

function mostrarSeccion() {
    //Eliminar mostrar-seccion de la seccion anterior

    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');

    }
    //eliminar la clase de actual del tab anterior
    const tabAnterior = document.querySelector('.tabs button.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');

    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion')

    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}


async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        // Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            // DOM Scripting
            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            // Generar el precio del servicio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            // Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo en el HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        console.log(error);
    }
}


function seleccionarServicio(e) {

    let elemento;
    // Forzar que el  elemento al cual le damos click sea el DIV 
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextSibling.textContent
        }
        elemento.classList.add('seleccionado');
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter((servicio) => servicio.id !== id);//interesante
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];
}






function paginaSiguiente() {
    const paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener('click', (e) => {
        pagina++;
        botonesPaginador()
    })
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener('click', (e) => {
        pagina--;
        botonesPaginador()
    })
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector("#anterior");
    const paginaSiguiente = document.querySelector("#siguiente");

    if (pagina === 1) {
        paginaAnterior.classList.add("ocultar");
        paginaSiguiente.classList.remove('ocultar');

    } else if (pagina === 3) {
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        mostrarResumen();//estamos en la pag 3, cargar el resumen
    } else {
        paginaAnterior.classList.remove("ocultar");
        paginaSiguiente.classList.remove("ocultar");
    }
    mostrarSeccion();

}

const mostrarResumen = () => {
    //destructuring
    const { nombre, fecha, hora, servicios } = cita;

    //seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el contenido del html del resumen
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild)
    }


    //validacion del objecto
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = "Faltan datos de servicios, hora, fecha, o nombre";
        noServicios.classList.add('invalidar-cita')
        resumenDiv.appendChild(noServicios);
    } else {
        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios')

        const headingCita = document.createElement('H3');
        headingCita.textContent = 'Resumen de cita';

        //mostrar el resumen
        const nombreCita = document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

        const fechaCita = document.createElement('P');
        fechaCita.innerHTML = `<span>Precio:</span> ${fecha}`;

        const horaCita = document.createElement('P');
        horaCita.innerHTML = `<span>Hora cita:</span> ${hora}`;

        const headingServicios = document.createElement('H3');
        headingServicios.textContent = 'Resumen de servicios';

        serviciosCita.appendChild(headingServicios);

        let cantidad = 0;

        //iterar sobre el arreglo de servicios
        servicios.forEach((servicio) => {
            const { nombre, precio } = servicio;
            const contenedorServicio = document.createElement("DIV");
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio = document.createElement('P');
            textoServicio.textContent = nombre;


            const precioServicio = document.createElement('P');
            precioServicio.textContent = precio;
            precioServicio.classList.add('precio')

            const totalServicio = precio.split("$")
            cantidad += parseInt(totalServicio[1].trim());
            //colocar texto y precio en el div
            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);

            serviciosCita.appendChild(contenedorServicio);

        })

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement('P');
        cantidadPagar.classList.add('total')
        cantidadPagar.innerHTML = `<span>Total a pagar: </span> $${cantidad}`;
        resumenDiv.appendChild(cantidadPagar);

    }
}





function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', (e) => {
        const nombreTexto = e.target.value.trim();

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta("nombre no valido", 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    })
}

function mostrarAlerta(mensaje, tipo) {

    //si hay una alerta, no crear otra 
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error')
    }

    //insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);


    //  eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', (e) => {
        const dia = new Date(e.target.value).getUTCDay();
        if ([0].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('El Domingo no es un dia permitido', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
        console.log(cita
        )
    })
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector("#fecha");
    const fechaActual = new Date(),
        year = fechaActual.getFullYear();
    let mes = (fechaActual.getMonth() + 1).toString(),
        dia = (fechaActual.getDate() + 1).toString();

    //Formato: AAAA-MM-DD
    mes.length < 2 ? mes = '0' + mes : mes;
    dia.length < 2 ? dia = '0' + dia : dia;
    const fechaDeshabilitar = [year, mes, dia].join('-');

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if (hora[0] < 8 || hora[0] > 20) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 2000);
        } else {
            cita.hora = horaCita
        }
    })
}