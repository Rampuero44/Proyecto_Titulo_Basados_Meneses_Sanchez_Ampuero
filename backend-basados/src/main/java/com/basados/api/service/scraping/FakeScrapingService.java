package com.basados.api.service.scraping;

import com.basados.api.entity.Producto;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class FakeScrapingService
        implements ScrapingService {

    private final Random random =
            new Random();

    @Override
    public String getNombreComercio() {

        return "Fake";
    }

    @Override
    public ScrapingResultado buscarProducto(
            Producto producto
    ) {

        ScrapingResultado resultado =
                new ScrapingResultado();

        resultado.setNombreProducto(
                producto.getNombre()
        );

        boolean disponible =
                productoDisponible();

        resultado.setDisponible(
                disponible
        );

        if (disponible) {

            resultado.setPrecio(
                    obtenerPrecioFake(
                            producto
                    )
            );

        } else {

            resultado.setPrecio(null);
        }

        resultado.setUrlProducto(
                "https://fake-store.cl/producto/"
                        + producto.getIdProducto()
        );

        return resultado;
    }

    private BigDecimal obtenerPrecioFake(
            Producto producto
    ) {

        BigDecimal base =
                producto.getPrecioReferencia() != null
                        ? producto.getPrecioReferencia()
                        : BigDecimal.valueOf(3000);

        int variacion =
                random.nextInt(2000) - 1000;

        return base.add(
                BigDecimal.valueOf(
                        variacion
                )
        );
    }

    private boolean productoDisponible() {

        return random.nextInt(100) > 20;
    }
}