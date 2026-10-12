package pe.edu.certus.norkys.model;

/**
 * CONCEPTO POO: CLASE PEDIDO E IMPLEMENTACIÓN DE INTERFACES (Herencia Múltiple de Interfaces)
 */
public class Pedido implements Evaluable, Promocionable {
    private ProductoBase producto;
    private int cantidad;
    private boolean esDelivery;
    private boolean esSocio;
    private boolean pagoBilletera;

    // Constructor por defecto
    public Pedido() {}

    // Constructor parametrizado
    public Pedido(ProductoBase producto, int cantidad, boolean esDelivery, boolean esSocio, boolean pagoBilletera) {
        this.producto = producto;
        setCantidad(cantidad);
        this.esDelivery = esDelivery;
        this.esSocio = esSocio;
        this.pagoBilletera = pagoBilletera;
    }

    @Override
    public double calcularSubtotal() {
        if (producto == null) return 0.0;
        return producto.obtenerPrecioFinal(esDelivery) * cantidad;
    }

    @Override
    public double calcularDescuentoConsumo() {
        double subtotal = calcularSubtotal();
        return (subtotal > 120.0) ? (subtotal * 0.10) : 0.0;
    }

    public double calcularCostoEnvio() {
        if (!esDelivery) return 0.0;
        return (calcularSubtotal() > 80.0) ? 0.0 : 8.00;
    }

    @Override
    public double calcularDescuentoBilletera() {
        if (!pagoBilletera) return 0.0;
        double parcial = (calcularSubtotal() - calcularDescuentoConsumo()) + calcularCostoEnvio();
        return parcial * 0.05;
    }

    public double calcularTotalFinal() {
        double parcial = (calcularSubtotal() - calcularDescuentoConsumo()) + calcularCostoEnvio();
        return parcial - calcularDescuentoBilletera();
    }

    public int calcularPuntos() {
        double total = calcularTotalFinal();
        int factor = esSocio ? 2 : 1;
        return ((int) (total / 10)) * factor;
    }

    // Getters y Setters
    public ProductoBase getProducto() { return producto; }
    public void setProducto(ProductoBase producto) { this.producto = producto; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) {
        this.cantidad = (cantidad > 0) ? cantidad : 1;
    }

    public boolean isEsDelivery() { return esDelivery; }
    public void setEsDelivery(boolean esDelivery) { this.esDelivery = esDelivery; }

    public boolean isEsSocio() { return esSocio; }
    public void setEsSocio(boolean esSocio) { this.esSocio = esSocio; }

    public boolean isPagoBilletera() { return pagoBilletera; }
    public void setPagoBilletera(boolean pagoBilletera) { this.pagoBilletera = pagoBilletera; }
}