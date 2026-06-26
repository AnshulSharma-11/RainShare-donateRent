package com.rainshare.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rainshare.entities.Volunteer;

public interface VolunteerRepository extends JpaRepository<Volunteer, Long>{

}