package com.basados.api.service.scraping;

import com.basados.api.entity.Producto;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Random;

@Service
public class JumboScrapingService
        implements ScrapingService {

    private final Random random =
            new Random();

    @Override
    public String getNombreComercio() {

        return "Jumbo";
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
                random.nextInt(100) > 10;

        resultado.setDisponible(
                disponible
        );

        if (disponible) {

            BigDecimal base =
                    producto.getPrecioReferencia() != null
                            ? producto.getPrecioReferencia()
                            : BigDecimal.valueOf(3000);

            int variacion =
                    random.nextInt(1500);

            resultado.setPrecio(
                    base.add(
                            BigDecimal.valueOf(
                                    variacion
                            )
                    )
            );

        } else {

            resultado.setPrecio(null);
        }

        resultado.setUrlProducto(
                "https://jumbo.cl/producto/"
                        + producto.getIdProducto()
        );

        return resultado;
    }
}