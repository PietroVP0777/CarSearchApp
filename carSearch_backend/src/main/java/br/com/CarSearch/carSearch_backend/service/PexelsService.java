package br.com.CarSearch.carSearch_backend.service;

import br.com.CarSearch.carSearch_backend.model.ImageResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class PexelsService {

    @Value("${pexels.api.key}")
    private String apiKey;

    public String buscarImagem(ImageResponseDTO dto) {

        try {

            String query = URLEncoder.encode(
                    dto.marca() + " " +
                            dto.modelo() + " " +
                            dto.versao() + " car",
                    StandardCharsets.UTF_8
            );

            String url =
                    "https://api.pexels.com/v1/search?query="
                            + query +
                            "&per_page=1";

            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);

            HttpEntity<String> entity =
                    new HttpEntity<>(headers);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            String.class
                    );

            ObjectMapper mapper =
                    new ObjectMapper();

            JsonNode json =
                    mapper.readTree(response.getBody());

            JsonNode photos =
                    json.get("photos");

            if (photos.size() > 0) {

                return photos.get(0)
                        .get("src")
                        .get("large")
                        .asText();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}