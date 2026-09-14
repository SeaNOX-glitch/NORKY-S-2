package pe.edu.certus.norkys;

import java.util.Scanner;

/**
 * Proyecto: Sistema de Pedidos y Verificación Norky's - Parte 2
 * Basado en los algoritmos exigidos en la Evidencia 2:
 * FOR, WHILE, DO-WHILE, vectores y matrices.
 */
public class SistemaPedidosNorkysAA2 {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // =========================================================
        // 1. ARREGLOS: VECTOR DE PRODUCTOS Y MATRIZ DE PRECIOS
        // =========================================================
        String[] productos = {
            "1/4 de Pollo con Papas y Ensalada",
            "1/2 Pollo con Papas y Ensalada",
            "1 Pollo Entero con Papas y Ensalada"
        };

        // [fila producto][0 = Local, 1 = Delivery]
        double[][] matrizPrecios = {
            {22.00, 24.00},
            {42.00, 45.00},
            {75.00, 78.00}
        };

        // Vector para historial de ventas de la sesión.
        double[] historialTotales = new double[100];
        int contadorPedidos = 0;

        String continuarAtencion = "S";

        System.out.println("==================================================");
        System.out.println(" SISTEMA DE PEDIDOS EN LINEA - POLLERIA NORKY'S ");
        System.out.println("==================================================");

        // =========================================================
        // 2. WHILE: PROCESAMIENTO MULTIPLE DE PEDIDOS
        //    Permite registrar varios pedidos en una sola sesión.
        // =========================================================
        while (continuarAtencion.equalsIgnoreCase("S") && contadorPedidos < historialTotales.length) {

            System.out.println("\n--- REGISTRO DE NUEVO PEDIDO ---");

            // FOR: mostrar catálogo desde el vector.
            System.out.println("Catalogo de productos disponibles:");
            for (int i = 0; i < productos.length; i++) {
                System.out.printf("%d. %s (Local: S/ %.2f | Delivery: S/ %.2f)%n",
                        i + 1, productos[i], matrizPrecios[i][0], matrizPrecios[i][1]);
            }

            // =====================================================
            // 3. DO-WHILE: VALIDACION DE OPCION
            //    Debe ejecutarse al menos una vez y repetir hasta
            //    obtener una opción entre 1 y 3.
            // =====================================================
            int opcionCombo = 0;
            do {
                System.out.print("Seleccione una opcion (1-3): ");

                // WHILE interno: limpia entradas no numéricas para
                // evitar un bucle infinito con Scanner.
                while (!scanner.hasNextInt()) {
                    System.out.print("Entrada invalida. Ingrese un numero (1-3): ");
                    scanner.next();
                }

                opcionCombo = scanner.nextInt();

                if (opcionCombo < 1 || opcionCombo > productos.length) {
                    System.out.println("Error: opcion fuera de rango. Reintente.");
                }
            } while (opcionCombo < 1 || opcionCombo > productos.length);

            // =====================================================
            // 4. DO-WHILE: VALIDACION DE CANTIDAD POSITIVA
            // =====================================================
            int cantidad = 0;
            do {
                System.out.print("Ingrese la cantidad deseada (minimo 1): ");

                while (!scanner.hasNextInt()) {
                    System.out.print("Entrada invalida. Ingrese un numero entero: ");
                    scanner.next();
                }

                cantidad = scanner.nextInt();

                if (cantidad <= 0) {
                    System.out.println("Error: la cantidad debe ser mayor a 0.");
                }
            } while (cantidad <= 0);

            // =====================================================
            // 5. WHILE: VALIDACION DEL TIPO DE ATENCION
            // =====================================================
            String tipoAtencion = "";
            while (!tipoAtencion.equalsIgnoreCase("L") &&
                   !tipoAtencion.equalsIgnoreCase("D")) {
                System.out.print("Seleccione modalidad [L=Local / D=Delivery]: ");
                tipoAtencion = scanner.next();

                if (!tipoAtencion.equalsIgnoreCase("L") &&
                    !tipoAtencion.equalsIgnoreCase("D")) {
                    System.out.println("Entrada invalida. Use L o D.");
                }
            }

            boolean esDelivery = tipoAtencion.equalsIgnoreCase("D");
            int columnaPrecio = esDelivery ? 1 : 0;
            double precioBase = matrizPrecios[opcionCombo - 1][columnaPrecio];

            // =====================================================
            // 6. CALCULOS DEL PEDIDO
            // =====================================================
            double subtotal = precioBase * cantidad;

            // Descuento del 10% si el subtotal supera S/ 120.
            double descuento = 0.0;
            if (subtotal > 120.0) {
                descuento = subtotal * 0.10;
            }

            // Delivery gratis si subtotal > S/ 80; si no, S/ 8.
            double costoEnvio = 0.0;
            if (esDelivery) {
                if (subtotal > 80.0) {
                    costoEnvio = 0.00;
                } else {
                    costoEnvio = 8.00;
                }
            }

            double totalPagar = (subtotal - descuento) + costoEnvio;

            // Guardar el total en el vector de historial.
            historialTotales[contadorPedidos] = totalPagar;
            contadorPedidos++;

            System.out.println("\n---------------------------------------");
            System.out.println(" RESUMEN DE FACTURACION NORKY'S ");
            System.out.println("---------------------------------------");
            System.out.println("Producto: " + productos[opcionCombo - 1]);
            System.out.println("Cantidad: " + cantidad);
            System.out.printf("Subtotal: S/ %.2f%n", subtotal);
            System.out.printf("Descuento 10%%: S/ %.2f%n", descuento);
            System.out.printf("Costo de envio: S/ %.2f%n", costoEnvio);
            System.out.printf("TOTAL A PAGAR: S/ %.2f%n", totalPagar);
            System.out.println("---------------------------------------");

            // =====================================================
            // 7. DO-WHILE: VALIDACION DE CONTINUACION
            // =====================================================
            do {
                System.out.print("Desea registrar otro pedido? [S/N]: ");
                continuarAtencion = scanner.next();
                if (!continuarAtencion.equalsIgnoreCase("S") &&
                    !continuarAtencion.equalsIgnoreCase("N")) {
                    System.out.println("Entrada invalida. Use S o N.");
                }
            } while (!continuarAtencion.equalsIgnoreCase("S") &&
                     !continuarAtencion.equalsIgnoreCase("N"));
        }

        // =========================================================
        // 8. FOR: REPORTE E HISTORIAL CON ACUMULADORES
        // =========================================================
        double totalFacturado = 0.0;

        for (int i = 0; i < contadorPedidos; i++) {
            totalFacturado += historialTotales[i];
        }

        double promedioVentas = contadorPedidos > 0
                ? totalFacturado / contadorPedidos
                : 0.0;

        System.out.println("\n==================================================");
        System.out.println(" REPORTE FINAL DE LA SESION - NORKY'S ");
        System.out.println("==================================================");
        System.out.println("Pedidos registrados: " + contadorPedidos);
        System.out.printf("Total facturado: S/ %.2f%n", totalFacturado);
        System.out.printf("Promedio por pedido: S/ %.2f%n", promedioVentas);
        System.out.println("==================================================");

        scanner.close();
    }
}
