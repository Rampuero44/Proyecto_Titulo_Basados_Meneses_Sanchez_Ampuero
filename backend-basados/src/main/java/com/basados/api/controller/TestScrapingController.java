package com.basados.api.controller;

import com.basados.api.service.scraping.LiderGraphQLClient;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestScrapingController {

    private final LiderGraphQLClient liderClient;

    public TestScrapingController(
            LiderGraphQLClient liderClient
    ) {

        this.liderClient =
                liderClient;
    }

    @GetMapping("/lider")
    public String testLider(
            @RequestParam String query
    ) {

        return liderClient.buscarProductos(
                query
        );
    }
}