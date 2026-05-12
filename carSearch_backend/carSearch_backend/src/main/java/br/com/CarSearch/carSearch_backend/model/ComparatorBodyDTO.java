package br.com.CarSearch.carSearch_backend.model;

public record ComparatorBodyDTO(
        String marca,
        String modelo,
        String versao,
        String marca2,
        String modelo2,
        String versao2
) {
}
