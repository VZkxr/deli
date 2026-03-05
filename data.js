// === data.js ===
// Archivo central para configuración de productos y precios

const configPrecios = {
    conCrema: {
        "Fresas": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Uvas": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Durazno": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Manzana": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Zarzamora": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Con Yogurth": { "Ch.": 35, "Med.": 40, "Gr.": 50, "1/2": 85 },
        "Lagrimitas": { "Ch.": 10, "Gr.": 15 },
        "Coffe": { "Ch.": 12, "Gr.": 15 },
        "Arroz con Leche": { "Ch.": 30, "Med.": 35, "Gr.": 45, "1/2": 85 }
    },
    vellana: {
        "Fresas": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Durazno": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Uvas": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Manzana": { "Ch.": 55, "Med.": 65, "Gr.": 90 },
        "Zarzamora": { "Ch.": 55, "Med.": 65, "Gr.": 90 }
    },
    frutaLoca: {
        "Ch.": 30,
        "Med.": 35,
        "Gr.": 45,
        "Tazón": 60
    },
    oreo: { "Ch.": 55, "Med.": 65, "Gr.": 90 },
    brownie: { "Ch.": 65, "Med.": 75, "Gr.": 110 },
    cheescake: { "Ch.": 65, "Med.": 75, "Gr.": 110 },
    deliFresa: { "Ch.": 70, "Med.": 80, "Gr.": 115 },
    agua: {
        "Uva": 10,
        "Fresa": 10,
        "Mora Azul": 10,
        "Grosella": 10,
        "Limón": 10
    },
    fijos: {
        "Gelatina Yogurth": 30,
        "Gelatina de Rompope": 20,
        "Gelatina de Chamoy": 20,
        "Tres Leches de Durazno": 28,
        "Flan Casero de Vainilla": 15,
        "Flan Napolitano": 30,
        "Pay de Limón": 45,
        "Pastel Imposible": 45,
        "Pastel de Chocolate": 45,
        "Pastel de Beso de Angel": 50,
        "Pastel de Oreo de 3 leches": 50,
        "Pastel de 3 leches": 40,
        "Maruchan": 25,
        "Cigarros": 7
    },
    extras: {
        "Hershey's extra": 3,
        "Avellana extra": 3,
        "Cheescake": 5,
        "Galleta Brownie": 5
    }
};

const listasToppings = {
    general: [
        "Kranky", "Chispas de colores", "Chispas de chocolate", "Nuez", "Pasas", "Granola", "Canela", "Lechera", "Chantilli", "Ninguno",
        "Hershey's extra", "Avellana extra", "Cheescake", "Galleta Brownie"
    ],
    deliFresa: [
        "Cubitos Cheescake", "Galleta Brownie", "Galleta Oreo"
    ],
    jarabes: [
        "Mermelada", "Hershey's", "Avellana", "Lechera", "Ninguno"
    ]
};

