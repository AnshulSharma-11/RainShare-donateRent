package com.rainshare.service;

import com.rainshare.entities.Donation;
import com.rainshare.repositories.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationRepository repository;

    public Donation save(Donation donation) {
        return repository.save(donation);
    }

    public List<Donation> getAll() {
        return repository.findAll();
    }

}