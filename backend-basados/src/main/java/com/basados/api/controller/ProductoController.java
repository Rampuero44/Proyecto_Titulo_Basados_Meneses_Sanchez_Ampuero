package com.basados.api.controller;

import com.basados.api.dto.ProductoResponseDTO;
import com.basados.api.entity.Producto;
import com.basados.api.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<ProductoResponseDTO> listarProductos() {

        List<Producto> productos = productoRepository.findAll();

        return productos.stream().map(producto ->

            new ProductoResponseDTO(

                producto.getIdProducto(),

                producto.getNombre(),

                producto.getCategoria() != null
                    ? producto.getCategoria().getNombre()
                    : null,

                producto.getMarca() != null
                    ? producto.getMarca().getNombre()
                    : null,

                producto.getCalorias(),

                producto.getAlcoholico()

            )

        ).toList();
    }
}