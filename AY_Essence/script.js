
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("mostrar");

    });

}


const CLAVE_CARRITO = "carritoAYEssence";

function obtenerCarrito() {

    const carritoGuardado =
        localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado) {

        return JSON.parse(carritoGuardado);

    }

    return [];

}

function guardarCarrito(carrito) {

    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );

}


const botonesCarrito =
    document.querySelectorAll(".agregar-carrito");


botonesCarrito.forEach((boton) => {

    boton.addEventListener("click", () => {

        const tarjeta =
            boton.closest(".producto");

        const nombre =
            boton.dataset.nombre.trim();

        const precio =
            Number(boton.dataset.precio);

        const imagen =
            tarjeta.querySelector("img").getAttribute("src");

        const categoria =
            tarjeta.dataset.categoria;


        let carrito =
            obtenerCarrito();


        const productoExistente =
            carrito.find(
                producto => producto.nombre === nombre
            );


        if (productoExistente) {

            productoExistente.cantidad++;

        } else {

            carrito.push({

                nombre: nombre,

                precio: precio,

                imagen: imagen,

                categoria: categoria,

                cantidad: 1

            });

        }


        guardarCarrito(carrito);

        actualizarContador();

        boton.textContent = "✓ Agregado";


        setTimeout(() => {

            boton.textContent =
                "Agregar al carrito";

        }, 1200);

    });

});


function actualizarContador() {

    const contador =
        document.getElementById(
            "contador-carrito"
        );


    if (!contador) {

        return;

    }


    const carrito =
        obtenerCarrito();


    const cantidadTotal =
        carrito.reduce(
            (total, producto) =>
                total + producto.cantidad,
            0
        );


    contador.textContent =
        cantidadTotal;

}


