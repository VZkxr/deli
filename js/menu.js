// Menú público: pinta el catálogo, abre el motor de pasos y maneja el
// carrito del cliente.

import { cargarCatalogo, vistaDe } from "./catalogo.js";
import { crearMotor, CLASES_MENU } from "./flujo.js";
import { crearCarrito, abrirWhatsApp, mostrarToast } from "./carrito.js";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = texto => String(texto ?? "").replace(/[&<>"]/g, c => ESCAPES[c]);

const contenedorMenu = document.getElementById("menu");
const navMenu = document.getElementById("navMenu");
const btnEnviar = document.getElementById("btn-enviar");
const btnCarrito = document.getElementById("btn-carrito");
const btnCarritoTexto = document.getElementById("btn-carrito-text");
const modalCarrito = document.getElementById("modal-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");

const carrito = crearCarrito({ alCambiar: pintarCarrito });

arrancar();

async function arrancar() {
  let catalogo;
  try {
    catalogo = await cargarCatalogo();
  } catch (error) {
    console.error(error);
    contenedorMenu.innerHTML = `<p class="text-center">No se pudo cargar el menú. ${esc(error.message)}</p>`;
    return;
  }

  const grupos = vistaDe(catalogo, "menu");
  navMenu.innerHTML = `<a href="#inicio">Inicio</a>` +
    grupos.map(grupo => `<a href="#${esc(grupo.id)}">${esc(grupo.nav ?? grupo.titulo)}</a>`).join("");
  contenedorMenu.innerHTML = grupos.map(pintarGrupo).join("");

  const motor = crearMotor({
    catalogo,
    modal: document.getElementById("modal-flujo"),
    clases: CLASES_MENU,
    onAgregar: (nombre, precio) => {
      carrito.agregar(nombre, precio);
      mostrarToast();
    }
  });

  contenedorMenu.addEventListener("click", evento => {
    const boton = evento.target.closest(".btn-agregar");
    if (boton) motor.abrir(catalogo.porId.get(boton.dataset.id));
  });

  conectarNavegacion();
  conectarCarrito(catalogo);
  irAlAncla();
}

/** El menú se pinta después de cargar, así que el ancla de la URL se aplica aquí. */
function irAlAncla() {
  if (!location.hash) return;
  document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

// --- Pintado del menú ---------------------------------------------------

function pintarGrupo(grupo) {
  return `
    <h1 id="${esc(grupo.id)}" class="title">${esc(grupo.titulo)}</h1>
    ${grupo.nota ? `<h3>${esc(grupo.nota)}</h3>` : ""}
    ${grupo.secciones.map(pintarSeccion).join("")}
  `;
}

function pintarSeccion(seccion) {
  return `
    ${seccion.titulo ? `<h2>${esc(seccion.titulo)}</h2>` : ""}
    ${seccion.nota ? `<p class="nota-seccion">${esc(seccion.nota)}</p>` : ""}
    ${seccion.tablaPrecios ? pintarTablaPrecios(seccion.tablaPrecios) : ""}
    <div class="productos">${seccion.productos.map(p => pintarTarjeta(p, seccion)).join("")}</div>
  `;
}

function pintarTablaPrecios(tabla) {
  const items = Object.entries(tabla)
    .map(([etiqueta, valor]) => `
      <div class="precio-item">
        <span class="etiqueta">${esc(etiqueta)}</span>
        <span class="precio">$${valor}</span>
      </div>`)
    .join("");
  return `<div class="precios-multiples">${items}</div>`;
}

function pintarTarjeta(producto, seccion) {
  return `
    <div class="producto-item">
      <img src="${esc(producto.img)}" alt="${esc(producto.nombre)}">
      <div class="detalle">
        <div class="titulo-precio">
          <h2>${esc(producto.nombre)}</h2>
          <span class="linea"></span>
          ${pintarPrecioTarjeta(producto, seccion)}
          <button class="btn-agregar" data-id="${esc(producto.id)}">${esc(producto.textoBoton ?? "Agregar")}</button>
        </div>
        <p>${esc(producto.desc)}</p>
      </div>
    </div>`;
}

/** La tarjeta no repite la tabla de precios que ya muestra su sección. */
function pintarPrecioTarjeta(producto, seccion) {
  const precios = preciosDe(producto);
  if (precios.tipo === "fijo") return `<span class="precio">$${precios.valor}</span>`;
  if (precios.tipo === "tabla" && !seccion.tablaPrecios) {
    const divs = Object.entries(precios.tabla)
      .map(([etiqueta, valor]) => `<div><span class="etiqueta">${esc(etiqueta)}</span><span class="precio">$${valor}</span></div>`)
      .join("");
    return `<div class="precios-multiples">${divs}</div>`;
  }
  return "";
}

/** De dónde sale el precio que se muestra: fijo, tabla de tamaños, o las opciones del paso base. */
export function preciosDe(producto) {
  if (typeof producto.precio === "number") return { tipo: "fijo", valor: producto.precio };
  if (producto.tamanos) return { tipo: "tabla", tabla: producto.tamanos };

  const base = producto.pasos.find(paso => paso.precio === "base");
  if (!base?.opciones.length) return { tipo: "ninguno" };

  const valores = [...new Set(base.opciones.map(opcion => opcion.precio))];
  if (valores.length === 1) return { tipo: "fijo", valor: valores[0] };
  return { tipo: "tabla", tabla: Object.fromEntries(base.opciones.map(o => [o.nombre, o.precio])) };
}

// --- Navegación ---------------------------------------------------------

function conectarNavegacion() {
  const nav = document.querySelector("nav");
  const navHamb = document.getElementById("navHamb");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 130);
  });

  navHamb.addEventListener("click", () => navMenu.classList.toggle("displayMenu"));
  navMenu.addEventListener("click", evento => {
    if (evento.target.tagName === "A") navMenu.classList.remove("displayMenu");
  });
}

