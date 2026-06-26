package com.rainshare.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rainshare.entities.Volunteer;
import com.rainshare.repositories.VolunteerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VolunteerService {

    private final VolunteerRepository repository;

    public Volunteer save(Volunteer volunteer){
        return repository.save(volunteer);
    }

    public List<Volunteer> getAll(){
        return repository.findAll();
    }

    public void delete(Long id){
        repository.deleteById(id);
    }

}