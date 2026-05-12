package br.com.CarSearch.carSearch_backend.model;

import java.util.List;

public record CarBodyDTO(
        String marca,
        String modelo,
        String versao,
        List<String> especificacoes
) {
}
