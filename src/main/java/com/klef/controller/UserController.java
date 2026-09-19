package com.klef.controller;

import com.klef.entity.User;
import com.klef.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is required");
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        if (!isStrongPassword(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password must be at least 8 characters and contain uppercase, lowercase, number and special character");
        }

        if (user.getRole() == null ||
                (!user.getRole().equalsIgnoreCase("FARMER") &&
                 !user.getRole().equalsIgnoreCase("BUYER") &&
                 !user.getRole().equalsIgnoreCase("STORAGE_OWNER"))) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Role must be Farmer, Buyer or Storage Owner");
        }
        if (user.getRole().equalsIgnoreCase("Storage Owner") ||
                user.getRole().equalsIgnoreCase("STORAGE_OWNER")) {
            user.setRole("STORAGE_OWNER");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }

        if (user.getPreferredLanguage() == null ||
                (!user.getPreferredLanguage().equalsIgnoreCase("English") &&
                 !user.getPreferredLanguage().equalsIgnoreCase("Telugu") &&
                 !user.getPreferredLanguage().equalsIgnoreCase("Hindi"))) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Language must be English, Telugu or Hindi");
        }

        user.setRole(user.getRole().toUpperCase());

        if (user.getPreferredLanguage().equalsIgnoreCase("Telugu")) {
            user.setPreferredLanguage("Telugu");
        } else if (user.getPreferredLanguage().equalsIgnoreCase("Hindi")) {
            user.setPreferredLanguage("Hindi");
        } else {
            user.setPreferredLanguage("English");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        if (loginRequest.getUsernameOrEmail() == null ||
                loginRequest.getUsernameOrEmail().trim().isEmpty()) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username or email is required");
        }

        if (loginRequest.getPassword() == null ||
                loginRequest.getPassword().isEmpty()) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password is required");
        }

        User user = userRepository
                .findByEmail(loginRequest.getUsernameOrEmail())
                .orElseGet(() ->
                        userRepository
                                .findByUsername(loginRequest.getUsernameOrEmail())
                                .orElse(null)
                );

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username/email or password");
        }

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username/email or password");
        }

        return ResponseEntity.ok(user);
    }

    private boolean isStrongPassword(String password) {

        if (password == null || password.length() < 8) {
            return false;
        }

        boolean uppercase = password.matches(".*[A-Z].*");
        boolean lowercase = password.matches(".*[a-z].*");
        boolean number = password.matches(".*[0-9].*");
        boolean special = password.matches(".*[^a-zA-Z0-9].*");

        return uppercase && lowercase && number && special;
    }

    public static class LoginRequest {

        private String usernameOrEmail;
        private String password;

        public String getUsernameOrEmail() {
            return usernameOrEmail;
        }

        public void setUsernameOrEmail(String usernameOrEmail) {
            this.usernameOrEmail = usernameOrEmail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}