package com.rainshare.service;

import com.rainshare.entities.Rental;
import com.rainshare.repositories.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository repository;

    public Rental save(Rental rental){
        return repository.save(rental);
    }

    public List<Rental> getAll(){
        return repository.findAll();
    }

    public Rental getById(Long id){
        return repository.findById(id).orElseThrow();
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

}