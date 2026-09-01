// Motor de pasos: toma un producto ya normalizado y lo va preguntando paso
// por paso dentro de un solo modal genérico.
//
// No sabe nada del carrito ni de qué página lo está usando: recibe el modal
// donde pintar, las clases de CSS que esa página usa y un callback al que le
// entrega el nombre y el precio finales.

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
const esc = texto => String(texto).replace(/[&<>"]/g, c => ESCAPES[c]);

export const CLASES_MENU = { boton: "btn-agregar", lista: "form-opciones", grid: "form-opciones" };
export const CLASES_CAJA = { boton: "btn-accion", lista: "form-opciones", grid: "form-grid-2" };

export function crearMotor({ catalogo, modal, clases = CLASES_MENU, onAgregar }) {
  const contenido = modal.querySelector(".modal-contenido");
  let estado = null;

  modal.addEventListener("click", evento => {
    if (evento.target === modal) cerrar();
  });
  document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && estado) cerrar();
  });

  function abrir(producto) {
    // Sin pasos que preguntar: va derecho al carrito.
    if (!producto.pasos.length) {
      onAgregar(construirNombre(producto, new Map()), producto.precio ?? 0, producto);
      return;
    }

    estado = { producto, indice: 0, selecciones: new Map() };
    for (const paso of producto.pasos) {
      if (!paso.predeterminado) continue;
      const opcion = paso.opciones.find(o => o.nombre === paso.predeterminado);
      if (opcion) estado.selecciones.set(paso.id, [opcion]);
    }

    modal.style.display = "flex";
    pintarPaso();
  }

  function cerrar() {
    modal.style.display = "none";
    estado = null;
  }

  function pintarPaso() {
    const { producto, indice } = estado;
    const paso = producto.pasos[indice];
    const esPrimero = indice === 0;
    const esUltimo = indice === producto.pasos.length - 1;

    const tituloPaso = interpolarTitulo(paso, producto, estado.selecciones);
    const encabezado = esPrimero ? tituloDelModal(producto) : tituloPaso;
    const subtitulo = esPrimero ? paso.subtitulo ?? tituloPaso : paso.subtitulo;

    const opciones = paso.opciones
      .map((opcion, i) => renderOpcion(opcion, i, paso, estado.selecciones))
      .join("");

    const claseForm = paso.disposicion === "grid" ? clases.grid : clases.lista;
    const formulario = `<form class="${claseForm}">${opciones}</form>`;

    contenido.innerHTML = `
      <span class="cerrar" data-cerrar>&times;</span>
      <div class="paso">
        <h2>${esc(encabezado)}</h2>
        ${subtitulo ? `<p>${esc(subtitulo)}</p>` : ""}
        ${paso.scroll ? `<div class="scroll-toppings">${formulario}</div>` : formulario}
        <button type="button" class="${clases.boton}" data-avanzar>${esUltimo ? "Añadir" : "Siguiente"}</button>
        <p class="error-inline" data-error style="display:none; margin-top:8px;">${esc(paso.error ?? "")}</p>
      </div>
    `;

    const form = contenido.querySelector("form");
    const boton = contenido.querySelector("[data-avanzar]");
    const error = contenido.querySelector("[data-error]");

    contenido.querySelector("[data-cerrar]").addEventListener("click", cerrar);

    form.addEventListener("change", evento => {
      aplicarExclusividad(paso, form, evento.target);
      estado.selecciones.set(paso.id, leerSeleccion(paso, form));
      if (cumpleRequisitos(paso, estado.selecciones)) error.style.display = "none";
      actualizarBoton();
    });

    boton.addEventListener("click", () => {
      if (!cumpleRequisitos(paso, estado.selecciones)) {
        error.style.display = "block";
        return;
      }
      if (esUltimo) {
        const producto = estado.producto;
        const nombre = construirNombre(producto, estado.selecciones);
        const precio = calcularPrecio(producto, estado.selecciones, catalogo.reglas);
        cerrar();
        onAgregar(nombre, precio, producto);
      } else {
        estado.indice += 1;
        pintarPaso();
      }
    });

    actualizarBoton();

    function actualizarBoton() {
      const listo = cumpleRequisitos(paso, estado.selecciones);
      boton.classList.toggle("btn-disabled", !listo);
      if (!esUltimo) return;
      const precio = calcularPrecio(estado.producto, estado.selecciones, catalogo.reglas);
      boton.textContent = `Añadir - $${precio}`;
    }
  }

  return { abrir, cerrar };
}

// --- Pintado de una opción ----------------------------------------------

function renderOpcion(opcion, indice, paso, selecciones) {
  const tipo = paso.tipo === "multiple" ? "checkbox" : "radio";
  const marcada = (selecciones.get(paso.id) ?? []).includes(opcion);
  return `<label>
      <input type="${tipo}" name="opcion" value="${indice}"${marcada ? " checked" : ""}>
      <span>${esc(etiquetaDe(opcion, paso))}</span>
    </label>`;
}

