package com.klef.repository;

import com.klef.entity.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementRepository
        extends JpaRepository<Requirement, Long> {

    List<Requirement> findByBuyerUsername(String buyerUsername);
}