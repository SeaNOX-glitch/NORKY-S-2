// ==========================================
// 1. CLASE MODELO: Producto
// ==========================================
class Producto {
    // Encapsulamiento con atributos privados (ES2019+)
    #id;
    #nombre;
    #precioLocal;
    #precioDelivery;
    #description;

    constructor(id, nombre, precioLocal, precioDelivery, description = "") {
        this.#id = id;
        this.#nombre = nombre;
        this.#precioLocal = precioLocal;
        this.#precioDelivery = precioDelivery;
        this.#description = description;
    }

    // Getters
    getId() { return this.#id; }
    getNombre() { return this.#nombre; }
    getPrecioLocal() { return this.#precioLocal; }
    getPrecioDelivery() { return this.#precioDelivery; }
    getDescription() { return this.#description; }

    // Método para obtener precio según canal
    getPrecioPorModo(esDelivery) {
        return esDelivery ? this.#precioDelivery : this.#precioLocal;
    }
}

// ==========================================
// 2. CLASE MODELO: Pedido (Reglas de Negocio)
// ==========================================
class Pedido {
    #producto;
    #cantidad;
    #esDelivery;
    #esSocio;
    #pagoBilletera;

    constructor(producto, cantidad, esDelivery, esSocio, pagoBilletera) {
        this.#producto = producto;
        this.#cantidad = cantidad;
        this.#esDelivery = esDelivery;
        this.#esSocio = esSocio;
        this.#pagoBilletera = pagoBilletera;
    }

    // Métodos con algoritmos de cálculo
    calcularSubtotal() {
        const precioUnitario = this.#producto.getPrecioPorModo(this.#esDelivery);
        return precioUnitario * this.#cantidad;
    }

    calcularDescuentoConsumo() {
        const subtotal = this.calcularSubtotal();
        return subtotal > 120.0 ? subtotal * 0.10 : 0.0;
    }

    calcularCostoEnvio() {
        if (!this.#esDelivery) return 0.0;
        return this.calcularSubtotal() > 80.0 ? 0.00 : 8.00;
    }

    calcularDescuentoBilletera() {
        if (!this.#pagoBilletera) return 0.0;
        const parcial = (this.calcularSubtotal() - this.calcularDescuentoConsumo()) + this.calcularCostoEnvio();
        return parcial * 0.05;
    }

    calcularTotalFinal() {
        const parcial = (this.calcularSubtotal() - this.calcularDescuentoConsumo()) + this.calcularCostoEnvio();
        return parcial - this.calcularDescuentoBilletera();
    }

    calcularPuntos() {
        const total = this.calcularTotalFinal();
        const factor = this.#esSocio ? 2 : 1;
        return Math.floor(total / 10) * factor;
    }

    // Retorna objeto formateado para la vista
    obtenerResumen() {
        return {
            nombreProducto: this.#producto.getNombre(),
            cantidad: this.#cantidad,
            subtotal: this.calcularSubtotal().toFixed(2),
            descMonto: this.calcularDescuentoConsumo().toFixed(2),
            costoEnvio: this.calcularCostoEnvio().toFixed(2),
            descBilletera: this.calcularDescuentoBilletera().toFixed(2),
            puntos: this.calcularPuntos(),
            totalFinal: this.calcularTotalFinal().toFixed(2)
        };
    }
}

// ==========================================
// 3. CLASE GESTORA: SistemaNorkys (Gestión de Estado)
// ==========================================
class SistemaNorkys {
    constructor() {
        // Catálogo de objetos Producto
        this.catalogo = [
            new Producto(1, "1/4 de Pollo con Papas y Ensalada", 22.00, 24.00, "Porción personal"),
            new Producto(2, "1/2 Pollo con Papas y Ensalada", 42.00, 45.00, "Ideal para compartir"),
            new Producto(3, "1 Pollo Entero con Papas y Ensalada", 75.00, 78.00, "Para disfrutar en familia")
        ];
        this.historialPedidos = [];
    }

    obtenerProductoPorId(id) {
        return this.catalogo.find(p => p.getId() === id);
    }

    procesarPedido(opcionCombo, cantidad, esDelivery, esSocio, pagoBilletera) {
        const producto = this.obtenerProductoPorId(opcionCombo);
        if (!producto || cantidad <= 0) return null;

        const nuevoPedido = new Pedido(producto, cantidad, esDelivery, esSocio, pagoBilletera);
        this.historialPedidos.push(nuevoPedido);

        return nuevoPedido.obtenerResumen();
    }
}

// ==========================================
// 4. INSTANCIACIÓN Y MANEJO DEL DOM
// ==========================================
const sistema = new SistemaNorkys();

document.getElementById('orderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const opcionCombo = parseInt(document.getElementById('producto').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const esDelivery = document.getElementById('esDelivery').checked;
    const esSocio = document.getElementById('esSocio').checked;
    const pagoBilletera = document.getElementById('pagoBilletera').checked;

    // Ejecución a través del objeto gestor
    const resumen = sistema.procesarPedido(opcionCombo, cantidad, esDelivery, esSocio, pagoBilletera);

    if (resumen) {
        const divResultado = document.getElementById('resultado');
        divResultado.classList.remove('hidden');
        divResultado.innerHTML = `
            <h3>RESUMEN DE FACTURACIÓN NORKY'S (POO)</h3>
            <p><strong>Producto:</strong> ${resumen.nombreProducto}</p>
            <p><strong>Cantidad:</strong> ${resumen.cantidad}</p>
            <p><strong>Subtotal:</strong> S/ ${resumen.subtotal}</p>
            <p><strong>Descuento Consumo Alto:</strong> S/ ${resumen.descMonto}</p>
            <p><strong>Costo de Envío:</strong> S/ ${resumen.costoEnvio}</p>
            <p><strong>Descuento Yape/Plin:</strong> S/ ${resumen.descBilletera}</p>
            <p><strong>Puntos Ganados:</strong> ${resumen.puntos} pts</p>
            <h2>TOTAL A PAGAR: S/ ${resumen.totalFinal}</h2>
        `;
    }
});