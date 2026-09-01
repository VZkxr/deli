// Panel de caja: mismo catálogo y mismo motor de pasos que el menú público,
// con una cuadrícula compacta, edición de la orden, cálculo de cambio y
// envío a varios números.

import { cargarCatalogo, vistaDe } from "./catalogo.js";
import { crearMotor, CLASES_CAJA } from "./flujo.js";
import { crearCarrito, abrirWhatsApp, mostrarToast } from "./carrito.js";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = texto => String(texto ?? "").replace(/[&<>"]/g, c => ESCAPES[c]);

const contenedorMenu = document.getElementById("menu");
const navMenu = document.getElementById("navMenu");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const envioBotones = document.getElementById("envio-botones");
const inputRecibo = document.getElementById("input-recibo");
const outputCambio = document.getElementById("output-cambio");

const carrito = crearCarrito({ alCambiar: pintarCarrito });

arrancar();

async function arrancar() {
  let catalogo;
  try {
    catalogo = await cargarCatalogo();
  } catch (error) {
    console.error(error);
    contenedorMenu.innerHTML = `<p style="color:white">No se pudo cargar el catálogo. ${esc(error.message)}</p>`;
    return;
  }

  const grupos = vistaDe(catalogo, "caja");
  navMenu.innerHTML = grupos
    .map(grupo => `<a href="#${esc(grupo.id)}">${esc(grupo.nav ?? grupo.titulo)}</a>`)
    .join("");
  contenedorMenu.innerHTML = grupos.map(pintarGrupo).join("");

  const motor = crearMotor({
    catalogo,
    modal: document.getElementById("modal-flujo"),
    clases: CLASES_CAJA,
    onAgregar: (nombre, precio) => {
      carrito.agregar(nombre, precio);
      mostrarToast();
    }
  });

  contenedorMenu.addEventListener("click", evento => {
    const boton = evento.target.closest("[data-id]");
    if (boton) motor.abrir(catalogo.porId.get(boton.dataset.id));
  });

  pintarBotonesEnvio(catalogo);
  conectarCarrito();
  pintarCarrito();
  irAlAncla();
}

/** El catálogo se pinta después de cargar, así que el ancla de la URL se aplica aquí. */
function irAlAncla() {
  if (!location.hash) return;
  document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

// --- Pintado del catálogo -----------------------------------------------

function pintarGrupo(grupo) {
  return `
    <h2 id="${esc(grupo.id)}" class="section-title">${esc(grupo.titulo)}</h2>
    ${grupo.secciones.map(pintarSeccion).join("")}
  `;
}

function pintarSeccion(seccion) {
  return `
    ${seccion.titulo ? `<h3 class="section-title-sub">${esc(seccion.titulo)}</h3>` : ""}
    <div class="grid-productos">${seccion.productos.map(pintarTarjeta).join("")}</div>
  `;
}

function pintarTarjeta(producto) {
  const fijo = typeof producto.precio === "number" && !producto.pasos.length;
  const texto = fijo ? `$${producto.precio}` : producto.textoBoton ?? "Agregar";
  const precio = typeof producto.precio === "number" && producto.pasos.length
    ? ` <span>($${producto.precio})</span>`
    : "";

  return `
    <div class="card-producto">
      <img src="${esc(producto.img)}" alt="${esc(producto.nombre)}">
      <div class="card-info">
        <h3>${esc(producto.nombre)}${precio}</h3>
        ${producto.descCorta ? `<p class="desc-mini">${esc(producto.descCorta)}</p>` : ""}
        <button class="${fijo ? "btn-add-direct" : "btn-agregar-modal"}" data-id="${esc(producto.id)}">${esc(texto)}</button>
      </div>
    </div>`;
}

function pintarBotonesEnvio(catalogo) {
  const destinos = catalogo.negocio.whatsapp.caja;
  const fila = destinos.filter(d => !d.anchoCompleto);
  const anchos = destinos.filter(d => d.anchoCompleto);

  const boton = (destino, clase) =>
    `<button class="btn-whatsapp${clase}" data-numero="${esc(destino.numero)}" disabled>${esc(destino.etiqueta)}</button>`;

  envioBotones.innerHTML =
    (fila.length ? `<div class="fila-botones">${fila.map(d => boton(d, "")).join("")}</div>` : "") +
    anchos.map(d => boton(d, " btn-full-width")).join("");

  envioBotones.addEventListener("click", evento => {
    const btn = evento.target.closest("button[data-numero]");
    if (btn && !btn.disabled) abrirWhatsApp(btn.dataset.numero, carrito.mensaje("caja"));
  });
}

// --- Carrito ------------------------------------------------------------

function conectarCarrito() {
  document.getElementById("btn-limpiar").addEventListener("click", () => {
    if (confirm("¿Vaciar carrito?")) carrito.vaciar();
  });

  listaCarrito.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;
    const indice = Number(boton.dataset.indice);

    switch (boton.dataset.accion) {
      case "mas": carrito.cambiarCantidad(indice, 1); break;
      case "menos": restar(indice); break;
      case "editar": editar(indice); break;
      case "eliminar": carrito.eliminar(indice); break;
    }
  });

  inputRecibo.addEventListener("input", calcularCambio);
}

function restar(indice) {
  const item = carrito.lista()[indice];
  if (item.cantidad > 1 || confirm("¿Eliminar producto?")) carrito.cambiarCantidad(indice, -1);
}

function editar(indice) {
  const item = carrito.lista()[indice];
  const nombre = prompt("Editar producto:", item.nombre);
  if (nombre === null || !nombre.trim()) return;

  const precio = prompt("Editar precio:", item.precio);
  if (precio === null || isNaN(parseFloat(precio))) return;

  carrito.editar(indice, nombre, parseFloat(precio));
}

function pintarCarrito() {
  const items = carrito.lista();

  listaCarrito.innerHTML = items.map((item, i) => `
    <div class="item-carrito">
      <div class="item-carrito-info">
        <div>
          <span style="font-weight:bold; color:var(--colorPrimario);">${item.cantidad}x</span> ${esc(item.nombre)}
        </div>
      </div>
      <div class="item-carrito-controls">
        <button class="btn-qty" data-accion="mas" data-indice="${i}">+</button>
        <button class="btn-qty" data-accion="menos" data-indice="${i}">-</button>
        <span style="min-width: 50px; text-align:right;">$${item.precio * item.cantidad}</span>
        <button class="btn-edit-item" data-accion="editar" data-indice="${i}"
          style="background:none; border:none; cursor:pointer;" title="Editar texto">✏️</button>
        <button class="btn-eliminar-item" data-accion="eliminar" data-indice="${i}">&times;</button>
      </div>
    </div>`).join("");

  totalCarrito.textContent = `Total: $${carrito.total()}`;

  for (const boton of envioBotones.querySelectorAll("button[data-numero]")) {
    boton.disabled = carrito.estaVacio();
  }

  calcularCambio();
}

function calcularCambio() {
  const recibo = parseFloat(inputRecibo.value) || 0;

  if (recibo <= 0) {
    outputCambio.textContent = "$0";
    outputCambio.style.color = "white";
    return;
  }

  const cambio = recibo - carrito.total();
  outputCambio.textContent = `$${cambio}`;
  outputCambio.style.color = cambio < 0 ? "red" : "var(--colorPrimario)";
}
