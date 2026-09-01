// Estado del carrito y armado del mensaje de WhatsApp.
// No toca el DOM: cada página se encarga de pintarlo como le toca y se
// entera de los cambios por el callback `alCambiar`.

export function crearCarrito({ alCambiar = () => {} } = {}) {
  let items = [];

  const avisar = () => alCambiar(items);

  return {
    lista: () => items,
    estaVacio: () => items.length === 0,
    total: () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    piezas: () => items.reduce((suma, item) => suma + item.cantidad, 0),

    agregar(nombre, precio) {
      const existente = items.find(item => item.nombre === nombre && item.precio === precio);
      if (existente) existente.cantidad += 1;
      else items.push({ nombre, precio, cantidad: 1 });
      avisar();
    },

    cambiarCantidad(indice, delta) {
      const item = items[indice];
      if (!item) return;
      item.cantidad += delta;
      if (item.cantidad <= 0) items.splice(indice, 1);
      avisar();
    },

    editar(indice, nombre, precio) {
      const item = items[indice];
      if (!item) return;
      item.nombre = nombre;
      item.precio = precio;
      avisar();
    },

    eliminar(indice) {
      items.splice(indice, 1);
      avisar();
    },

    vaciar() {
      items = [];
      avisar();
    },

    mensaje(formato) {
      return armarMensaje(items, formato);
    }
  };
}

function armarMensaje(items, formato) {
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  if (formato === "caja") {
    const lineas = items.map(item => `${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}`);
    return `*NUEVA ORDEN #${folioCorto()}*\n${lineas.join("\n")}\n\n*TOTAL: $${total}*`;
  }

  const lineas = items.map((item, i) => `${i + 1}. ${item.nombre} $${item.precio} x${item.cantidad}`);
  return `Orden #${folioLargo()}\r\n${lineas.join("\r\n")}\r\n----Total: $${total}`;
}

export function abrirWhatsApp(numero, mensaje) {
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

export function mostrarToast(texto = "¡Agregado!") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = texto;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

function folioLargo() {
  const ahora = new Date();
  const fecha = `${ahora.getFullYear()}${ahora.getMonth() + 1}${ahora.getDate()}`;
  return `${fecha}-${ahora.getHours()}${ahora.getMinutes()}${ahora.getSeconds()}`;
}

function folioCorto() {
  const ahora = new Date();
  return `${ahora.getHours()}${ahora.getMinutes()}${ahora.getSeconds()}`;
}
