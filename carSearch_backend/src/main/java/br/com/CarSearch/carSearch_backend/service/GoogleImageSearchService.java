package br.com.CarSearch.carSearch_backend.service;

import br.com.CarSearch.carSearch_backend.model.ImageResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GoogleImageSearchService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${google.search.api.key}")
    private String apiKey;

    @Value("${google.search.cx}")
    private String searchEngineId;

    public GoogleImageSearchService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://www.googleapis.com")
                .build();
    }

    public String buscarImagem(ImageResponseDTO dto) {
        if (apiKey == null || apiKey.isBlank() || searchEngineId == null || searchEngineId.isBlank()) {
            return null;
        }

        try {
            String query = "%s %s %s car official photo".formatted(
                    dto.marca(),
                    dto.modelo(),
                    dto.versao()
            );

            String uri = UriComponentsBuilder.fromPath("/customsearch/v1")
                    .queryParam("key", apiKey)
                    .queryParam("cx", searchEngineId)
                    .queryParam("q", query)
                    .queryParam("searchType", "image")
                    .queryParam("num", 1)
                    .queryParam("safe", "active")
                    .queryParam("imgSize", "large")
                    .build()
                    .toUriString();

            String resposta = webClient.get()
                    .uri(uri)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode items = objectMapper.readTree(resposta).path("items");

            if (items.isArray() && !items.isEmpty()) {
                String imageUrl = items.get(0).path("link").asText();
                return imageUrl.isBlank() ? null : imageUrl;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
