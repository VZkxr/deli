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

    // --- Lógica de botones ---
    document.querySelectorAll(".btn-agregar").forEach(btn => {
      btn.addEventListener("click", () => {
        const producto = btn.dataset.producto;

        // --- Productos con precios múltiples ---
        if (preciosConCrema[producto]) {
          modalTitulo.textContent = producto;
          modalDescripcion.textContent = "Elige un tamaño:";
          opcionesPrecio.innerHTML = "";

          Object.entries(preciosConCrema[producto]).forEach(([etiqueta, valor]) => {
            const btnPrecio = document.createElement("button");
            btnPrecio.textContent = `${etiqueta} - $${valor}`;
            btnPrecio.addEventListener("click", () => {
              alert(`Agregado: ${producto} (${etiqueta}) - $${valor}`);
              modal.style.display = "none";
            });
            opcionesPrecio.appendChild(btnPrecio);
          });

          modal.style.display = "flex";
        }

        // --- Producto De Agua con SABORES ---
        else if (producto === "Agua") {
          modalTitulo.textContent = "Gelatina de Agua";
          modalDescripcion.textContent = "Elige un sabor:";
          opcionesPrecio.innerHTML = "";

          Object.entries(saboresAgua).forEach(([sabor, precio]) => {
            const btnSabor = document.createElement("button");
            btnSabor.textContent = `${sabor} - $${precio}`;
            btnSabor.addEventListener("click", () => {
              alert(`Agregado: Gelatina de Agua (${sabor}) - $${precio}`);
              modal.style.display = "none";
            });
            opcionesPrecio.appendChild(btnSabor);
          });

          modal.style.display = "flex";
        }

        // --- Productos con precio fijo ---
        else if (preciosFijos[producto]) {
          const precio = preciosFijos[producto];
          alert(`Agregado: ${producto} - $${precio}`);
        }
      });
    });

    // --- Cerrar modal ---
    cerrarModal.addEventListener("click", () => modal.style.display = "none");
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
});