package br.com.CarSearch.carSearch_backend.model;

import java.util.List;

public record CarDTO(
        String marca,
        String modelo,
        String versao,
        List<EspecDTO> especificacoes
) {
}
