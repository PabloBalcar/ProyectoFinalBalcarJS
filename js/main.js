let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productos = [];

const contenedorProductos = document.getElementById("contenedorProductos");
const contenedorCarrito = document.getElementById("contenedorCarrito");
const botonVaciar = document.getElementById("vaciarCarrito");
const botonFinalizar = document.getElementById("finalizarCompra");
const totalElemento = document.getElementById("total");



async function cargarProductos() {
    try {
        const response = await fetch("./data/productos.json");

        if (!response.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        productos = await response.json();
        mostrarProductos();
        mostrarCarrito();
        calcularTotal();

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema cargando los productos"
        });
    }
}



function mostrarProductos() {

    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");

        div.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio.toLocaleString("es-AR")}</p>
            <button onclick="agregarAlCarrito(${producto.id})">
                Agregar al carrito
            </button>
        `;

        contenedorProductos.appendChild(div);
    });
}


function agregarAlCarrito(id) {

    const productoExistente = carrito.find(p => p.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        const producto = productos.find(p => p.id === id);
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito();

    Toastify({
        text: "Producto agregado al carrito",
        duration: 2000,
        gravity: "top",
        position: "right"
    }).showToast();

    mostrarCarrito();
    calcularTotal();
}


function mostrarCarrito() {

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío </p>";
        return;
    }

    carrito.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("itemCarrito");

        div.innerHTML = `
            <p>
                ${producto.nombre} x${producto.cantidad} 
                - $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}
            </p>
            <button onclick="eliminarDelCarrito(${producto.id})">
                Eliminar
            </button>
        `;

        contenedorCarrito.appendChild(div);
    });
}



function eliminarDelCarrito(id) {

    carrito = carrito.filter(producto => producto.id !== id);

    guardarCarrito();
    mostrarCarrito();
    calcularTotal();
}



function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

botonVaciar.addEventListener("click", function () {

    Swal.fire({
        title: "¿Vaciar carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar"
    }).then((result) => {

        if (result.isConfirmed) {
            carrito = [];
            guardarCarrito();
            mostrarCarrito();
            calcularTotal();

            Swal.fire("Carrito vaciado");
        }

    });
});


function calcularTotal() {

    const total = carrito.reduce(
        (acumulador, producto) => acumulador + (producto.precio * producto.cantidad),
        0
    );

    totalElemento.textContent = total.toLocaleString("es-AR");
}


function procesarCompra() {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve("Compra realizada con éxito ");
        }, 2000);

    });
}



async function finalizarCompra() {

    if (carrito.length === 0) {
        Swal.fire("El carrito está vacío");
        return;
    }

    try {

        Swal.fire({
            title: "Procesando compra...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const resultado = await procesarCompra();

        Swal.fire({
            icon: "success",
            title: resultado
        });

        carrito = [];
        guardarCarrito();
        mostrarCarrito();
        calcularTotal();

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Error en la compra"
        });

    }
}



botonFinalizar.addEventListener("click", finalizarCompra);


cargarProductos();