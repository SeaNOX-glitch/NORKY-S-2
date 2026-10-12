package pe.edu.certus.norkys.model;

public class Bebida extends ProductoBase {
    private boolean esHelada;

    public Bebida(int id, String nombre, double precioBase, boolean esHelada) {
        super(id, nombre, precioBase);
        this.esHelada = esHelada;
    }

    @Override
    public double obtenerPrecioFinal(boolean esDelivery) {
        double extraHelada = this.esHelada ? 1.00 : 0.0;
        return getPrecioBase() + extraHelada;
    }
}