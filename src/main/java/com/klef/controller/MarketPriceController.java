package com.klef.controller;

import com.klef.entity.MarketPrice;
import com.klef.repository.MarketPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@CrossOrigin("*")
public class MarketPriceController {

    @Autowired
    private MarketPriceRepository marketPriceRepository;

    @GetMapping("/market-prices")
    public ResponseEntity<?> getAllMarketPrices() {
        return ResponseEntity.ok(
                marketPriceRepository.findAll()
        );
    }

    @PostMapping("/market-prices")
    public ResponseEntity<?> addMarketPrice(
            @RequestBody MarketPrice marketPrice) {

        marketPrice.setUpdated(
                LocalDate.now().toString()
        );

        MarketPrice saved =
                marketPriceRepository.save(marketPrice);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/market-prices/{id}")
    public ResponseEntity<?> deleteMarketPrice(
            @PathVariable Long id) {

        if (!marketPriceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        marketPriceRepository.deleteById(id);

        return ResponseEntity.ok(
                "Market price deleted successfully"
        );
    }
}