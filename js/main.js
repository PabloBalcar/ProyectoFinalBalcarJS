let productos = [];

const contenedorProductos = document.getElementById("contenedorProductos");

async function cargarProductos() {
    try {
        const response = await fetch("./data/productos.json");

        if (!response.ok) {
            throw new Error("Error al cargar productos");
        }

        productos = await response.json();
        mostrarProductos();

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudieron cargar los productos"
        });
    }
}

function mostrarProductos() {
    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");

        const img = document.createElement("img");
        img.src = producto.imagen;
        img.alt = producto.nombre;

        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = `Precio: $${producto.precio.toLocaleString("es-AR")}`;

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";
        boton.addEventListener("click", () => agregarAlCarrito(producto.id));

        div.appendChild(img);
        div.appendChild(titulo);
        div.appendChild(precio);
        div.appendChild(boton);

        contenedorProductos.appendChild(div);
    });
}

cargarProductos();