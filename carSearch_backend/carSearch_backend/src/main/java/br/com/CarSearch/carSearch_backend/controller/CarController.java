package br.com.CarSearch.carSearch_backend.controller;

import br.com.CarSearch.carSearch_backend.model.CarBodyDTO;
import br.com.CarSearch.carSearch_backend.model.CarDTO;
import br.com.CarSearch.carSearch_backend.model.ComparatorBodyDTO;
import br.com.CarSearch.carSearch_backend.model.ImageResponseDTO;
import br.com.CarSearch.carSearch_backend.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/carros")
public class CarController {

    private final SearchService service;

    public CarController(SearchService service){
        this.service = service;
    }

    @PostMapping
    public CarDTO pesquisarCarro(@RequestBody CarBodyDTO dto){
        return service.pesquisarCarro(dto);
    }

    @PostMapping("/upload")
    public ImageResponseDTO uploadImage(@RequestParam("file") MultipartFile file){

        return service.mandarImagem(file);

    }

    @PostMapping("/pesquisarImagem")
    public String pesquisarImagem(@RequestBody ImageResponseDTO dto){
        return service.pesquisarImagem(dto);
    }

    @PostMapping("/comparar")
    public List<String> compararVeiculos(@RequestBody ComparatorBodyDTO dto){
        return service.compararCarros(dto);
    }
}
