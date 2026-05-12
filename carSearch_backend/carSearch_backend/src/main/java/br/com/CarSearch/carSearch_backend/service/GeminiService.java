package br.com.CarSearch.carSearch_backend.service;

import br.com.CarSearch.carSearch_backend.model.ComparatorBodyDTO;
import br.com.CarSearch.carSearch_backend.model.EspecDTO;
import br.com.CarSearch.carSearch_backend.model.ImageResponseDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public List<EspecDTO> gerarEspecificacoes(String marca,
                                              String modelo,
                                              String versao,
                                              List<String> especificacoesUsuario) {

        try {

            boolean listaVazia = especificacoesUsuario == null || especificacoesUsuario.isEmpty();

            String pedidoUsuario = listaVazia
                    ? "Liste as especificações mais importantes deste veículo"
                    : String.join(", ", especificacoesUsuario);

            String prompt = listaVazia ? """
                    Você é um especialista automotivo.

                    Retorne APENAS JSON puro.
                    Sem markdown.
                    Sem explicações.

                    REGRAS:
                    - Retorne entre 5 e 8 especificações MAIS IMPORTANTES do veículo
                    - Nunca deixe valor vazio
                    - Se não souber, use: "Não disponível"

                    Formato:
                    [
                      { "nome": "motor", "valor": "..." }
                    ]

                    Veículo:
                    %s %s %s
                    """.formatted(marca, modelo, versao)

                    :

                    """
                    Você é um especialista automotivo.

                    Retorne APENAS JSON puro.
                    Sem markdown.
                    Sem explicações.

                    REGRAS:
                    - Responda TODAS as especificações solicitadas
                    - Nunca deixe valor vazio
                    - Se não souber, use: "Não disponível"

                    Formato:
                    [
                      { "nome": "motor", "valor": "..." }
                    ]

                    Veículo:
                    %s %s %s

                    Especificações solicitadas:
                    %s
                    """.formatted(marca, modelo, versao, pedidoUsuario);

            String requestBody = """
                    {
                      "contents": [
                        {
                          "parts": [
                            {
                              "text": %s
                            }
                          ]
                        }
                      ]
                    }
                    """.formatted(escapeJson(prompt));

            String resposta = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String jsonLimpo = extrairTextoResposta(resposta);

            List<EspecDTO> respostaGemini = objectMapper.readValue(
                    jsonLimpo,
                    new TypeReference<List<EspecDTO>>() {}
            );

            if (listaVazia) {
                return garantirSpecsImportantes(respostaGemini);
            }

            return garantirTodasEspecificacoes(especificacoesUsuario, respostaGemini);

        } catch (Exception e) {
            e.printStackTrace();

            // fallback total
            if (especificacoesUsuario == null || especificacoesUsuario.isEmpty()) {
                return getFallbackPadrao();
            }

            return especificacoesUsuario.stream()
                    .map(spec -> new EspecDTO(spec, "Não disponível"))
                    .toList();
        }
    }

    private List<EspecDTO> garantirTodasEspecificacoes(
            List<String> solicitadas,
            List<EspecDTO> respostaGemini) {

        Map<String, String> mapaResposta = respostaGemini == null
                ? new HashMap<>()
                : respostaGemini.stream()
                .collect(Collectors.toMap(
                        e -> e.nome().toLowerCase(),
                        e -> e.valor(),
                        (a, b) -> a
                ));

        return solicitadas.stream()
                .map(nome -> {
                    String valor = mapaResposta.get(nome.toLowerCase());

                    if (valor == null || valor.isBlank() || valorMuitoSuspeito(valor)) {
                        valor = "Não disponível";
                    }

                    return new EspecDTO(nome, valor);
                })
                .toList();
    }

    private List<EspecDTO> garantirSpecsImportantes(List<EspecDTO> resposta) {

        if (resposta == null || resposta.isEmpty()) {
            return getFallbackPadrao();
        }

        return resposta.stream()
                .map(e -> {
                    String valor = e.valor();

                    if (valor == null || valor.isBlank() || valorMuitoSuspeito(valor)) {
                        valor = "Não disponível";
                    }

                    return new EspecDTO(e.nome(), valor);
                })
                .limit(8)
                .toList();
    }

    private List<EspecDTO> getFallbackPadrao() {
        return List.of(
                new EspecDTO("motor", "Não disponível"),
                new EspecDTO("potência", "Não disponível"),
                new EspecDTO("torque", "Não disponível"),
                new EspecDTO("velocidade máxima", "Não disponível"),
                new EspecDTO("aceleração 0-100 km/h", "Não disponível")
        );
    }

    private boolean valorMuitoSuspeito(String valor) {
        String v = valor.toLowerCase();

        return v.contains("não sei")
                || v.contains("desconhecido")
                || v.length() < 2;
    }

    private String extrairTextoResposta(String respostaApi) throws Exception {

        JsonNode root = objectMapper.readTree(respostaApi);

        String texto = root
                .path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        return texto
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }

    private String escapeJson(String texto) {
        return "\"" +
                texto.replace("\\", "\\\\")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n")
                        .replace("\r", "") +
                "\"";
    }

    public ImageResponseDTO analisarImagem(String base64Image) {

        try {

            String prompt = """
            Você é um especialista automotivo.

            Analise a imagem e identifique o veículo.

            Retorne APENAS JSON puro.
            Sem markdown.
            Sem explicações.

            Formato:
            {
              "marca": "ex: Ford",
              "modelo": "ex: Ranger",
              "versao": "ex: Raptor"
            }

            Se não souber algum campo, use "Não identificado".
        """;

            String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        },
                        {
                          "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": "%s"
                          }
                        }
                      ]
                    }
                  ]
                }
                """.formatted(escapeJson(prompt), base64Image);

            String resposta = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String jsonLimpo = extrairTextoResposta(resposta);

            return objectMapper.readValue(jsonLimpo, ImageResponseDTO.class);

        } catch (Exception e) {
            e.printStackTrace();

            return new ImageResponseDTO(
                    "Não identificado",
                    "Não identificado",
                    "Não identificado"
            );
        }
    }

    public List<String> compararCarros(ComparatorBodyDTO dto) {

        try {

            String prompt = """
        Você é um especialista automotivo.

        Compare os dois veículos abaixo.

        REGRAS:
        - Retorne APENAS JSON puro
        - Sem markdown
        - Sem introdução
        - Sem textos longos
        - Faça TODAS as comparações relevantes
        - Cada comparação deve ser curta e objetiva

        FORMATO:
        [
          "Carro A possui mais potência",
          "Carro B é mais econômico"
        ]

        CARRO 1:
        %s %s %s

        CARRO 2:
        %s %s %s
        """.formatted(
                    dto.marca(),
                    dto.modelo(),
                    dto.versao(),
                    dto.marca2(),
                    dto.modelo2(),
                    dto.versao2()
            );

            String requestBody = """
                {
                  "contents": [
                    {
                      "parts": [
                        {
                          "text": %s
                        }
                      ]
                    }
                  ]
                }
                """.formatted(escapeJson(prompt));

            String resposta = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash:generateContent")
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            String jsonLimpo = extrairTextoResposta(resposta);

            return objectMapper.readValue(
                    jsonLimpo,
                    new TypeReference<List<String>>() {}
            );

        } catch (Exception e) {

            e.printStackTrace();

            return List.of(
                    "Não foi possível comparar os veículos"
            );
        }
    }


}