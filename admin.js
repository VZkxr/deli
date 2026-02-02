document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin Panel Loaded");

    // --- Variables de Estado ---
    let carrito = [];

    // Configuración de Precios (Copiados y adaptados de script.js)
    const preciosConCrema = {
        "Fresas": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
        "Uvas": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
        "Durazno": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
        "Manzana": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
        "Zarzamora": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
        "Arroz con Leche": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 },
    };

    const preciosVellana = {
        "Fresas": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Durazno": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Uvas": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Manzana": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Zarzamora": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
    };

    const preciosFrutaLoca = {
        "Ch.": 30, "Med.": 35, "Gr.": 45, "Tazón": 60
    };

    const preciosOreo = { "Ch.": 55, "Med.": 65, "Gr.": 90 };
    const preciosBrownie = { "Ch.": 55, "Med.": 75, "Gr.": 110 };
    const preciosCheescake = { "Ch.": 55, "Med.": 75, "Gr.": 110 };
    const preciosDeliFresa = { "Ch.": 70, "Med.": 80, "Gr.": 115 };

    const saboresAgua = {
        "Uva": 10, "Fresa": 10, "Mora Azul": 10, "Grosella": 10, "Limón": 10
    };

    const preciosExtras = {
        "Hershey's extra": 3,
        "Avellana extra": 3,
        "Cheescake": 5,
        "Galleta Brownie": 5
    };

    const listToppingsGeneral = [
        "Kranky", "Chispas", "Chocochispas", "Nuez", "Pasas", "Granola", "Canela", "Lechera", "Chantilli", "Ninguno",
        "Hershey's extra", "Avellana extra", "Cheescake", "Galleta Brownie"
    ];

    const listToppingsDeliFresa = [
        "Cubitos Cheescake", "Galleta Brownie", "Galleta Oreo"
    ];

    const listJarabes = [
        "Mermelada", "Hershey's", "Avellana", "Lechera", "Ninguno"
    ];

    // --- Variables Globales para Modales ---
    let pSeleccionado = null;
    let tipoSeleccionado = null;
    let pRebanada = null; // para rebanadas

    // --- Funciones del Carrito ---
    window.agregarAlCarrito = function (nombre, precio) {
        // Buscar si ya existe para sumar cantidad
        const existe = carrito.find(p => p.nombre === nombre);
        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        renderCarrito();
        mostrarToast();
    };

    window.cambiarCantidad = function (index, delta) {
        if (carrito[index].cantidad + delta > 0) {
            carrito[index].cantidad += delta;
        } else {
            // Si baja a 0, confirmar eliminación
            if (confirm("¿Eliminar producto?")) {
                carrito.splice(index, 1);
            }
        }
        renderCarrito();
    };

    function renderCarrito() {
        const lista = document.getElementById("lista-carrito");
        const totalEl = document.getElementById("total-carrito");
        lista.innerHTML = "";
        let total = 0;

        carrito.forEach((item, index) => {
            total += item.precio * item.cantidad;

            const div = document.createElement("div");
            div.className = "item-carrito";
            div.innerHTML = `
                <div class="item-carrito-info">
                    <div>
                        <span style="font-weight:bold; color:var(--colorPrimario);">${item.cantidad}x</span> ${item.nombre}
                    </div>
                </div>
                <div class="item-carrito-controls">
                    <button class="btn-qty" onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button class="btn-qty" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span style="min-width: 50px; text-align:right;">$${item.precio * item.cantidad}</span>
                    <button class="btn-edit-item" onclick="editarItem(${index})" style="background:none; border:none; cursor:pointer;" title="Editar texto">✏️</button>
                    <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${index})">&times;</button>
                </div>
            `;
            lista.appendChild(div);
        });

        totalEl.textContent = `Total: $${total}`;

        const btnYane = document.getElementById("btn-enviar-yane");
        const btnDitz = document.getElementById("btn-enviar-ditz");
        const btnDeli = document.getElementById("btn-enviar-deli");

        if (carrito.length > 0) {
            btnYane.disabled = false;
            btnDitz.disabled = false;
            btnDeli.disabled = false;
        } else {
            btnYane.disabled = true;
            btnDitz.disabled = true;
            btnDeli.disabled = true;
        }

        // Recalcular cambio si ya hay monto ingresado
        if (typeof calcularCambio === "function") {
            calcularCambio();
        }
    }

    window.eliminarDelCarrito = function (index) {
        carrito.splice(index, 1);
        renderCarrito();
    };

    window.editarItem = function (index) {
        const item = carrito[index];
        const nuevoNombre = prompt("Editar producto:", item.nombre);
        if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
            const nuevoPrecio = prompt("Editar precio:", item.precio);
            if (nuevoPrecio !== null && !isNaN(parseFloat(nuevoPrecio))) {
                item.nombre = nuevoNombre;
                item.precio = parseFloat(nuevoPrecio);
                renderCarrito();
            }
        }
    };

    document.getElementById("btn-limpiar").addEventListener("click", () => {
        if (confirm("¿Vaciar carrito?")) {
            carrito = [];
            renderCarrito();
        }
    });

    function mostrarToast() {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = "¡Agregado!";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1000);
    }

    // --- Lógica de WhatsApp ---
    function enviarWhatsapp(numero) {
        const now = new Date();
        const idOrden = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

        let msg = `*NUEVA ORDEN #${idOrden}*\n`;
        let total = 0;

        carrito.forEach(item => {
            msg += `${item.cantidad}x ${item.nombre} - $${item.precio * item.cantidad}\n`;
            total += item.precio * item.cantidad;
        });

        msg += `\n*TOTAL: $${total}*`;

        const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    }

    document.getElementById("btn-enviar-yane").addEventListener("click", () => enviarWhatsapp("525621824398"));
    document.getElementById("btn-enviar-ditz").addEventListener("click", () => enviarWhatsapp("525543875975"));
    document.getElementById("btn-enviar-deli").addEventListener("click", () => enviarWhatsapp("525561037319"));


    // --- Lógica de Cambio ---
    const inputRecibo = document.getElementById("input-recibo");
    const outputCambio = document.getElementById("output-cambio");

    function calcularCambio() {
        const totalTexto = document.getElementById("total-carrito").textContent;
        const total = parseInt(totalTexto.replace("Total: $", "")) || 0;
        const recibo = parseFloat(inputRecibo.value) || 0;

        if (recibo > 0) {
            const cambio = recibo - total;
            outputCambio.textContent = `$${cambio}`;
            if (cambio < 0) {
                outputCambio.style.color = "red";
            } else {
                outputCambio.style.color = "var(--colorPrimario)"; // Regresar al color original (rosa/magenta del diseño)
            }
        } else {
            outputCambio.textContent = "$0";
            outputCambio.style.color = "white";
        }
    }

    inputRecibo.addEventListener("input", calcularCambio);

    // ================= LOGICA MODALES ================= //


    // ================= LOGICA MODALES ================= //

    // 1. Modal Charola
    const modalCharola = document.getElementById("modal-charola");
    const pasoCharolaFrutas = document.getElementById("paso-frutas");
    const pasoCharolaTopping = document.getElementById("paso-topping");

    // Trigger
    document.querySelectorAll(".btn-charola").forEach(btn => {
        btn.addEventListener("click", (e) => {

            // Limpiar inputs
            document.querySelectorAll("#modal-charola input").forEach(i => i.checked = false);

            pSeleccionado = "Charola Frutas";

            pasoCharolaFrutas.style.display = "block";
            pasoCharolaTopping.style.display = "none";
            document.getElementById("btn-siguiente-frutas").classList.add("btn-disabled");

            modalCharola.style.display = "flex";
        });
    });

    // Validar 3 frutas
    document.getElementById("form-charola-frutas").addEventListener("change", () => {
        const checks = document.querySelectorAll("#form-charola-frutas input:checked");
        const btn = document.getElementById("btn-siguiente-frutas");
        if (checks.length === 3) btn.classList.remove("btn-disabled");
        else btn.classList.add("btn-disabled");
    });

    document.getElementById("btn-siguiente-frutas").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-disabled")) return;
        pasoCharolaFrutas.style.display = "none";
        pasoCharolaTopping.style.display = "block";
    });

    document.getElementById("btn-add-charola").addEventListener("click", () => {
        // Recopilar info
        const frutas = Array.from(document.querySelectorAll("#form-charola-frutas input:checked")).map(i => i.value).join(", ");
        const toppings = Array.from(document.querySelectorAll("#form-charola-topping input:checked")).map(i => i.value).filter(v => v !== "Ninguno");

        let precio = 40;
        if (toppings.length > 1) {
            precio += (toppings.length - 1) * 2;
        }

        const nombreFinal = `${pSeleccionado} (${frutas}) + Toppings: ${toppings.length ? toppings.join(", ") : "Ninguno"}`;

        agregarAlCarrito(nombreFinal, precio);
        modalCharola.style.display = "none";
    });

    // Cerrar charola
    document.getElementById("cerrarCharola").addEventListener("click", () => modalCharola.style.display = "none");


    // 2. Modal Vaso (Generic)
    const modalVaso = document.getElementById("modal-vaso");
    const pasoVasoTamano = document.getElementById("paso-tamano");
    const pasoVasoTopping = document.getElementById("paso-topping-vaso");
    const pasoVasoJarabe = document.getElementById("paso-jarabe");

    document.querySelectorAll(".btn-agregar-modal[data-tipo='vaso'], .btn-agregar-modal[data-tipo='vellana'], .btn-agregar-modal[data-tipo='oreo'], .btn-agregar-modal[data-tipo='brownie'], .btn-agregar-modal[data-tipo='cheescake'], .btn-agregar-modal[data-tipo='deli-fresa']").forEach(btn => {
        btn.addEventListener("click", () => {
            pSeleccionado = btn.dataset.producto;
            tipoSeleccionado = btn.dataset.tipo; // vaso o vellana

            let titulo = pSeleccionado;
            if (tipoSeleccionado === 'vaso') titulo += " (Crema)";
            else if (tipoSeleccionado === 'vellana') titulo += " (Vellana)";
            document.getElementById("titulo-vaso").textContent = titulo;

            // Generar opciones de tamaño
            const formulario = document.getElementById("form-vaso-tamano");
            formulario.innerHTML = "";

            let precios;
            if (tipoSeleccionado === 'vellana') precios = preciosVellana[pSeleccionado];
            else if (tipoSeleccionado === 'vaso') precios = preciosConCrema[pSeleccionado];
            else if (tipoSeleccionado === 'oreo') precios = preciosOreo;
            else if (tipoSeleccionado === 'brownie') precios = preciosBrownie;
            else if (tipoSeleccionado === 'cheescake') precios = preciosCheescake;
            else if (tipoSeleccionado === 'deli-fresa') precios = preciosDeliFresa;
            else precios = preciosConCrema[pSeleccionado];

            for (const [tam, precio] of Object.entries(precios)) {
                formulario.innerHTML += `
                    <label>
                        <input type="radio" name="tamano" value="${tam}" data-precio="${precio}">
                        ${tam} - $${precio}
                    </label>
                `;
            }

            // Reset UI
            pasoVasoTamano.style.display = "block";
            pasoVasoTopping.style.display = "none";
            pasoVasoJarabe.style.display = "none";
            document.getElementById("btn-siguiente-tamano").classList.add("btn-disabled");

            // Generar Toppings dinámicamente
            const formTopping = document.getElementById("form-vaso-topping");
            formTopping.innerHTML = "";

            if (tipoSeleccionado === 'deli-fresa') {
                // Toppings restringidos (Radio)
                listToppingsDeliFresa.forEach(top => {
                    formTopping.innerHTML += `<label><input type="radio" name="topping" value="${top}"> ${top}</label>`;
                });
            } else {
                // Toppings generales (Checkbox)
                listToppingsGeneral.forEach(top => {
                    let label = top;
                    if (preciosExtras[top]) label += ` (+$${preciosExtras[top]})`;
                    formTopping.innerHTML += `<label><input type="checkbox" name="topping" value="${top}"> ${label}</label>`;
                });
            }

            // Generar Jarabes (siempre igual por ahora)
            const formJarabe = document.getElementById("form-vaso-jarabe");
            formJarabe.innerHTML = "";
            listJarabes.forEach(jar => {
                formJarabe.innerHTML += `<label><input type="radio" name="jarabe" value="${jar}"> ${jar}</label>`;
            });

            // Actualizar texto botón paso 2
            const btnPaso2 = document.getElementById("btn-add-vaso");
            if (tipoSeleccionado === 'oreo' || tipoSeleccionado === 'deli-fresa') {
                btnPaso2.textContent = "Siguiente";
            } else {
                btnPaso2.textContent = "Añadir";
            }

            modalVaso.style.display = "flex";
        });
    });

    document.getElementById("form-vaso-tamano").addEventListener("change", () => {
        if (document.querySelector("#form-vaso-tamano input:checked")) {
            document.getElementById("btn-siguiente-tamano").classList.remove("btn-disabled");
        }
    });

    document.getElementById("btn-siguiente-tamano").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-disabled")) return;
        pasoVasoTamano.style.display = "none";
        pasoVasoTopping.style.display = "block";
    });

    // Botón Paso 2 (Topping -> Final OR Jarabe)
    document.getElementById("btn-add-vaso").addEventListener("click", () => {
        if (tipoSeleccionado === 'oreo' || tipoSeleccionado === 'deli-fresa') {
            // Ir a Jarabe
            pasoVasoTopping.style.display = "none";
            pasoVasoJarabe.style.display = "block";
        } else {
            // Finalizar aquí
            finalizarVaso();
        }
    });

    // Botón Paso 3 (Jarabe -> Final)
    document.getElementById("btn-add-vaso-jarabe").addEventListener("click", () => {
        finalizarVaso();
    });

    function finalizarVaso() {
        const tamInput = document.querySelector("#form-vaso-tamano input:checked");
        const tamNombre = tamInput.value;
        const tamPrecio = parseInt(tamInput.dataset.precio);

        // Recopilar Toppings
        let toppings = [];
        if (tipoSeleccionado === 'deli-fresa') {
            const t = document.querySelector("#form-vaso-topping input:checked");
            if (t) toppings.push(t.value);
        } else {
            toppings = Array.from(document.querySelectorAll("#form-vaso-topping input:checked")).map(i => i.value);
        }

        // Recopilar Jarabe
        let jarabe = null;
        if (tipoSeleccionado === 'oreo' || tipoSeleccionado === 'deli-fresa') {
            const j = document.querySelector("#form-vaso-jarabe input:checked");
            if (j) jarabe = j.value;
        }

        // Calcular Precio
        let precioFinal = tamPrecio;

        if (tipoSeleccionado !== 'deli-fresa') {
            // Lógica general: 1er topping gratis (excluyendo premiums), siguientes +2. Premiums siempre se cobran.
            // Separar premiums de normales
            let normales = 0;

            toppings.forEach(top => {
                if (preciosExtras[top]) {
                    precioFinal += preciosExtras[top]; // Cobrar premium siempre
                } else {
                    normales++;
                }
            });

            if (normales > 1) {
                precioFinal += (normales - 1) * 2;
            }
        }
        // Nota: Deli Fresa ya incluye el topping base en el precio (segun plan), y jarabe es gratis.

        // Construir Nombre
        let nombreFinal = `${pSeleccionado} ${tamNombre}`;
        if (tipoSeleccionado === 'vellana') nombreFinal += " (Vellana)";

        if (toppings.length > 0 && toppings[0] !== "Ninguno") {
            nombreFinal += ` + Toppings: ${toppings.join(", ")}`;
        }

        if (jarabe && jarabe !== "Ninguno") {
            nombreFinal += ` + Jarabe: ${jarabe}`;
        }

        agregarAlCarrito(nombreFinal, precioFinal);
        modalVaso.style.display = "none";
    }

    document.getElementById("cerrarVaso").addEventListener("click", () => modalVaso.style.display = "none");


    // 3. Modal Fruta Loca
    const modalFL = document.getElementById("modal-fruta-loca");
    let isCharolaLoca = false;

    document.querySelectorAll("[data-tipo='fruta-loca'], [data-tipo='charola-loca']").forEach(btn => {
        btn.addEventListener("click", () => {
            const tipo = btn.dataset.tipo;
            pSeleccionado = btn.dataset.producto;

            // Resetear todo
            document.querySelectorAll("#modal-fruta-loca input").forEach(i => i.checked = false);
            document.querySelectorAll("#modal-fruta-loca .btn-accion").forEach(b => {
                if (b.id !== "btn-add-fl") b.classList.add("btn-disabled");
            });

            // Ocultar todos los pasos
            document.getElementById("paso-fl-frutas").style.display = "none";
            document.getElementById("paso-fl-tamano").style.display = "none";
            document.getElementById("paso-fl-miguelito").style.display = "none";
            document.getElementById("paso-fl-gomitas").style.display = "none";
            document.getElementById("error-fl-gomitas").style.display = "none";

            if (tipo === "charola-loca") {
                isCharolaLoca = true;
                document.getElementById("titulo-fl").textContent = "Charola Loca ($40)";

                // Paso 0: Frutas
                document.getElementById("paso-fl-frutas").style.display = "block";
            } else {
                isCharolaLoca = false;
                document.getElementById("titulo-fl").textContent = "Fruta Loca";

                // Llenar tamaños
                const formTam = document.getElementById("form-fl-tamano");
                formTam.innerHTML = "";
                for (const [tam, precio] of Object.entries(preciosFrutaLoca)) {
                    formTam.innerHTML += `
                         <label>
                             <input type="radio" name="fl-tam" value="${tam}" data-precio="${precio}">
                             ${tam} - $${precio}
                         </label>
                     `;
                }

                // Paso 1: Tamaño
                document.getElementById("paso-fl-tamano").style.display = "block";
            }

            modalFL.style.display = "flex";
        });
    });

    // Paso 0: Frutas (Solo Charola Loca)
    document.getElementById("form-fl-frutas").addEventListener("change", () => {
        const checks = document.querySelectorAll("#form-fl-frutas input:checked");
        const btn = document.getElementById("btn-next-fl-frutas");
        if (checks.length === 3) btn.classList.remove("btn-disabled");
        else btn.classList.add("btn-disabled");
    });

    document.getElementById("btn-next-fl-frutas").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-disabled")) return;
        document.getElementById("paso-fl-frutas").style.display = "none";
        document.getElementById("paso-fl-miguelito").style.display = "block";
    });

    // Step 1 -> 2
    document.getElementById("form-fl-tamano").addEventListener("change", () => {
        document.getElementById("btn-next-fl-tamano").classList.remove("btn-disabled");
    });
    document.getElementById("btn-next-fl-tamano").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-disabled")) return;
        document.getElementById("paso-fl-tamano").style.display = "none";
        document.getElementById("paso-fl-miguelito").style.display = "block";
    });

    // Step 2 -> 3
    document.getElementById("form-fl-miguelito").addEventListener("change", () => {
        document.getElementById("btn-next-fl-miguelito").classList.remove("btn-disabled");
    });
    document.getElementById("btn-next-fl-miguelito").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-disabled")) return;
        document.getElementById("paso-fl-miguelito").style.display = "none";
        document.getElementById("paso-fl-gomitas").style.display = "block";
    });

    // Finalizar FL
    document.getElementById("btn-add-fl").addEventListener("click", () => {
        const gomitaInput = document.querySelector("#form-fl-gomitas input:checked");
        if (!gomitaInput) {
            document.getElementById("error-fl-gomitas").style.display = "block";
            return;
        }

        const migInput = document.querySelector("#form-fl-miguelito input:checked");

        let nombreFinal = "";
        let precio = 0;

        if (isCharolaLoca) {
            const frutas = Array.from(document.querySelectorAll("#form-fl-frutas input:checked")).map(i => i.value).join(", ");
            nombreFinal = `Charola Loca (${frutas}) + Miguelito: ${migInput.value} + Gomitas: ${gomitaInput.value}`;
            precio = 40;
        } else {
            const tamInput = document.querySelector("#form-fl-tamano input:checked");
            nombreFinal = `Fruta Loca ${tamInput.value} + Miguelito: ${migInput.value} + Gomitas: ${gomitaInput.value}`;
            precio = parseInt(tamInput.dataset.precio);
        }

        agregarAlCarrito(nombreFinal, precio);
        modalFL.style.display = "none";
    });

    document.getElementById("cerrarFrutaLoca").addEventListener("click", () => modalFL.style.display = "none");


    // 4. Modal Rebanadas
    const modalRebanadas = document.getElementById("modal-rebanadas");
    document.querySelectorAll("[data-producto^='Pastel'], [data-producto^='Flan'], [data-producto^='Pay']").forEach(btn => {
        btn.addEventListener("click", () => {
            // Hardcodeo rápido de precios basado en texto del botón o HTML
            // Mejor: buscar en lista "Precios fijos" si existiera, o pasar precio en data-atribute (mas limpio)
            // Aquí haremos un switch rapido
            const prod = btn.dataset.producto;
            let precio = 45; // default
            if (prod.includes("Flan Napolitano")) precio = 30;
            if (prod.includes("Beso")) precio = 50;

            pRebanada = { nombre: prod, precio: precio };
            document.getElementById("titulo-rebanadas").textContent = prod;
            modalRebanadas.style.display = "flex";
        });
    });

    document.getElementById("btn-lechera-si").addEventListener("click", () => {
        agregarAlCarrito(pRebanada.nombre + " + Lechera", pRebanada.precio);
        modalRebanadas.style.display = "none";
    });
    document.getElementById("btn-lechera-no").addEventListener("click", () => {
        agregarAlCarrito(pRebanada.nombre, pRebanada.precio);
        modalRebanadas.style.display = "none";
    });
    document.getElementById("cerrarRebanadas").addEventListener("click", () => modalRebanadas.style.display = "none");


    // 5. Modal Gelatina Agua
    const modalAgua = document.getElementById("modal-agua");
    document.querySelector("[data-producto='Agua']").addEventListener("click", () => {
        const cont = document.getElementById("opciones-agua");
        cont.innerHTML = "";
        for (const [sabor, precio] of Object.entries(saboresAgua)) {
            const btn = document.createElement("button");
            btn.className = "btn-accion";
            btn.style.marginTop = "5px";
            btn.textContent = `${sabor} - $${precio}`;
            btn.onclick = () => {
                agregarAlCarrito(`Gelatina Agua ${sabor}`, precio);
                modalAgua.style.display = "none";
            };
            cont.appendChild(btn);
        }
        modalAgua.style.display = "flex";
    });
    document.getElementById("cerrarAgua").addEventListener("click", () => modalAgua.style.display = "none");


    // Close on out-click
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }

});