// --- Carrito ------------------------------------------------------------

function conectarCarrito(catalogo) {
  btnCarrito.addEventListener("click", () => {
    modalCarrito.style.display = "flex";
  });

  document.getElementById("cerrarCarrito").addEventListener("click", () => {
    modalCarrito.style.display = "none";
  });

  window.addEventListener("click", evento => {
    if (evento.target === modalCarrito) modalCarrito.style.display = "none";
  });

  listaCarrito.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const indice = Number(boton.dataset.indice);
    if (boton.dataset.accion === "mas") carrito.cambiarCantidad(indice, 1);
    else if (boton.dataset.accion === "menos") carrito.cambiarCantidad(indice, -1);
    else carrito.eliminar(indice);
  });

  btnEnviar.addEventListener("click", () => {
    abrirWhatsApp(catalogo.negocio.whatsapp.tienda, carrito.mensaje("menu"));
  });

  pintarCarrito();
}

function pintarCarrito() {
  const items = carrito.lista();

  listaCarrito.innerHTML = items.map((item, i) => `
    <div class="item-carrito">
      <span>${i + 1}. ${esc(item.nombre)} - $${item.precio} x${item.cantidad}</span>
      <div class="acciones-carrito">
        <button class="btn-menos" data-accion="menos" data-indice="${i}">−</button>
        <button class="btn-mas" data-accion="mas" data-indice="${i}">+</button>
        <button class="btn-eliminar" data-accion="eliminar" data-indice="${i}">
          <img src="img/trash.svg" alt="Eliminar"/>
        </button>
      </div>
    </div>`).join("");

  totalCarrito.textContent = `Total: $${carrito.total()}`;
  btnCarritoTexto.textContent = `Ver carrito (${carrito.piezas()})`;

  const vacio = carrito.estaVacio();
  btnEnviar.disabled = vacio;
  btnCarrito.disabled = vacio;
  if (vacio) modalCarrito.style.display = "none";
}
