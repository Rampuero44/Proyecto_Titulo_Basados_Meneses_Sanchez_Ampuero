package com.basados.api.repository;

import com.basados.api.entity.Comercio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComercioRepository extends JpaRepository<Comercio, Long> {
}