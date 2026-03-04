document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");

  // --- scroll nav ---
  window.addEventListener("scroll", function () {
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

  navHamb.addEventListener("click", function () {
    navMenu.classList.toggle("displayMenu");
  });
  links.forEach(link => link.addEventListener("click", () => navMenu.classList.remove("displayMenu")));

  // --- Modal ---
  const modal = document.getElementById("modal-precios");
  const modalTitulo = document.getElementById("modal-titulo");
  const opcionesPrecio = document.getElementById("opciones-precio");
  const cerrarModal = document.getElementById("cerrarModal");
  const modalDescripcion = modal.querySelector("p");
  // --- Modal de Charola (carrusel) ---
  const modalCharola = document.getElementById("modal-charola");
  const btnCharola = document.querySelector(".btn-charola");
  const cerrarCharola = document.getElementById("cerrarCharola");

  // pasos
  const pasoFrutas = document.getElementById("paso-frutas");
  const pasoTopping = document.getElementById("paso-topping");

  // formularios
  const formFrutas = document.getElementById("form-charola-frutas");
  const formTopping = document.getElementById("form-charola-topping");

  // botones
  const btnSiguienteFrutas = document.getElementById("btn-siguiente-frutas");
  const btnAddCharola = document.getElementById("btn-add-charola");

  // error
  const errorFrutas = document.getElementById("error-charola-frutas");

  let frutasSeleccionadas = [];

  // abrir modal
  btnCharola.addEventListener("click", () => {
    modalCharola.style.display = "flex";
    // resetear pasos
    pasoFrutas.style.display = "block";
    pasoTopping.style.display = "none";
    formFrutas.reset();
    formTopping.reset();
    btnSiguienteFrutas.classList.add("btn-disabled");
    errorFrutas.style.display = "none";
    btnAddCharola.textContent = "Añadir - $45"; // reset precio base
  });

  // cerrar modal
  cerrarCharola.addEventListener("click", () => modalCharola.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modalCharola) modalCharola.style.display = "none";
  });

  // habilitar botón siguiente cuando hay 3 frutas
  formFrutas.addEventListener("change", () => {
    const seleccionadas = formFrutas.querySelectorAll("input[name='fruta']:checked");
    if (seleccionadas.length === 3) {
      btnSiguienteFrutas.classList.remove("btn-disabled");
      errorFrutas.style.display = "none";
    } else {
      btnSiguienteFrutas.classList.add("btn-disabled");
    }
  });

  // ir al paso de toppings
  btnSiguienteFrutas.addEventListener("click", () => {
    frutasSeleccionadas = Array.from(
      formFrutas.querySelectorAll("input[name='fruta']:checked")
    ).map(input => input.value);

    if (frutasSeleccionadas.length !== 3) {
      errorFrutas.style.display = "block";
      return;
    }

    pasoFrutas.style.display = "none";
    pasoTopping.style.display = "block";
  });

  // actualizar precio dinámicamente al seleccionar toppings
  formTopping.addEventListener("change", (e) => {
    const checkNinguno = formTopping.querySelector("input[value='Ninguno']");

    if (e.target.value === "Ninguno" && e.target.checked) {
      // Si selecciona "Ninguno", desmarcar todos los demás
      formTopping.querySelectorAll("input[name='topping']").forEach(input => {
        if (input.value !== "Ninguno") input.checked = false;
      });
    } else if (e.target.value !== "Ninguno" && e.target.checked) {
      // Si selecciona otro, desmarcar "Ninguno"
      checkNinguno.checked = false;
    }

    // Calcular precio
    const seleccionados = Array.from(
      formTopping.querySelectorAll("input[name='topping']:checked")
    ).filter(input => input.value !== "Ninguno").length;

    let precio = 45;
    if (seleccionados > 1) {
      precio += (seleccionados - 1) * 2; // cobra a partir del 2do
    }

    btnAddCharola.textContent = `Añadir - $${precio}`;
  });

  const modalRebanadas = document.getElementById("modal-rebanadas");
  const cerrarRebanadas = document.getElementById("cerrarRebanadas");
  const tituloRebanadas = document.getElementById("titulo-rebanadas");
  const btnLecheraSi = document.getElementById("btn-lechera-si");
  const btnLecheraNo = document.getElementById("btn-lechera-no");

  let productoRebanada = null;
  let precioRebanada = 0;

  // --- Modal Con Crema (En vaso) ---
  const modalVaso = document.getElementById("modal-vaso");
  const cerrarVaso = document.getElementById("cerrarVaso");

  // pasos
  const pasoTamano = document.getElementById("paso-tamano");
  const pasoToppingVaso = document.getElementById("paso-topping-vaso");

  // formularios
  const formTamano = document.getElementById("form-vaso-tamano");
  const formToppingVaso = document.getElementById("form-vaso-topping");

  // botones
  const btnSiguienteTamano = document.getElementById("btn-siguiente-tamano");
  const btnAddVaso = document.getElementById("btn-add-vaso");

  // textos dinámicos
  const tituloVaso = document.getElementById("titulo-vaso");
  const errorTamano = document.getElementById("error-vaso-tamano");

  let productoSeleccionado = null;
  let precioBase = 0;
  let tipoVasoSeleccionado = null;

  // Abrir modal de vaso (con crema o vellana)
  document.querySelectorAll(".btn-agregar[data-tipo='vaso'], .btn-agregar[data-tipo='vellana']")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        productoSeleccionado = btn.dataset.producto;
        const tipo = btn.dataset.tipo || 'vaso';
        tipoVasoSeleccionado = tipo; // <-- guardamos el origen (vaso o vellana)
        tituloVaso.textContent = productoSeleccionado;

        // Reset
        pasoTamano.style.display = "block";
        pasoToppingVaso.style.display = "none";
        formTamano.innerHTML = "";
        formToppingVaso.reset();
        btnSiguienteTamano.classList.add("btn-disabled");
        btnAddVaso.textContent = "Añadir";

        // Cargar precios según tipo
        const listaPrecios = (tipo === "vellana") ? preciosVellana : preciosConCrema;

        if (listaPrecios[productoSeleccionado]) {
          Object.entries(listaPrecios[productoSeleccionado]).forEach(([tam, precio]) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="tamano" value="${tam}" data-precio="${precio}"> ${tam} - $${precio}`;
            formTamano.appendChild(label);
          });
        }

        modalVaso.style.display = "flex";
      });
    });


  // cerrar modal
  cerrarVaso.addEventListener("click", () => {
    modalVaso.style.display = "none";
    tipoVasoSeleccionado = null;
  });
  window.addEventListener("click", (e) => {
    if (e.target === modalVaso) {
      modalVaso.style.display = "none";
      tipoVasoSeleccionado = null;
    }
  });

  formTamano.addEventListener("change", () => {
    const seleccionado = formTamano.querySelector("input[name='tamano']:checked");
    if (seleccionado) {
      btnSiguienteTamano.classList.remove("btn-disabled");
      errorTamano.style.display = "none";
    }
  });

  // ir a paso toppings
  btnSiguienteTamano.addEventListener("click", () => {
    const seleccionado = formTamano.querySelector("input[name='tamano']:checked");
    if (!seleccionado) {
      errorTamano.style.display = "block";
      return;
    }
    precioBase = parseInt(seleccionado.dataset.precio);

    pasoTamano.style.display = "none";
    pasoToppingVaso.style.display = "block";

    btnAddVaso.textContent = `Añadir - $${precioBase}`;
  });

  // lógica de "Ninguno" + precio dinámico
  formToppingVaso.addEventListener("change", (e) => {
    const checkNinguno = formToppingVaso.querySelector("input[value='Ninguno']");

    if (e.target.value === "Ninguno" && e.target.checked) {
      formToppingVaso.querySelectorAll("input[name='topping']").forEach(input => {
        if (input.value !== "Ninguno") input.checked = false;
      });
    } else if (e.target.value !== "Ninguno" && e.target.checked) {
      checkNinguno.checked = false;
    }

    const seleccionados = Array.from(
      formToppingVaso.querySelectorAll("input[name='topping']:checked")
    ).filter(input => input.value !== "Ninguno").length;

    let precio = precioBase;
    if (seleccionados > 1) {
      precio += (seleccionados - 1) * 2;
    }
    btnAddVaso.textContent = `Añadir - $${precio}`;
  });

  // añadir al carrito
  btnAddVaso.addEventListener("click", () => {
    const tamSeleccionado = formTamano.querySelector("input[name='tamano']:checked");
    if (!tamSeleccionado) {
      errorTamano.style.display = "block";
      return;
    }

    const toppingsSeleccionados = Array.from(
      formToppingVaso.querySelectorAll("input[name='topping']:checked")
    ).map(input => input.value);

    const toppingsFinal = toppingsSeleccionados.length > 0 ? toppingsSeleccionados : ["Ninguno"];
    const toppingsValidos = toppingsSeleccionados.filter(t => t !== "Ninguno");

    let precio = precioBase;
    if (toppingsValidos.length > 1) {
      precio += (toppingsValidos.length - 1) * 2;
    }

    // detectar si el modal actual fue abierto desde la sección "vellana"
    const esVellana = tipoVasoSeleccionado === 'vellana';

    const nombre = `${productoSeleccionado} ${tamSeleccionado.value} + Toppings: ${toppingsFinal.join(", ")}`;
    agregarAlCarrito(nombre, precio, esVellana);

    // cerrar y resetear
    modalVaso.style.display = "none";
    tipoVasoSeleccionado = null;
  });

  // añadir al carrito
  btnAddCharola.addEventListener("click", () => {
    const toppingsSeleccionados = Array.from(
      formTopping.querySelectorAll("input[name='topping']:checked")
    ).map(input => input.value);

    const toppingsFinal = toppingsSeleccionados.length > 0 ? toppingsSeleccionados : ["Ninguno"];

    // excluir "Ninguno" del cálculo
    const toppingsValidos = toppingsSeleccionados.filter(t => t !== "Ninguno");

    let precio = 45;
    if (toppingsValidos.length > 1) {
      precio += (toppingsValidos.length - 1) * 2;
    }

    const nombre = `Charola (${frutasSeleccionadas.join(", ")}) + Toppings: ${toppingsFinal.join(", ")}`;
    agregarAlCarrito(nombre, precio);

    modalCharola.style.display = "none";
  });

  // --- Productos con tamaños ---
  const preciosConCrema = {
    "Fresas": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Uvas": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Durazno": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Manzana": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Zarzamora": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Con Yogurth": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
    "Lagrimitas": { "Ch.": 10, "Gr.": 15 },
    "Coffe": { "Ch.": 12, "Gr.": 15 },
    "Arroz con Leche": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
  };

  const preciosVellana = {
    "Fresas": { "Ch.": 45, "Med.": 55, "Tazón": 70, "Gr.": 90 },
    "Durazno": { "Ch.": 45, "Med.": 55, "Tazón": 70, "Gr.": 90 },
    "Uvas": { "Ch.": 45, "Med.": 55, "Tazón": 70, "Gr.": 90 },
    "Manzana": { "Ch.": 45, "Med.": 55, "Tazón": 70, "Gr.": 90 },
    "Zarzamora": { "Ch.": 45, "Med.": 55, "Tazón": 70, "Gr.": 90 },
  }

  // --- Precios Fruta Loca ---
  const preciosFrutaLoca = {
    "Ch.": 30,
    "Med.": 35,
    "Gr.": 45,
    "Tazón": 60
  };

  // --- Modal Fruta Loca ---
  const modalFrutaLoca = document.getElementById("modal-fruta-loca");
  const cerrarFrutaLoca = document.getElementById("cerrarFrutaLoca");
  const tituloFL = document.getElementById("titulo-fl");

  // Pasos
  const pasoFLTamano = document.getElementById("paso-fl-tamano");
  const pasoFLMiguelito = document.getElementById("paso-fl-miguelito");
  const pasoFLGomitas = document.getElementById("paso-fl-gomitas");

  // Formularios
  const formFLTamano = document.getElementById("form-fl-tamano");
  const formFLMiguelito = document.getElementById("form-fl-miguelito");
  const formFLGomitas = document.getElementById("form-fl-gomitas");

  // Botones
  const btnNextFLTamano = document.getElementById("btn-next-fl-tamano");
  const btnNextFLMiguelito = document.getElementById("btn-next-fl-miguelito");
  const btnAddFL = document.getElementById("btn-add-fl");

  // Errores
  const errorFLTamano = document.getElementById("error-fl-tamano");
  const errorFLMiguelito = document.getElementById("error-fl-miguelito");

  let productoFLSeleccionado = null;
  let precioFLBase = 0;
  let tamanoFLSeleccionado = null;

  // Abrir modal Fruta Loca (Varios tipos)
  document.querySelectorAll(".btn-agregar[data-tipo='fruta-loca'], .btn-agregar[data-tipo='charola-loca']").forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.tipo;
      productoFLSeleccionado = btn.dataset.producto;
      tituloFL.textContent = (tipo === 'charola-loca') ? "Charola Loca" : `Fruta Loca: ${productoFLSeleccionado}`;

      // Reset UI
      formFLTamano.innerHTML = "";
      formFLMiguelito.reset();
      formFLGomitas.reset();
      btnNextFLTamano.classList.add("btn-disabled");
      btnNextFLMiguelito.classList.add("btn-disabled");
      btnAddFL.textContent = "Añadir";
      errorFLTamano.style.display = "none";
      errorFLMiguelito.style.display = "none";

      modalFrutaLoca.style.display = "flex";

      if (tipo === 'charola-loca') {
        // Caso especial: Charola Loca (Salta paso 1)
        tamanoFLSeleccionado = "Charola";
        precioFLBase = 40;

        pasoFLTamano.style.display = "none";
        pasoFLMiguelito.style.display = "block"; // Inicia en paso 2
        pasoFLGomitas.style.display = "none";
      } else {
        // Caso normal: Fruta Loca
        pasoFLTamano.style.display = "block";
        pasoFLMiguelito.style.display = "none";
        pasoFLGomitas.style.display = "none";

        // Llenar tamaños
        Object.entries(preciosFrutaLoca).forEach(([tam, precio]) => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="tamano" value="${tam}" data-precio="${precio}"> ${tam} - $${precio}`;
          formFLTamano.appendChild(label);
        });
      }
    });
  });

  // Cerrar modal
  cerrarFrutaLoca.addEventListener("click", () => modalFrutaLoca.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modalFrutaLoca) modalFrutaLoca.style.display = "none";
  });


  // --- Paso 1: Tamaño ---
  formFLTamano.addEventListener("change", () => {
    if (formFLTamano.querySelector("input:checked")) {
      btnNextFLTamano.classList.remove("btn-disabled");
      errorFLTamano.style.display = "none";
    }
  });

  btnNextFLTamano.addEventListener("click", () => {
    const seleccionado = formFLTamano.querySelector("input:checked");
    if (!seleccionado) {
      errorFLTamano.style.display = "block";
      return;
    }
    tamanoFLSeleccionado = seleccionado.value;
    precioFLBase = parseInt(seleccionado.dataset.precio);

    pasoFLTamano.style.display = "none";
    pasoFLMiguelito.style.display = "block";
  });

  // --- Paso 2: Miguelito ---
  formFLMiguelito.addEventListener("change", () => {
    if (formFLMiguelito.querySelector("input:checked")) {
      btnNextFLMiguelito.classList.remove("btn-disabled");
      errorFLMiguelito.style.display = "none";
    }
  });

  btnNextFLMiguelito.addEventListener("click", () => {
    const seleccionado = formFLMiguelito.querySelector("input:checked");
    if (!seleccionado) {
      errorFLMiguelito.style.display = "block";
      return;
    }
    pasoFLMiguelito.style.display = "none";
    pasoFLGomitas.style.display = "block";

    btnAddFL.textContent = `Añadir - $${precioFLBase}`;
  });

  // --- Paso 3: Gomitas + Añadir ---
  btnAddFL.addEventListener("click", () => {
    const errorFLGomitas = document.getElementById("error-fl-gomitas");
    const gomitasCheck = formFLGomitas.querySelector("input:checked");

    if (!gomitasCheck) {
      errorFLGomitas.style.display = "block";
      return;
    }
    errorFLGomitas.style.display = "none";

    const miguelito = formFLMiguelito.querySelector("input:checked").value;
    const gomitas = gomitasCheck.value;

    const nombre = `Fruta Loca (${productoFLSeleccionado}) ${tamanoFLSeleccionado} | Miguelito: ${miguelito} | Gomitas: ${gomitas}`;

    agregarAlCarrito(nombre, precioFLBase);

    modalFrutaLoca.style.display = "none";
  });

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
    "Pay de Limón": 45,
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
      texto.textContent = `${i + 1}. ${item.nombre} - $${item.precio} x${item.cantidad}`;

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
      btnEliminar.innerHTML = `<img src="img/trash.svg" alt="btn-eliminar"/>`;
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
    document.getElementById("btn-carrito-text").textContent = `Ver carrito (${items})`;
  }

  // Sobrescribimos agregarAlCarrito
  function agregarAlCarrito(nombre, precio, esCremaVellana = false) {
    if (esCremaVellana) {
      // Si el nombre trae toppings, insertamos "(Con Crema-vellana)" justo antes de " + Toppings"
      if (nombre.includes("+ Toppings")) {
        nombre = nombre.replace(" + Toppings", " (Con Crema-vellana) + Toppings");
      } else {
        // Si no trae toppings, lo dejamos al final del producto/tamaño
        nombre += " (Con Crema-vellana)";
      }
    }

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
    const now = new Date();
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}-${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
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
      // --- Solo entran aquí los que NO son "En vaso"
      if (preciosConCrema[producto] && !btn.dataset.tipo) {
        modalTitulo.textContent = producto;
        modalDescripcion.textContent = "Selecciona un tamaño:";
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

        // Detectar si es rebanada
        if (["Flan Napolitano", "Pay de Limón", "Pastel Imposible", "Pastel de Chocolate", "Pastel de Beso de Angel"].includes(producto)) {
          productoRebanada = producto;
          precioRebanada = precio;
          tituloRebanadas.textContent = producto;
          modalRebanadas.style.display = "flex";
        } else {
          agregarAlCarrito(producto, precio);
        }
      }
    });
  });

  // Eventos del modal Rebanadas (solo una vez)
  btnLecheraSi.addEventListener("click", () => {
    agregarAlCarrito(`${productoRebanada} + Lechera`, precioRebanada);
    modalRebanadas.style.display = "none";
  });

  btnLecheraNo.addEventListener("click", () => {
    agregarAlCarrito(productoRebanada, precioRebanada);
    modalRebanadas.style.display = "none";
  });

  cerrarRebanadas.addEventListener("click", () => modalRebanadas.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modalRebanadas) modalRebanadas.style.display = "none";
  });

  // --- Enviar pedido por WhatsApp ---
  btnEnviar.addEventListener("click", () => {
    const numero = "525561037319"; // número de la tienda
    const orden = generarOrden();

    let mensaje = `Orden #${orden}\r\n`;
    let total = 0;

    carrito.forEach((item, i) => {
      let subtotal = item.precio * item.cantidad;
      mensaje += `${i + 1}. ${item.nombre} $${item.precio} x${item.cantidad}\r\n`;
      total += subtotal;
    });

    mensaje += `----Total: $${total}`;

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  });
});