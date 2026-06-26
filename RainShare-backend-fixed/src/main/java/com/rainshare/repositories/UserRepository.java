package com.rainshare.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rainshare.entities.User;

public interface UserRepository extends JpaRepository<User, Long>
{
	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);
}
