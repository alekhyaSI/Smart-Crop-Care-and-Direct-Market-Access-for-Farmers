package com.klef.repository;

import com.klef.entity.StorageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StorageRequestRepository
        extends JpaRepository<StorageRequest, Long> {

    List<StorageRequest> findByFarmerUsername(
            String farmerUsername
    );

    List<StorageRequest> findByStorageOwnerUsername(
            String storageOwnerUsername
    );
}