package com.klef.repository;

import com.klef.entity.SellingRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellingRequestRepository extends JpaRepository<SellingRequest, Long> {

    List<SellingRequest> findByBuyerUsername(String buyerUsername);

    List<SellingRequest> findByFarmerUsername(String farmerUsername);
}
