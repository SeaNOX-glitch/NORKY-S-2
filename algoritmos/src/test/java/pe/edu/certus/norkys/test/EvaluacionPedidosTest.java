package pe.edu.certus.norkys.test;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EvaluacionPedidosTest {

    @Test
    public void testCostoEnvioGratis() {
        double subtotal = 150.0;
        boolean esDelivery = true;
        double costoEnvioActual = (esDelivery && subtotal > 80.0) ? 0.0 : 8.0;
        assertEquals(0.0, costoEnvioActual, 0.001);
    }

    @Test
    public void testCostoEnvioEstandar() {
        double subtotal = 50.0;
        boolean esDelivery = true;
        double costoEnvioActual = (esDelivery && subtotal > 80.0) ? 0.0 : 8.0;
        assertEquals(8.0, costoEnvioActual, 0.001);
    }

    @Test
    public void testDescuentoConsumoAlto() {
        double subtotal = 150.0;
        double descuentoCalculado = subtotal > 120.0 ? subtotal * 0.10 : 0.0;
        assertEquals(15.0, descuentoCalculado, 0.001);
    }
}
