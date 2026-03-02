const modal = document.getElementById("modalCheckout");
const form = document.getElementById("formCheckout");
const botonFinalizar = document.getElementById("finalizarCompra");
const botonCancelar = document.getElementById("cancelarCheckout");

botonFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
        Swal.fire("El carrito está vacío");
        return;
    }
    modal.classList.remove("hidden");
});

botonCancelar.addEventListener("click", () => {
    modal.classList.add("hidden");
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!nombre || !direccion || !telefono || !email) {
        Swal.fire("Todos los campos son obligatorios");
        return;
    }

    if (!/^\d+$/.test(telefono)) {
        Swal.fire("El teléfono debe contener solo números");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        Swal.fire("Email inválido");
        return;
    }

    const numeroOrden = Math.floor(Math.random() * 1000000);
    const fecha = new Date().toLocaleDateString("es-AR");

    let resumen = carrito.map(p =>
        `${p.nombre} x${p.cantidad}`
    ).join("<br>");

    Swal.fire({
        icon: "success",
        title: "Compra realizada",
        html: `
            <p><strong>Orden:</strong> ${numeroOrden}</p>
            <p><strong>Fecha:</strong> ${fecha}</p>
            <p><strong>Cliente:</strong> ${nombre}</p>
            <hr>
            ${resumen}
            <hr>
            <p><strong>Total: $${totalElemento.textContent}</strong></p>
        `
    });

    carrito = [];
    guardarCarrito();
    mostrarCarrito();
    calcularTotal();
    modal.classList.add("hidden");
    form.reset();
});