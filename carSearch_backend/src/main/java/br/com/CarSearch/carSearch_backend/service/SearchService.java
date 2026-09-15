package br.com.CarSearch.carSearch_backend.service;

import br.com.CarSearch.carSearch_backend.model.CarBodyDTO;
import br.com.CarSearch.carSearch_backend.model.CarDTO;
import br.com.CarSearch.carSearch_backend.model.ComparatorBodyDTO;
import br.com.CarSearch.carSearch_backend.model.ImageResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
public class SearchService {

    private final OpenAiService service;
    private final GoogleImageSearchService imageSearchService;

    public SearchService(OpenAiService service, GoogleImageSearchService imageSearchService){
        this.service = service;
        this.imageSearchService = imageSearchService;
    }


    public CarDTO pesquisarCarro(CarBodyDTO dto){
        return new CarDTO(dto.marca(), dto.modelo(), dto.versao(), service.gerarEspecificacoes(dto.marca(),dto.modelo(), dto.versao(), dto.especificacoes()));
    }

    public ImageResponseDTO mandarImagem(MultipartFile file){

        try {

            String base64 = Base64.getEncoder().encodeToString(file.getBytes());

            ImageResponseDTO response = service.analisarImagem(base64);

            return response;

        } catch (IOException e) {
            throw new RuntimeException("Erro ao processar imagem");
        }
    }

    public String pesquisarImagem(ImageResponseDTO dto){
        return imageSearchService.buscarImagem(dto);
    }


    public List<String> compararCarros(ComparatorBodyDTO dto){
        try{
            return service.compararCarros(dto);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
