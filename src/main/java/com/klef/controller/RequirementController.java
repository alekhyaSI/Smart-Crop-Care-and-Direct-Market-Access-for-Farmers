package com.klef.controller;

import com.klef.entity.Requirement;
import com.klef.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class RequirementController {

    @Autowired
    private RequirementRepository requirementRepository;

    @GetMapping("/requirements")
    public ResponseEntity<?> getAllRequirements() {
        return ResponseEntity.ok(
                requirementRepository.findAll()
        );
    }

    @GetMapping("/requirements/buyer/{username}")
    public ResponseEntity<?> getBuyerRequirements(
            @PathVariable String username
    ) {
        List<Requirement> requirements =
                requirementRepository.findByBuyerUsername(username);

        return ResponseEntity.ok(requirements);
    }

    @PostMapping("/requirements")
    public ResponseEntity<?> addRequirement(
            @RequestBody Requirement requirement
    ) {

        if (requirement.getBuyerUsername() == null ||
                requirement.getBuyerUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Buyer username is required");
        }

        if (requirement.getCrop() == null ||
                requirement.getCrop().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Crop is required");
        }

        if (requirement.getQuantity() == null ||
                requirement.getQuantity() <= 0) {
            return ResponseEntity.badRequest()
                    .body("Quantity must be greater than 0");
        }

        if (requirement.getPrice() == null ||
                requirement.getPrice() <= 0) {
            return ResponseEntity.badRequest()
                    .body("Price must be greater than 0");
        }

        if (requirement.getLocation() == null ||
                requirement.getLocation().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Location is required");
        }

        return ResponseEntity.ok(
                requirementRepository.save(requirement)
        );
    }

    @DeleteMapping("/requirements/{id}")
    public ResponseEntity<?> deleteRequirement(
            @PathVariable Long id
    ) {
        if (!requirementRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        requirementRepository.deleteById(id);

        return ResponseEntity.ok(
                "Requirement deleted successfully"
        );
    }
}