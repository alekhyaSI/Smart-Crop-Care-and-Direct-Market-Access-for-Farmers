package com.klef.controller;

import com.klef.entity.User;
import com.klef.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
public class BuyerController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/buyers")
    public List<User> getBuyers() {

        return userRepository.findAll()
                .stream()
                .filter(user -> "BUYER".equalsIgnoreCase(user.getRole()))
                .toList();
    }
}