package com.klef.repository;

import com.klef.entity.Storage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StorageRepository extends JpaRepository<Storage, Long> {

    List<Storage> findByOwnerUsername(String ownerUsername);
}