function mostrarCarrito() {

    const contenedor =
        document.getElementById(
            "carrito-container"
        );


    if (!contenedor) {

        return;

    }


    const carrito =
        obtenerCarrito();


    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="carrito-vacio">

                <h2>
                    Tu carrito está vacío
                </h2>

                <p>
                    Agrega algunos perfumes
                    desde nuestro catálogo.
                </p>

                <a
                    href="productos.html"
                    class="seguir-comprando">

                    Ver productos

                </a>

            </div>

        `;


        actualizarTotales();

        return;

    }


    contenedor.innerHTML = `

        <div class="carrito-acciones">

            <button
                id="vaciar-carrito"
                class="boton-secundario">

                Vaciar carrito

            </button>

        </div>

    `;


    carrito.forEach((producto, indice) => {

        const subtotal =
            producto.precio *
            producto.cantidad;


        const productoHTML = `

            <article
                class="item-carrito">

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}">

                <div class="info-carrito">

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p>
                        ${producto.categoria === "dama"
                            ? "Dama"
                            : "Caballero"}
                    </p>

                    <strong>
                        C$ ${producto.precio.toFixed(2)}
                    </strong>

                </div>


                <div class="cantidad-carrito">

                    <span>
                        Cantidad
                    </span>

                    <div>

                        <button
                            class="cantidad-btn"
                            data-accion="restar"
                            data-indice="${indice}">

                            −

                        </button>


                        <strong>
                            ${producto.cantidad}
                        </strong>


                        <button
                            class="cantidad-btn"
                            data-accion="sumar"
                            data-indice="${indice}">

                            +

                        </button>

                    </div>

                </div>


                <div class="subtotal-producto">

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        C$ ${subtotal.toFixed(2)}
                    </strong>

                </div>


                <button
                    class="eliminar-producto"
                    data-indice="${indice}">

                    🗑️

                </button>

            </article>

        `;


        contenedor.insertAdjacentHTML(
            "beforeend",
            productoHTML
        );

    });


    const botonVaciar =
        document.getElementById(
            "vaciar-carrito"
        );


    if (botonVaciar) {

        botonVaciar.addEventListener(
            "click",
            () => {

                const confirmar =
                    confirm(
                        "¿Quieres vaciar todo el carrito?"
                    );


                if (!confirmar) {

                    return;

                }


                localStorage.removeItem(
                    CLAVE_CARRITO
                );


                mostrarCarrito();

                actualizarContador();

            }
        );

    }


    const botonesCantidad =
        document.querySelectorAll(
            ".cantidad-btn"
        );


    botonesCantidad.forEach((boton) => {

        boton.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        boton.dataset.indice
                    );

                const accion =
                    boton.dataset.accion;


                let carrito =
                    obtenerCarrito();


                if (accion === "sumar") {

                    carrito[indice].cantidad++;

                }


                if (accion === "restar") {

                    carrito[indice].cantidad--;

                }


                if (
                    carrito[indice].cantidad <= 0
                ) {

                    carrito.splice(
                        indice,
                        1
                    );

                }


                guardarCarrito(carrito);

                mostrarCarrito();

                actualizarContador();

            }
        );

    });


    const botonesEliminar =
        document.querySelectorAll(
            ".eliminar-producto"
        );


    botonesEliminar.forEach((boton) => {

        boton.addEventListener(
            "click",
            () => {

                const indice =
                    Number(
                        boton.dataset.indice
                    );


                let carrito =
                    obtenerCarrito();


                carrito.splice(
                    indice,
                    1
                );


                guardarCarrito(carrito);

                mostrarCarrito();

                actualizarContador();

            }
        );

    });


    actualizarTotales();

}


function actualizarTotales() {

    const subtotalElemento =
        document.getElementById(
            "subtotal"
        );


    const totalElemento =
        document.getElementById(
            "total"
        );


    if (
        !subtotalElemento ||
        !totalElemento
    ) {

        return;

    }


    const carrito =
        obtenerCarrito();


    const subtotal =
        carrito.reduce(
            (total, producto) =>
                total +
                (
                    producto.precio *
                    producto.cantidad
                ),
            0
        );


    subtotalElemento.textContent =
        `C$ ${subtotal.toFixed(2)}`;


    totalElemento.textContent =
        `C$ ${subtotal.toFixed(2)}`;

}

actualizarContador();

mostrarCarrito();


const botonesFiltro =
    document.querySelectorAll(
        ".filtro-btn"
    );


const productos =
    document.querySelectorAll(
        ".producto"
    );


botonesFiltro.forEach((boton) => {

    boton.addEventListener("click", () => {

        const categoria =
            boton.dataset.categoria;


        productos.forEach((producto) => {

            const categoriaProducto =
                producto.dataset.categoria;


            if (
                categoria === "todos" ||
                categoria === categoriaProducto
            ) {

                producto.classList.remove(
                    "oculto"
                );

            } else {

                producto.classList.add(
                    "oculto"
                );

            }

        });

    });

});


const botonesOrden =
    document.querySelectorAll(
        ".orden-btn"
    );


const contenedorProductos =
    document.getElementById(
        "productos-container"
    );


botonesOrden.forEach((boton) => {

    boton.addEventListener("click", () => {

        const orden =
            boton.dataset.orden;


        const productosArray =
            Array.from(productos);


        productosArray.sort((a, b) => {

            const precioA =
                Number(a.dataset.precio);

            const precioB =
                Number(b.dataset.precio);


            if (orden === "menor") {

                return precioA - precioB;

            } else {

                return precioB - precioA;

            }

        });


        productosArray.forEach((producto) => {

            contenedorProductos.appendChild(
                producto
            );

        });

    });

});


const formularioContacto =
    document.getElementById(
        "form-contacto"
    );


if (formularioContacto) {

    formularioContacto.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            alert(
                "¡Gracias por contactarnos! Hemos recibido tu mensaje."
            );


            formularioContacto.reset();

        }
    );

}


const mostrarRegistro =
    document.getElementById(
        "mostrar-registro"
    );


const mostrarLogin =
    document.getElementById(
        "mostrar-login"
    );


const login =
    document.getElementById(
        "login"
    );


const registro =
    document.getElementById(
        "registro"
    );


if (
    mostrarRegistro &&
    login &&
    registro
) {

    mostrarRegistro.addEventListener(
        "click",
        () => {

            login.classList.add(
                "oculto"
            );

            registro.classList.remove(
                "oculto"
            );

        }
    );

}


if (
    mostrarLogin &&
    login &&
    registro
) {

    mostrarLogin.addEventListener(
        "click",
        () => {

            registro.classList.add(
                "oculto"
            );

            login.classList.remove(
                "oculto"
            );

        }
    );

}


const formularioRegistro =
    document.getElementById(
        "form-registro"
    );


if (formularioRegistro) {

    formularioRegistro.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            const password =
                document.getElementById(
                    "password-registro"
                ).value;


            const confirmar =
                document.getElementById(
                    "confirmar-password"
                ).value;


            if (password !== confirmar) {

                alert(
                    "Las contraseñas no coinciden."
                );

                return;

            }


            alert(
                "¡Cuenta creada correctamente!"
            );


            formularioRegistro.reset();

        }
    );

}

const formularioLogin =
    document.getElementById(
        "form-login"
    );


if (formularioLogin) {

    formularioLogin.addEventListener(
        "submit",
        (evento) => {

            evento.preventDefault();


            alert(
                "Inicio de sesión realizado correctamente."
            );

        }
    );

}


const finalizarCompra =
    document.getElementById(
        "finalizar-compra"
    );


if (finalizarCompra) {

    finalizarCompra.addEventListener(
        "click",
        () => {

            const carrito =
                obtenerCarrito();


            if (carrito.length === 0) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            alert(
                "¡Gracias por tu compra en A&Y Essence!"
            );


            localStorage.removeItem(
                CLAVE_CARRITO
            );


            mostrarCarrito();

            actualizarContador();

        }
    );

}

const productosBusqueda = [
    { nombre: "Body Ariana Grande Moonlight", categoria: "Dama", precio: 750, imagen: "img/Ariana Moonlight.jpg", descripcion: "Floral Frutal", palabras: "floral frutal dulce" },
    { nombre: "Body Ariana Grande Thanks U Next", categoria: "Dama", precio: 750, imagen: "img/Ariana Thanks.jpg", descripcion: "Floral Frutal", palabras: "floral frutal dulce" },
    { nombre: "Body Philosophy Lavender", categoria: "Dama", precio: 150, imagen: "img/Philosophy Lavender.jpg", descripcion: "Aromática floral", palabras: "aromatica aromática floral fresco" },
    { nombre: "Body Philosophy Vainilla", categoria: "Dama", precio: 150, imagen: "img/Philosophy Vainilla.jpg", descripcion: "Vainilla", palabras: "vainilla dulce" },
    { nombre: "Body Philosophy 86 Dulce/Brazilian Jasmine", categoria: "Dama", precio: 150, imagen: "img/Philosophy x86.jpg", descripcion: "Floral frutal Gourmand", palabras: "floral frutal gourmand dulce" },
    { nombre: "Body Victoria´s Secret Love Spell Shimmer", categoria: "Dama", precio: 780, imagen: "img/Vs Love Spell Shimmer.jpg", descripcion: "Floral frutal", palabras: "floral frutal dulce" },
    { nombre: "Body Victoria´s Secret Pure Seduction Shimmer", categoria: "Dama", precio: 780, imagen: "img/Vs Pure shimmer.jpg", descripcion: "Floral frutal", palabras: "floral frutal dulce" },
    { nombre: "Body Victoria´s Secret Vainilla Shimmer", categoria: "Dama", precio: 780, imagen: "img/Vs vainilla Shimmer.jpg", descripcion: "Vainilla", palabras: "vainilla dulce" },
    { nombre: "Body Victoria´s Secret Pure Seduction", categoria: "Dama", precio: 780, imagen: "img/Vs Pure.jpg", descripcion: "Floral frutal", palabras: "floral frutal dulce" },
    { nombre: "Body Victoria´s Secret Velvet Petals Vacation", categoria: "Dama", precio: 780, imagen: "img/Vs velvet.jpg", descripcion: "Floral frutal cálida", palabras: "floral frutal calida cálida dulce intenso" },
    { nombre: "Body Club de Nuit", categoria: "Caballero", precio: 550, imagen: "img/Club de nuit.jpg", descripcion: "Amaderada especiada", palabras: "amaderada especiada intenso" },
    { nombre: "Body Odyssey Eau De Montagne", categoria: "Caballero", precio: 550, imagen: "img/Odsyssey EAU.jpg", descripcion: "Oriental vainilla", palabras: "oriental vainilla dulce intenso" },
    { nombre: "Body Odyssey Homme (For men)", categoria: "Caballero", precio: 550, imagen: "img/Odyssey For men.jpg", descripcion: "Vainilla oscura, cálida y especiada", palabras: "vainilla oscura calida cálida especiada dulce intenso" },
    { nombre: "Body Odyssey Go Mango", categoria: "Caballero", precio: 550, imagen: "img/Odyssey Go.jpg", descripcion: "Tropical", palabras: "tropical fresco dulce" },
    { nombre: "Body Odyssey Revolution", categoria: "Caballero", precio: 550, imagen: "img/Odyssey Revolution.jpg", descripcion: "Aromática frutal", palabras: "aromatica aromática frutal fresco" },
    { nombre: "Body Odyssey Spectra", categoria: "Caballero", precio: 550, imagen: "img/Odyssey Spectra.jpg", descripcion: "Oriental especiada", palabras: "oriental especiada intenso" },
    { nombre: "Body Odyssey Homme (White Edition)", categoria: "Caballero", precio: 550, imagen: "img/Odyssey white.jpg", descripcion: "Dulzura moderna", palabras: "dulzura dulce moderno" }
];

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\\u0300-\\u036f]/g, "")
        .trim();
}

function mostrarResultadosBusqueda(termino) {
    const contenedor = document.getElementById("resultados-busqueda");

    if (!contenedor) return;

    const busqueda = normalizarTexto(termino);

    if (!busqueda) {
        contenedor.innerHTML = "<p class=\"mensaje-busqueda\">Escribe el nombre de un perfume o una característica, por ejemplo: floral, dulce, fresco o intenso.</p>";
        return;
    }

    const resultados = productosBusqueda.filter(producto => {
        const textoProducto = normalizarTexto(
            `${producto.nombre} ${producto.categoria} ${producto.descripcion} ${producto.palabras}`
        );
        return textoProducto.includes(busqueda);
    });

    if (resultados.length === 0) {
        contenedor.innerHTML = `<p class="mensaje-busqueda">No encontramos perfumes para “${termino}”. Prueba con otro nombre o característica.</p>`;
        return;
    }

    contenedor.innerHTML = resultados.map(producto => `
        <article class="resultado-card">
            <img src="${producto.imagen}" alt="${producto.descripcion}">
            <div class="resultado-info">
                <h3>${producto.nombre}</h3>
                <p class="categoria">${producto.categoria}</p>
                <p>${producto.descripcion}</p>
                <p class="precio">C$ ${producto.precio}</p>
                <button class="agregar-carrito resultado-carrito"
                        data-nombre="${producto.nombre}"
                        data-precio="${producto.precio}">
                    Agregar al carrito
                </button>
            </div>
        </article>
    `).join("");

    contenedor.querySelectorAll(".resultado-carrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);
            const productoExistente = carrito.find(producto => producto.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({ nombre, precio, cantidad: 1 });
            }

            actualizarContador();
            boton.textContent = "✓ Agregado";
            setTimeout(() => boton.textContent = "Agregar al carrito", 1200);
        });
    });
}

const campoBusqueda = document.getElementById("campo-busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const etiquetasBusqueda = document.querySelectorAll(".busqueda-tag");

if (campoBusqueda && botonBuscar) {
    botonBuscar.addEventListener("click", () => {
        mostrarResultadosBusqueda(campoBusqueda.value);
    });

    campoBusqueda.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter") {
            evento.preventDefault();
            mostrarResultadosBusqueda(campoBusqueda.value);
        }
    });

    etiquetasBusqueda.forEach(etiqueta => {
        etiqueta.addEventListener("click", () => {
            campoBusqueda.value = etiqueta.textContent.trim();
            mostrarResultadosBusqueda(campoBusqueda.value);
        });
    });
}