function etiquetaDe(opcion, paso) {
  const texto = opcion.etiqueta ?? opcion.nombre;
  if (paso.precio === "base") return `${texto} - $${opcion.precio}`;
  if (typeof opcion.precio === "number") return `${texto} (+$${opcion.precio})`;
  return texto;
}

function interpolarTitulo(paso, producto, selecciones) {
  const titulo = paso.titulo ?? "";
  if (!titulo.includes("{costo}")) return titulo;
  return titulo.replace("{costo}", `$${sobreprecioDe(paso, producto, selecciones)}`);
}

function tituloDelModal(producto) {
  return producto.tituloModal
    .replaceAll("{producto}", producto.nombre)
    .replaceAll("{sufijoTitulo}", producto.sufijoTitulo ?? "")
    .trim();
}

// --- Selección ----------------------------------------------------------

function leerSeleccion(paso, form) {
  return [...form.querySelectorAll("input:checked")].map(input => paso.opciones[Number(input.value)]);
}

/** "Ninguno" y las demás opciones se apagan entre sí. */
function aplicarExclusividad(paso, form, cambiado) {
  if (paso.tipo !== "multiple" || !cambiado.checked) return;
  const opcion = paso.opciones[Number(cambiado.value)];
  const inputs = [...form.querySelectorAll("input")];

  if (opcion.exclusivo) {
    for (const input of inputs) if (input !== cambiado) input.checked = false;
  } else {
    for (const input of inputs) {
      if (paso.opciones[Number(input.value)].exclusivo) input.checked = false;
    }
  }
}

function cumpleRequisitos(paso, selecciones) {
  const elegidas = selecciones.get(paso.id) ?? [];
  if (paso.tipo === "multiple") {
    if (paso.min && elegidas.length < paso.min) return false;
    if (paso.max && elegidas.length > paso.max) return false;
    return true;
  }
  return paso.obligatorio ? elegidas.length > 0 : true;
}

// --- Precio y nombre (funciones puras, también usadas por pruebas.html) --

export function calcularPrecio(producto, selecciones, reglas) {
  const pasoBase = producto.pasos.find(paso => paso.precio === "base");
  let total = producto.precio ?? 0;

  if (pasoBase) total = elegidas(selecciones, pasoBase)[0]?.precio ?? 0;

  for (const paso of producto.pasos) {
    if (paso === pasoBase) continue;
    const opciones = elegidas(selecciones, paso);

    if (paso.cobro === "primeroGratis") {
      // Los toppings premium se cobran siempre; de los normales, el primero
      // va incluido y cada uno extra suma.
      let normales = 0;
      for (const opcion of opciones) {
        if (typeof opcion.precio === "number") total += opcion.precio;
        else if (!opcion.exclusivo) normales += 1;
      }
      if (normales > reglas.toppingsIncluidos) {
        total += (normales - reglas.toppingsIncluidos) * reglas.costoToppingExtra;
      }
    } else {
      for (const opcion of opciones) {
        if (opcion.sobreprecio) total += sobreprecioDe(paso, producto, selecciones);
        else if (typeof opcion.precio === "number") total += opcion.precio;
      }
    }
  }
  return total;
}

export function sobreprecioDe(paso, producto, selecciones) {
  const mapa = paso.sobreprecio ?? {};
  const pasoBase = producto.pasos.find(p => p.precio === "base");
  const tamano = pasoBase ? elegidas(selecciones, pasoBase)[0]?.nombre : null;
  return mapa[tamano] ?? mapa["*"] ?? 0;
}

export function construirNombre(producto, selecciones) {
  const pasoBase = producto.pasos.find(paso => paso.precio === "base");
  const tamano = pasoBase ? elegidas(selecciones, pasoBase)[0]?.nombre ?? "" : "";

  let nombre = producto.plantillaNombre
    .replaceAll("{producto}", producto.nombre)
    .replaceAll("{tamano}", tamano)
    .replaceAll("{sufijo}", producto.sufijo ?? "")
    .replace(/\s+/g, " ")
    .trim();

  for (const paso of producto.pasos) {
    if (paso === pasoBase) continue;
    const opciones = elegidas(selecciones, paso).filter(opcion => !opcion.omitirEnNombre);
    if (!opciones.length) continue;

    if (paso.enNombre) {
      const valores = opciones.map(opcion => opcion.nombre).join(", ");
      nombre += " " + (paso.enNombre.includes("{valores}")
        ? paso.enNombre.replace("{valores}", valores)
        : `${paso.enNombre} ${valores}`);
    } else {
      for (const opcion of opciones) {
        if (opcion.enNombre) nombre += " " + opcion.enNombre;
      }
    }
  }
  return nombre;
}

function elegidas(selecciones, paso) {
  return selecciones.get(paso.id) ?? [];
}
