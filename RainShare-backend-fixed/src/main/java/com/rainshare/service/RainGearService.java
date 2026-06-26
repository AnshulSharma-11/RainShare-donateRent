package com.rainshare.service;

import com.rainshare.entities.RainGear;
import com.rainshare.repositories.RainGearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RainGearService {

    private final RainGearRepository repository;

    public RainGear save(RainGear gear){
        return repository.save(gear);
    }

    public List<RainGear> getAll(){
        return repository.findAll();
    }

    public RainGear getById(Long id){
        return repository.findById(id).orElseThrow();
    }

    public void delete(Long id){
        repository.deleteById(id);
    }
}