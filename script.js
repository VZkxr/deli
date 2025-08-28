document.addEventListener("DOMContentLoaded", function() {
    const nav = document.querySelector("nav");

    // --- scroll nav ---
    window.addEventListener("scroll", function() {
        if (window.scrollY > 130) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // --- menú hamburguesa ---
    const navHamb = document.getElementById("navHamb");
    const navMenu = document.getElementById("navMenu");
    const links = navMenu.querySelectorAll("a");

    navHamb.addEventListener("click", function() {
        navMenu.classList.toggle("displayMenu");
    });
    links.forEach(link => link.addEventListener("click", () => navMenu.classList.remove("displayMenu")));

    // --- Modal ---
    const modal = document.getElementById("modal-precios");
    const modalTitulo = document.getElementById("modal-titulo");
    const opcionesPrecio = document.getElementById("opciones-precio");
    const cerrarModal = document.getElementById("cerrarModal");
    const modalDescripcion = modal.querySelector("p");

    // --- Productos con tamaños ---
    const preciosConCrema = {
      "Fresas": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Uvas":   { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Durazno":{ "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Manzana":{ "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Zarzamora":{ "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Mango": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Con Yogurth": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
      "Lagrimitas": { "Ch.": 10, "Gr.": 15 },
      "Coffe": { "Ch.": 12, "Gr.": 15 }
    };

    // --- Producto con sabores (De Agua) ---
    const saboresAgua = {
      "Uva": 10,
      "Fresa": 10,
      "Mora Azul": 10,
      "Grosella": 10,
      "Limón": 10
    };

    // --- Productos con precio fijo (sin modal) ---
    const preciosFijos = {
      "Tres Leches de Durazno": 28,
      "Flan Casero de Vainilla": 15,
      "Flan Napolitano": 30,
      "Pay de Limón": 40,
      "Pastel Imposible": 45,
      "Pastel de Chocolate": 45,
      "Pastel de Beso de Angel": 50,
      "Maruchan": 25,
      "Cigarros": 7
    };

    // --- Cerrar modal ---
    cerrarModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    // --- Carrito de compras ---
    let carrito = [];
    const btnEnviar = document.getElementById("btn-enviar");
    const btnCarrito = document.getElementById("btn-carrito");
    const modalCarrito = document.getElementById("modal-carrito");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const cerrarCarrito = document.getElementById("cerrarCarrito");

    function actualizarCarritoUI() {
      listaCarrito.innerHTML = "";
      let total = 0; items = 0;

      carrito.forEach((item, i) => {
        const fila = document.createElement("div");
        fila.className = "item-carrito";

        const texto = document.createElement("span");
        texto.textContent = `${i+1}. ${item.nombre} - $${item.precio} x${item.cantidad}`;

        // Contenedor de acciones (+, -, eliminar)
        const acciones = document.createElement("div");
        acciones.className = "acciones-carrito";

        // Botón restar (-)
        const btnMenos = document.createElement("button");
        btnMenos.textContent = "−";
        btnMenos.className = "btn-menos";
        btnMenos.addEventListener("click", () => {
          if (item.cantidad > 1) {
            item.cantidad--;
          } else {
            carrito.splice(i, 1); // si llega a 0, se elimina
          }
          if (carrito.length === 0) {
            btnEnviar.disabled = true;
            btnCarrito.disabled = true;
            modalCarrito.style.display = "none";
          }
          actualizarCarritoUI();
        });

        // Botón sumar (+)
        const btnMas = document.createElement("button");
        btnMas.textContent = "+";
        btnMas.className = "btn-mas";
        btnMas.addEventListener("click", () => {
          item.cantidad++;
          actualizarCarritoUI();
        });

        // Botón eliminar (ícono de basura)
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.innerHTML = `<img src="img/trash.svg" class="btn-eliminar"/>`;
        btnEliminar.addEventListener("click", () => {
          carrito.splice(i, 1);
          if (carrito.length === 0) {
            btnEnviar.disabled = true;
            btnCarrito.disabled = true;
            modalCarrito.style.display = "none";
          }
          actualizarCarritoUI();
        });

        acciones.appendChild(btnMenos);
        acciones.appendChild(btnMas);
        acciones.appendChild(btnEliminar);

        fila.appendChild(texto);
        fila.appendChild(acciones);
        listaCarrito.appendChild(fila);

        total += item.precio * item.cantidad;
        items += item.cantidad;
      });


      totalCarrito.textContent = `Total: $${total}`;
      // contador del botón
      btnCarrito.textContent = `Ver carrito (${items})`;
    }

    // Sobrescribimos agregarAlCarrito
    function agregarAlCarrito(nombre, precio) {
      const existente = carrito.find(item => item.nombre === nombre && item.precio === precio);
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      // Activar botones
      btnEnviar.disabled = false;
      btnCarrito.disabled = false;

      // Actualizar UI del carrito
      actualizarCarritoUI();

      // Toast
      mostrarToast();
    }

    // --- Botón Ver carrito ---
    btnCarrito.addEventListener("click", () => {
      actualizarCarritoUI();
      modalCarrito.style.display = "flex";
    });

    cerrarCarrito.addEventListener("click", () => {
      modalCarrito.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modalCarrito) modalCarrito.style.display = "none";
    });


    // Generador de número de orden
    function generarOrden() {
      return Math.floor(1000 + Math.random() * 9000); // Ej: 1234
    }

        // --- Mostrar toast "Agregado!" ---
    function mostrarToast() {
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = "¡Agregado!";
      document.body.appendChild(toast);

      // Eliminar después de 1.5s (igual que animación)
      setTimeout(() => {
        toast.remove();
      }, 1500);
    }

    // reemplaza los alert() con agregarAlCarrito()
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const producto = btn.dataset.producto;

        if (preciosConCrema[producto]) {
          modalTitulo.textContent = producto;
          modalDescripcion.textContent = "Elige un tamaño:";
          opcionesPrecio.innerHTML = "";

          Object.entries(preciosConCrema[producto]).forEach(([etiqueta, valor]) => {
            const btnPrecio = document.createElement("button");
            btnPrecio.textContent = `${etiqueta} - $${valor}`;
            btnPrecio.addEventListener("click", () => {
              agregarAlCarrito(`${producto} ${etiqueta}`, valor);
              modal.style.display = "none";
            });
            opcionesPrecio.appendChild(btnPrecio);
          });

          modal.style.display = "flex";
        }

        else if (producto === "Agua") {
          modalTitulo.textContent = "Gelatina de Agua";
          modalDescripcion.textContent = "Elige un sabor:";
          opcionesPrecio.innerHTML = "";

          Object.entries(saboresAgua).forEach(([sabor, precio]) => {
            const btnSabor = document.createElement("button");
            btnSabor.textContent = `${sabor} - $${precio}`;
            btnSabor.addEventListener("click", () => {
              agregarAlCarrito(`Gelatina de ${sabor}`, precio);
              modal.style.display = "none";
            });
            opcionesPrecio.appendChild(btnSabor);
          });

          modal.style.display = "flex";
        }

        else if (preciosFijos[producto]) {
          const precio = preciosFijos[producto];
          agregarAlCarrito(producto, precio);
        }
      });
    });

    // --- Enviar pedido por WhatsApp ---
    btnEnviar.addEventListener("click", () => {
      const numero = "521XXXXXXXXXX"; // número de la tienda
      const orden = generarOrden();

      let mensaje = `Orden #${orden}%0A`;
      let total = 0;

      carrito.forEach((item, i) => {
        let subtotal = item.precio * item.cantidad;
        mensaje += `${i+1}. ${item.nombre} $${item.precio} x${item.cantidad} %0A`;
        total += subtotal;
      });

      mensaje += `----Total: $${total}`;

      const url = `https://wa.me/${numero}?text=${mensaje}`;
      window.open(url, "_blank");
    });
});