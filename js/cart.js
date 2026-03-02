let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorCarrito = document.getElementById("contenedorCarrito");
const totalElemento = document.getElementById("total");
const botonVaciar = document.getElementById("vaciarCarrito");

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
    mostrarCarrito();
    calcularTotal();

    Toastify({
        text: "Producto agregado",
        duration: 2000,
        gravity: "top",
        position: "right"
    }).showToast();
}

function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Tu carrito está vacío</p>";
        return;
    }

    carrito.forEach(producto => {
        const div = document.createElement("div");

        div.innerHTML = `
            ${producto.nombre} x${producto.cantidad} - 
            $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}
        `;

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarDelCarrito(producto.id));

        div.appendChild(botonEliminar);
        contenedorCarrito.appendChild(div);
    });
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(p => p.id !== id);
    guardarCarrito();
    mostrarCarrito();
    calcularTotal();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function calcularTotal() {
    const total = carrito.reduce(
        (acc, producto) => acc + producto.precio * producto.cantidad,
        0
    );
    totalElemento.textContent = total.toLocaleString("es-AR");
}

botonVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    calcularTotal();
});

mostrarCarrito();
calcularTotal();