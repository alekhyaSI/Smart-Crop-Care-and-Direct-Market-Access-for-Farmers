package com.klef.controller;

import com.klef.entity.StorageRequest;
import com.klef.repository.StorageRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class StorageRequestController {

    @Autowired
    private StorageRequestRepository storageRequestRepository;

    @GetMapping("/storage-requests/farmer/{username}")
    public ResponseEntity<?> getFarmerRequests(
            @PathVariable String username
    ) {
        List<StorageRequest> requests =
                storageRequestRepository.findByFarmerUsername(username);

        return ResponseEntity.ok(requests);
    }

    @GetMapping("/storage-requests/owner/{username}")
    public ResponseEntity<?> getOwnerRequests(
            @PathVariable String username
    ) {
        List<StorageRequest> requests =
                storageRequestRepository.findByStorageOwnerUsername(username);

        return ResponseEntity.ok(requests);
    }

    @PostMapping("/storage-requests")
    public ResponseEntity<?> createRequest(
            @RequestBody StorageRequest request
    ) {

        if (request.getStorageId() == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Storage facility is required");
        }

        if (request.getFarmerUsername() == null ||
                request.getFarmerUsername().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Farmer username is required");
        }

        if (request.getCrop() == null ||
                request.getCrop().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Crop is required");
        }

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be greater than 0");
        }

        if (request.getDurationDays() == null ||
                request.getDurationDays() <= 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Duration must be greater than 0");
        }

        request.setStatus("Pending");

        StorageRequest savedRequest =
                storageRequestRepository.save(request);

        return ResponseEntity.ok(savedRequest);
    }

    @PutMapping("/storage-requests/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        StorageRequest request =
                storageRequestRepository
                        .findById(id)
                        .orElse(null);

        if (request == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!status.equalsIgnoreCase("Accepted") &&
                !status.equalsIgnoreCase("Rejected") &&
                !status.equalsIgnoreCase("Pending")) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid status");
        }

        request.setStatus(
                status.substring(0, 1).toUpperCase()
                        + status.substring(1).toLowerCase()
        );

        return ResponseEntity.ok(
                storageRequestRepository.save(request)
        );
    }
}