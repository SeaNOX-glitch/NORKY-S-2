package pe.edu.certus.norkys.model;

public abstract class ProductoBase {
    private int id;
    private String nombre;
    private double precioBase;

    public ProductoBase() {}

    public ProductoBase(int id, String nombre, double precioBase) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public double getPrecioBase() { return precioBase; }
    public void setPrecioBase(double precioBase) {
        if (precioBase >= 0) this.precioBase = precioBase;
    }

    // Método abstracto (Polimorfismo)
    public abstract double obtenerPrecioFinal(boolean esDelivery);
}