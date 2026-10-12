package pe.edu.certus.norkys.model;

public class Comida extends ProductoBase {
    private boolean incluyeEnsalada;

    public Comida(int id, String nombre, double precioBase, boolean incluyeEnsalada) {
        super(id, nombre, precioBase);
        this.incluyeEnsalada = incluyeEnsalada;
    }

    @Override
public double obtenerPrecioFinal(boolean esDelivery) {
    double extraEnsalada = this.incluyeEnsalada ? 2.00 : 0.0;
    double recargoDelivery = esDelivery ? 3.00 : 0.0;
    return getPrecioBase() + extraEnsalada + recargoDelivery;
}
}