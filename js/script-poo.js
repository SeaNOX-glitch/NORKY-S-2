/**
 * ============================================================================
 * CONCEPTO POO: PAQUETES / MÓDULOS
 * Simulación del paquete "pe.edu.certus.norkys.model" mediante un Módulo de ES6
 * ============================================================================
 */
const PeEduCertusNorkysModel = (() => {

    /**
     * ============================================================================
     * CONCEPTO POO: CLASE Y OBJETO (Entidad Producto)
     * Representa la plantilla de los ítems del menú de Norky's.
     * ============================================================================
     */
    class Producto {
        // CONCEPTO POO: ENCAPSULAMIENTO
        // Atributos privados marcados con # (ES2019+) para proteger los datos
        #id;
        #nombre;
        #precioLocal;
        #precioDelivery;

        /**
         * CONCEPTO POO: CONSTRUCTOR
         * Inicializa las propiedades del objeto de forma segura y validada.
         */
        constructor(id, nombre, precioLocal, precioDelivery) {
            this.#id = id;
            this.#nombre = nombre;
            this.setPrecioLocal(precioLocal);
            this.setPrecioDelivery(precioDelivery);
        }

        // CONCEPTO POO: ENCAPSULAMIENTO - Métodos de acceso (Getters y Setters)
        getId() {
            return this.#id;
        }

        getNombre() {
            return this.#nombre;
        }

        getPrecioLocal() {
            return this.#precioLocal;
        }

        setPrecioLocal(precio) {
            if (precio >= 0) {
                this.#precioLocal = precio;
            } else {
                console.error("Error: El precio local no puede ser negativo.");
            }
        }

        getPrecioDelivery() {
            return this.#precioDelivery;
        }

        setPrecioDelivery(precio) {
            if (precio >= 0) {
                this.#precioDelivery = precio;
            } else {
                console.error("Error: El precio de delivery no puede ser negativo.");
            }
        }

        // Método de conveniencia para la lógica de canales
        obtenerPrecioUnitario(esDelivery) {
            return esDelivery ? this.#precioDelivery : this.#precioLocal;
        }
    }

    /**
     * ============================================================================
     * CONCEPTO POO: CLASE Y OBJETO (Entidad Pedido)
     * Centraliza la orden de compra y aplica los algoritmos comerciales de Norky's.
     * ============================================================================
     */
    class Pedido {
        // CONCEPTO POO: ENCAPSULAMIENTO
        #producto;
        #cantidad;
        #esDelivery;
        #esSocio;
        #pagoBilletera;

        /**
         * CONCEPTO POO: CONSTRUCTOR PARAMETRIZADO
         */
        constructor(producto, cantidad, esDelivery, esSocio, pagoBilletera) {
            this.#producto = producto;
            this.setCantidad(cantidad);
            this.#esDelivery = esDelivery;
            this.#esSocio = esSocio;
            this.#pagoBilletera = pagoBilletera;
        }

        // ALGORITMOS DE NEGOCIO ENCAPSULADOS EN LA CLASE

        calcularSubtotal() {
            if (!this.#producto) return 0.0;
            const precioUnitario = this.#producto.obtenerPrecioUnitario(this.#esDelivery);
            return precioUnitario * this.#cantidad;
        }

        calcularDescuentoConsumo() {
            const subtotal = this.calcularSubtotal();
            return (subtotal > 120.0) ? (subtotal * 0.10) : 0.0;
        }

        calcularCostoEnvio() {
            if (!this.#esDelivery) return 0.0;
            return (this.calcularSubtotal() > 80.0) ? 0.0 : 8.00;
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

        // CONCEPTO POO: ENCAPSULAMIENTO - Getters y Setters
        getProducto() { return this.#producto; }
        getCantidad() { return this.#cantidad; }
        
        setCantidad(cantidad) {
            if (cantidad > 0) {
                this.#cantidad = cantidad;
            } else {
                console.warn("Advertencia: Cantidad no válida. Se asigna 1 por defecto.");
                this.#cantidad = 1;
            }
        }

        // Método que exporta el resumen de datos formateado
        obtenerResumenDetallado() {
            return {
                nombreProducto: this.#producto.getNombre(),
                cantidad: this.#cantidad,
                subtotal: this.calcularSubtotal().toFixed(2),
                descConsumo: this.calcularDescuentoConsumo().toFixed(2),
                costoEnvio: this.calcularCostoEnvio().toFixed(2),
                descBilletera: this.calcularDescuentoBilletera().toFixed(2),
                puntos: this.calcularPuntos(),
                totalFinal: this.calcularTotalFinal().toFixed(2)
            };
        }
    }

    // Exportación pública del módulo (Equivalente al contenido del paquete Java)
    return {
        Producto: Producto,
        Pedido: Pedido
    };
})();

/**
 * ============================================================================
 * INSTANCIACIÓN DE OBJETOS Y EJECUCIÓN DEL MÓDULO POO
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    // Referencia a las Clases importadas desde el Paquete/Módulo
    const { Producto, Pedido } = PeEduCertusNorkysModel;

    // CONCEPTO POO: CLASE Y OBJETO - Instanciación del Catálogo de Productos
    const catalogoProductos = [
        new Producto(1, "1/4 de Pollo con Papas y Ensalada", 22.00, 24.00),
        new Producto(2, "1/2 Pollo con Papas y Ensalada", 42.00, 45.00),
        new Producto(3, "1 Pollo Entero con Papas y Ensalada", 75.00, 78.00)
    ];

    console.log("Módulo POO de Pollería Norky's inicializado correctamente.");

    // Escuchador de eventos del formulario (Si existe en la interfaz web)
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const opcionCombo = parseInt(document.getElementById('producto')?.value || 1);
            const cantidad = parseInt(document.getElementById('cantidad')?.value || 1);
            const esDelivery = document.getElementById('esDelivery')?.checked || false;
            const esSocio = document.getElementById('esSocio')?.checked || false;
            const pagoBilletera = document.getElementById('pagoBilletera')?.checked || false;

            // Buscar el objeto Producto mediante el ID elegido
            const productoSeleccionado = catalogoProductos.find(p => p.getId() === opcionCombo);

            if (productoSeleccionado) {
                // CONCEPTO POO: Instanciación de Objeto Pedido usando el CONSTRUCTOR PARAMETRIZADO
                const nuevoPedido = new Pedido(productoSeleccionado, cantidad, esDelivery, esSocio, pagoBilletera);
                const resumen = nuevoPedido.obtenerResumenDetallado();

                // Renderizar en el HTML
                const divResultado = document.getElementById('resultado');
                if (divResultado) {
                    divResultado.classList.remove('hidden');
                    divResultado.innerHTML = `
                        <h3>RESUMEN DE FACTURACIÓN NORKY'S (POO)</h3>
                        <p><strong>Producto:</strong> ${resumen.nombreProducto}</p>
                        <p><strong>Cantidad:</strong> ${resumen.cantidad}</p>
                        <p><strong>Subtotal:</strong> S/ ${resumen.subtotal}</p>
                        <p><strong>Descuento Consumo Alto (10%):</strong> S/ ${resumen.descConsumo}</p>
                        <p><strong>Costo de Envío:</strong> S/ ${resumen.costoEnvio}</p>
                        <p><strong>Descuento Yape/Plin (5%):</strong> S/ ${resumen.descBilletera}</p>
                        <p><strong>Puntos Ganados:</strong> ${resumen.puntos} pts</p>
                        <h2>TOTAL A PAGAR: S/ ${resumen.totalFinal}</h2>
                    `;
                }
            }
        });
    }
});