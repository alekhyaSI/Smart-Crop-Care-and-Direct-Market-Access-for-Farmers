package com.klef.controller;

import com.klef.entity.Storage;
import com.klef.repository.StorageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class StorageController {

    @Autowired
    private StorageRepository storageRepository;

    @GetMapping("/storages")
    public ResponseEntity<?> getAllStorages() {
        return ResponseEntity.ok(storageRepository.findAll());
    }

    @GetMapping("/storages/owner/{username}")
    public ResponseEntity<?> getOwnerStorages(@PathVariable String username) {
        List<Storage> storages =
                storageRepository.findByOwnerUsername(username);

        return ResponseEntity.ok(storages);
    }

    @PostMapping("/storages")
    public ResponseEntity<?> addStorage(@RequestBody Storage storage) {

        if (storage.getName() == null ||
                storage.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Storage name is required");
        }

        if (storage.getLocation() == null ||
                storage.getLocation().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Location is required");
        }

        if (storage.getOwnerUsername() == null ||
                storage.getOwnerUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Owner username is required");
        }

        Storage savedStorage = storageRepository.save(storage);

        return ResponseEntity.ok(savedStorage);
    }

    @PutMapping("/storages/{id}")
    public ResponseEntity<?> updateStorage(
            @PathVariable Long id,
            @RequestBody Storage updatedStorage) {

        Storage storage = storageRepository.findById(id)
                .orElse(null);

        if (storage == null) {
            return ResponseEntity.notFound().build();
        }

        storage.setName(updatedStorage.getName());
        storage.setOwnerName(updatedStorage.getOwnerName());
        storage.setLocation(updatedStorage.getLocation());
        storage.setDistance(updatedStorage.getDistance());
        storage.setCapacity(updatedStorage.getCapacity());
        storage.setAvailable(updatedStorage.getAvailable());
        storage.setCost(updatedStorage.getCost());
        storage.setPhone(updatedStorage.getPhone());
        storage.setCrops(updatedStorage.getCrops());

        Storage savedStorage = storageRepository.save(storage);

        return ResponseEntity.ok(savedStorage);
    }

    @DeleteMapping("/storages/{id}")
    public ResponseEntity<?> deleteStorage(@PathVariable Long id) {

        if (!storageRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        storageRepository.deleteById(id);

        return ResponseEntity.ok("Storage deleted successfully");
    }
}