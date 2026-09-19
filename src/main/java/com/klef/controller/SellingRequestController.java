package com.klef.controller;

import com.klef.entity.SellingRequest;
import com.klef.repository.SellingRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
public class SellingRequestController {

    @Autowired
    private SellingRequestRepository sellingRequestRepository;

    @GetMapping("/selling-requests/buyer/{username}")
    public ResponseEntity<?> getBuyerRequests(@PathVariable String username) {
        return ResponseEntity.ok(
                sellingRequestRepository.findByBuyerUsername(username)
        );
    }

    @GetMapping("/selling-requests/farmer/{username}")
    public ResponseEntity<?> getFarmerRequests(@PathVariable String username) {
        return ResponseEntity.ok(
                sellingRequestRepository.findByFarmerUsername(username)
        );
    }

    @PostMapping("/selling-requests")
    public ResponseEntity<?> createRequest(@RequestBody SellingRequest request) {
        if (request.getBuyerUsername() == null || request.getBuyerUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Buyer username is required");
        }
        if (request.getFarmerUsername() == null || request.getFarmerUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Farmer username is required");
        }
        if (request.getCrop() == null || request.getCrop().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Crop is required");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be greater than 0");
        }

        request.setStatus("Pending");
        return ResponseEntity.ok(sellingRequestRepository.save(request));
    }

    @PutMapping("/selling-requests/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        SellingRequest request = sellingRequestRepository.findById(id).orElse(null);
        if (request == null) {
            return ResponseEntity.notFound().build();
        }
        if (!status.equalsIgnoreCase("Accepted") &&
                !status.equalsIgnoreCase("Rejected") &&
                !status.equalsIgnoreCase("Pending")) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        request.setStatus(
                status.substring(0, 1).toUpperCase() +
                        status.substring(1).toLowerCase()
        );
        return ResponseEntity.ok(sellingRequestRepository.save(request));
    }
}
