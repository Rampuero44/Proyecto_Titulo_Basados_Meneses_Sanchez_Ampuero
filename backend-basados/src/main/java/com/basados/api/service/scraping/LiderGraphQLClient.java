package com.basados.api.service.scraping;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class LiderGraphQLClient {

    private final WebClient webClient =
            WebClient.builder()
                    .baseUrl(
                            "https://super.lider.cl"
                    )
                    .defaultHeader(
                            "User-Agent",
                            "Mozilla/5.0"
                    )
                    .defaultHeader(
                            "X-APOLLO-OPERATION-NAME",
                            "Search"
                    )
                    .defaultHeader(
                            "x-o-gql-query",
                            "query Search"
                    )
                    .build();

    public String buscarProductos(
            String textoBusqueda
    ) {

        Map<String, Object> variables =
                new HashMap<>();

        variables.put(
                "query",
                textoBusqueda
        );

        variables.put(
                "page",
                1
        );

        variables.put(
                "prg",
                "desktop"
        );

        variables.put(
                "ps",
                40
        );

        variables.put(
                "sort",
                "best_match"
        );

        Map<String, Object> body =
                new HashMap<>();

        body.put(
                "query",
                """
                query Search(
                  $query:String
                  $page:Int
                  $prg:String
                  $ps:Int
                  $sort:String
                ){
                  search(
                    query:$query
                    page:$page
                    prg:$prg
                    ps:$ps
                    sort:$sort
                  ){
                    query
                  }
                }
                """
        );

        body.put(
                "variables",
                variables
        );

        return webClient.post()
                .uri(
                        "/orchestra/graphql/search"
                )
                .contentType(
                        MediaType.APPLICATION_JSON
                )
                .bodyValue(
                        body
                )
                .retrieve()
                .bodyToMono(
                        String.class
                )
                .block();
    }
}