// --- Datos para Renderizar HTML en index.html ---
const menuRenderData = {
    frutaLoca: [
        { nombre: "Fresas", img: "img/f_loca/fresas.jpg", desc: "Las clásicas fresas de D'eli postres, bañadas en Chamoy y Tajín.", tipo: "fruta-loca" },
        { nombre: "Manzana", img: "img/f_loca/manzana.jpg", desc: "Finos cortes de manzana, acompañados con la base de Chamoy y Tajín.", tipo: "fruta-loca" },
        { nombre: "Uvas", img: "img/f_loca/uvas.jpg", desc: "Uvas tan dulces que se integran de forma intensa al Chamoy y al Tajín.", tipo: "fruta-loca" },
        { nombre: "Charola loca", img: "img/con_crema/char.png", desc: "Arma tu trinidad de 3 productos a elegir entre fresas, manzana y uvas, con una cobertura de Chamoy y Tajín.", tipo: "charola-loca", precioHTML: '<span class="precio">$40</span>' }
    ],
    conCremaVaso: [
        { nombre: "Fresas", img: "img/con_crema/fresas.png", desc: "Deliciosas fresas cubiertas de receta secreta." },
        { nombre: "Uvas", img: "img/con_crema/uvas.png", desc: "Uvas de calidad, escogidas con amor por D'eli." },
        { nombre: "Durazno", img: "img/con_crema/duraznos.png", desc: "Corte de duraznos finos, entregados para alguien con el mismo adjetivo." },
        { nombre: "Manzana", img: "img/con_crema/manzanas.png", desc: "Por qué esperar fiestas de diciembre, los placeres de la ensalada de manzana comienzan hoy." },
        { nombre: "Zarzamora", img: "img/con_crema/zarzamora.png", desc: "Un postre peculiar con un sabor inigualable gracias a la calidad de la zarzamora." }
    ],
    conCremaVellana: [
        { nombre: "Fresas", img: "img/vellana/fresas.png", desc: "Deliciosas fresas cubiertas de receta secreta." },
        { nombre: "Uvas", img: "img/vellana/uvas.png", desc: "Uvas de calidad, escogidas con amor por D'eli." },
        { nombre: "Durazno", img: "img/vellana/duraznos.png", desc: "Corte de duraznos finos, entregados para alguien con el mismo adjetivo." },
        { nombre: "Manzana", img: "img/vellana/manzana.png", desc: "Por qué esperar fiestas de diciembre, los placeres de la ensalada de manzana comienzan hoy." },
        { nombre: "Zarzamora", img: "img/vellana/zarzamoras.png", desc: "Un postre peculiar con un sabor inigualable gracias a la calidad de la zarzamora." }
    ],
    conCremaOreo: [
        { nombre: "Fresas", img: "img/deli.png", desc: "Disfruta el sabor base combinado con oreo." },
        { nombre: "Uvas", img: "img/deli.png", desc: "Disfruta el sabor base combinado con oreo." },
        { nombre: "Durazno", img: "img/deli.png", desc: "Disfruta el sabor base combinado con oreo." },
        { nombre: "Manzana", img: "img/deli.png", desc: "Disfruta el sabor base combinado con oreo." },
        { nombre: "Zarzamora", img: "img/deli.png", desc: "Disfruta el sabor base combinado con oreo." }
    ],
    conCremaBrownie: [
        { nombre: "Fresas", img: "img/deli.png", desc: "Brownie casero para acompañar." },
        { nombre: "Uvas", img: "img/deli.png", desc: "Brownie casero para acompañar." },
        { nombre: "Durazno", img: "img/deli.png", desc: "Brownie casero para acompañar." },
        { nombre: "Manzana", img: "img/deli.png", desc: "Brownie casero para acompañar." },
        { nombre: "Zarzamora", img: "img/deli.png", desc: "Brownie casero para acompañar." }
    ],
    conCremaCheesecake: [
        { nombre: "Fresas", img: "img/deli.png", desc: "Cubitos de cheescake D'eli extra suaves." },
        { nombre: "Uvas", img: "img/deli.png", desc: "Cubitos de cheescake D'eli extra suaves." },
        { nombre: "Durazno", img: "img/deli.png", desc: "Cubitos de cheescake D'eli extra suaves." },
        { nombre: "Manzana", img: "img/deli.png", desc: "Cubitos de cheescake D'eli extra suaves." },
        { nombre: "Zarzamora", img: "img/deli.png", desc: "Cubitos de cheescake D'eli extra suaves." }
    ],
    conCremaDeliFresa: [
        { nombre: "Fresas", img: "img/deli.png", desc: "Vaso con cubierta de avellana." },
        { nombre: "Uvas", img: "img/deli.png", desc: "Vaso con cubierta de avellana." },
        { nombre: "Durazno", img: "img/deli.png", desc: "Vaso con cubierta de avellana." },
        { nombre: "Manzana", img: "img/deli.png", desc: "Vaso con cubierta de avellana." },
        { nombre: "Zarzamora", img: "img/deli.png", desc: "Vaso con cubierta de avellana." }
    ],
    gelatinas: [
        { nombre: "Con Yogurth", img: "img/gelatinas/yogurth.png", desc: "Gelatina con yogurth cremosa y fresca en sus distintas presentaciones.", precioHTML: '<span class="precio">$30<</span>' },
        { nombre: "Agua", titulo: "De Agua", img: "img/gelatinas/agua.jpg", desc: "Gelatina de agua preparada con la delicadeza del buen equilibrio.", precioHTML: '<span class="precio">$10</span>' },
        { nombre: "Tres Leches de Durazno", img: "img/gelatinas/durazno.jpg", desc: "La mejor gelatina la tenemos en D'eli.", precioHTML: '<span class="precio">$28</span>' },
        { nombre: "Flan Casero de Vainilla", img: "img/gelatinas/vainilla.jpg", desc: "Explora los sabores de la gloria con este delicioso flan casero de vainilla.", precioHTML: '<span class="precio">$15</span>' }
    ],
    rebanadas: [
        { nombre: "Flan Napolitano", img: "img/rebanadas/flan.jpg", desc: "Delicioso flan casero con caramelo suave.", precioHTML: '<span class="precio">$30</span>' },
        { nombre: "Pay de Limón", img: "img/rebanadas/pay.jpg", desc: "Pay de Limón hecho con los mejores ingredientes.", precioHTML: '<span class="precio">$45</span>' },
        { nombre: "Pastel Imposible", img: "img/rebanadas/imposible.jpg", desc: "Pastel posible hecho por D'eli.", precioHTML: '<span class="precio">$45</span>' },
        { nombre: "Pastel de Chocolate", img: "img/rebanadas/choco.jpg", desc: "Pastel de chocolate real, hecho solo para la realeza.", precioHTML: '<span class="precio">$45</span>' },
        { nombre: "Pastel de Beso de Angel", img: "img/rebanadas/beso.jpg", desc: "Esta deliciosa rebanada de tres leches relleno de flan es una nueva experiencia.", precioHTML: '<span class="precio">$50</span>' }
    ],
    extras: [
        { nombre: "Arroz con Leche", img: "img/extras/arroz.jpg", desc: "El clásico postre casero con el toque especial de D'eli.", precioHTML: '<span class="precio">$30<</span>', tipo: "vaso" },
        { nombre: "Lagrimitas", img: "img/extras/lagr.jpg", desc: "Vuelve a lo clásico con esta deliciosa botana tradicional acompañada de crema y salsa.", objPrecios: configPrecios.conCrema["Lagrimitas"] },
        { nombre: "Maruchan", img: "img/extras/maruchan.jpg", desc: "La comida preferida por los estudiantes, averigua el porqué.", precioHTML: '<span class="precio">$25</span>' },
        { nombre: "Coffe", titulo: "Café", img: "img/extras/cafe.jpg", desc: "Despierta tu día y noche con un buen sorbo de la bebida de los dioses modernos.", objPrecios: configPrecios.conCrema["Coffe"] },
        { nombre: "Cigarros", img: "img/extras/cigar.jpg", desc: "Producto aún no clasificado.", precioHTML: '<span class="precio">$7</span>' }
    ]
};
