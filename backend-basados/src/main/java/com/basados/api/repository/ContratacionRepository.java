package com.basados.api.repository;

import com.basados.api.entity.ContratacionAsador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContratacionRepository extends JpaRepository<ContratacionAsador, Long> {

    List<ContratacionAsador> findByIdEvento(UUID idEvento);

    List<ContratacionAsador> findByMaestroIdMaestro(Long idMaestro);
}