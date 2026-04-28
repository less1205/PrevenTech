package com.preventech.backend.repositories;

import org.springframework.data.repository.CrudRepository;
import java.util.List;
import com.preventech.backend.entities.Alerta;
import com.preventech.backend.enums.Color;

public interface AlertaRepository extends CrudRepository<Alerta, Long> {
    List<Alerta> findByColor(Color color);
}