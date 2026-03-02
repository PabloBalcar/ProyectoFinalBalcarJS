const modal = document.getElementById("modalCheckout");
const form = document.getElementById("formCheckout");
const botonFinalizar = document.getElementById("finalizarCompra");
const botonCancelar = document.getElementById("cancelarCheckout");

const metodoPago = document.getElementById("metodoPago");
const datosTarjeta = document.getElementById("datosTarjeta");
const cuotas = document.getElementById("cuotas");

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

metodoPago.addEventListener("change", () => {
    if (metodoPago.value === "tarjeta" || metodoPago.value === "debito") {
        datosTarjeta.classList.remove("hidden");
    } else {
        datosTarjeta.classList.add("hidden");
    }

    if (metodoPago.value === "tarjeta") {
        cuotas.classList.remove("hidden");
    } else {
        cuotas.classList.add("hidden");
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const email = document.getElementById("email").value.trim();
    const envio = parseInt(document.getElementById("envio").value);
    const codigo = document.getElementById("codigoDescuento").value.trim();

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

    if (metodoPago.value === "") {
        Swal.fire("Seleccioná un método de pago");
        return;
    }

    if (metodoPago.value === "tarjeta" || metodoPago.value === "debito") {
        const numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (!/^\d{16}$/.test(numeroTarjeta)) {
            Swal.fire("La tarjeta debe tener 16 números");
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            Swal.fire("El CVV debe tener 3 números");
            return;
        }
    }

    let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    total += envio;

    if (codigo === "DESCUENTO10") {
        total *= 0.9;
    }

    if (metodoPago.value === "tarjeta") {
        if (cuotas.value === "3") total *= 1.10;
        if (cuotas.value === "6") total *= 1.20;
    }

    const numeroOrden = "ORD-" + Date.now();
    const fecha = new Date().toLocaleString("es-AR");

    Swal.fire({
        title: "Procesando pago...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    setTimeout(() => {

        const orden = {
            numeroOrden,
            cliente: nombre,
            direccion,
            metodoPago: metodoPago.value,
            productos: carrito,
            total,
            fecha
        };

        localStorage.setItem("ultimaOrden", JSON.stringify(orden));

        Swal.fire({
            icon: "success",
            title: "Compra realizada",
            html: `
                <p><strong>Orden:</strong> ${numeroOrden}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <p><strong>Total:</strong> $${total.toLocaleString("es-AR")}</p>
            `
        });

        carrito = [];
        guardarCarrito();
        mostrarCarrito();
        calcularTotal();

        modal.classList.add("hidden");
        form.reset();

    }, 2000);
});