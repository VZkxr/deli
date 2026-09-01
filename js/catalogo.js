// Carga menu.json y lo deja listo para usar.
//
// Al normalizar, cada producto se queda con todo lo que necesita para
// funcionar por su cuenta: su flujo de pasos ya resuelto (con las opciones
// y los precios adentro), el sufijo y la plantilla de nombre que hereda de
// su sección. Así el motor de pasos solo recibe un producto y no tiene que
// ir preguntando por el resto del catálogo.

const RUTA_POR_DEFECTO = "menu.json";
const PLANTILLA_NOMBRE = "{producto} {tamano}{sufijo}";
const PLANTILLA_TITULO = "{producto}{sufijoTitulo}";

export async function cargarCatalogo(ruta = RUTA_POR_DEFECTO) {
  let respuesta;
  try {
    respuesta = await fetch(ruta, { cache: "no-cache" });
  } catch (error) {
    throw new Error(
      `No se pudo leer ${ruta}. Si estás en local, abre la página con Live Server ` +
      `(http://127.0.0.1:5501) en vez de dar doble clic al archivo. Detalle: ${error.message}`
    );
  }
  if (!respuesta.ok) throw new Error(`No se pudo leer ${ruta} (HTTP ${respuesta.status})`);
  return normalizar(await respuesta.json());
}

export function normalizar(catalogo) {
  const errores = [];
  const porId = new Map();

  for (const producto of recorrerProductos(catalogo)) {
    if (porId.has(producto.id)) errores.push(`Hay dos productos con el id "${producto.id}".`);
    porId.set(producto.id, producto);
  }

  for (const grupo of catalogo.grupos) {
    for (const seccion of grupo.secciones) {
      seccion.grupo = grupo.id;

      if (typeof seccion.tablaPrecios === "string") {
        seccion.tablaPrecios = resolverTabla(seccion.tablaPrecios, porId, errores, seccion.id);
      }

      for (const producto of seccion.productos) {
        producto.grupo = grupo.id;
        producto.seccion = seccion.id;
        producto.mostrarEn ??= ["menu", "caja"];
        producto.sufijo ??= seccion.sufijo ?? "";
        producto.sufijoTitulo ??= seccion.sufijoTitulo ?? producto.sufijo;
        producto.plantillaNombre ??= seccion.plantillaNombre ?? PLANTILLA_NOMBRE;
        producto.tituloModal ??= seccion.tituloModal ?? PLANTILLA_TITULO;
        producto.pasos = construirPasos(producto, seccion, catalogo, errores);
        validarPrecios(producto, errores);
      }
    }
  }

  if (errores.length) {
    throw new Error("menu.json tiene problemas:\n - " + errores.join("\n - "));
  }

  catalogo.porId = porId;
  return catalogo;
}

// --- Construcción de los pasos de un producto ---------------------------

function construirPasos(producto, seccion, catalogo, errores) {
  const ids = producto.flujo ?? seccion.flujo ?? [];
  const pasos = [];

  for (const id of ids) {
    const plantilla = catalogo.pasos[id];
    if (!plantilla) {
      errores.push(`El producto "${producto.id}" pide el paso "${id}", que no existe en "pasos".`);
      continue;
    }
    pasos.push({
      ...plantilla,
      id,
      opciones: resolverOpciones(plantilla.opciones, producto, catalogo, errores, id)
    });
  }
  return pasos;
}

function resolverOpciones(valor, producto, catalogo, errores, idPaso) {
  const contexto = `paso "${idPaso}" del producto "${producto.id}"`;

  if (Array.isArray(valor)) return valor.map(normalizarOpcion);

  if (valor === "$producto.tamanos") {
    if (!producto.tamanos) {
      errores.push(`El ${contexto} necesita "tamanos" y el producto no los tiene.`);
      return [];
    }
    return Object.entries(producto.tamanos).map(([nombre, precio]) => ({ nombre, precio }));
  }

  if (typeof valor === "string" && valor.startsWith("$listas.")) {
    const lista = catalogo.listas[valor.slice("$listas.".length)];
    if (!lista) {
      errores.push(`El ${contexto} apunta a "${valor}", que no existe en "listas".`);
      return [];
    }
    return lista.map(normalizarOpcion);
  }

  errores.push(`El ${contexto} tiene unas opciones que no se pueden resolver: ${JSON.stringify(valor)}`);
  return [];
}

function normalizarOpcion(opcion) {
  return typeof opcion === "string" ? { nombre: opcion } : opcion;
}

function resolverTabla(ref, porId, errores, idSeccion) {
  const partes = /^\$producto:([\w-]+)\.tamanos$/.exec(ref);
  if (!partes) {
    errores.push(`La sección "${idSeccion}" tiene una tablaPrecios que no se entiende: ${ref}`);
    return null;
  }
  const producto = porId.get(partes[1]);
  if (!producto?.tamanos) {
    errores.push(`La sección "${idSeccion}" pide los tamaños de "${partes[1]}", que no existen.`);
    return null;
  }
  return producto.tamanos;
}

// --- Validación ---------------------------------------------------------

function validarPrecios(producto, errores) {
  const base = producto.pasos.filter(paso => paso.precio === "base");

  if (base.length > 1) {
    errores.push(`El producto "${producto.id}" tiene más de un paso que define el precio base.`);
  }

  if (base.length === 0 && typeof producto.precio !== "number") {
    errores.push(`El producto "${producto.id}" no tiene "precio" ni un paso que lo defina.`);
  }

  for (const paso of base) {
    const sinPrecio = paso.opciones.filter(opcion => typeof opcion.precio !== "number");
    if (sinPrecio.length) {
      errores.push(
        `En "${producto.id}", el paso "${paso.id}" define el precio base pero ` +
        `${sinPrecio.length} de sus opciones no traen precio.`
      );
    }
  }
}

// --- Utilidades para las vistas -----------------------------------------

export function* recorrerProductos(catalogo) {
  for (const grupo of catalogo.grupos)
    for (const seccion of grupo.secciones)
      yield* seccion.productos;
}

/** Los grupos y secciones de una vista ("menu" o "caja"), ya sin lo que no se muestra. */
export function vistaDe(catalogo, vista) {
  return catalogo.grupos
    .map(grupo => ({
      ...grupo,
      secciones: grupo.secciones
        .map(seccion => ({
          ...seccion,
          productos: seccion.productos.filter(p => p.mostrarEn.includes(vista))
        }))
        .filter(seccion => seccion.productos.length)
    }))
    .filter(grupo => grupo.secciones.length);
}
