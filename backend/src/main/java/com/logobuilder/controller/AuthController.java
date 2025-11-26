package com.logobuilder.controller;

import com.logobuilder.dto.LoginRequest;
import com.logobuilder.dto.RegisterRequest;
import com.logobuilder.model.User;
import com.logobuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://*.railway.app", "https://*.up.railway.app"})
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
            ));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt for username: " + request.getUsername());
        
        Optional<User> user = userService.loginUser(request.getUsername(), request.getPassword());
        Map<String, Object> response = new HashMap<>();
        
        if (user.isPresent()) {
            System.out.println("Login successful for user: " + user.get().getUsername());
            response.put("success", true);
            response.put("user", Map.of(
                "id", user.get().getId(),
                "username", user.get().getUsername(),
                "email", user.get().getEmail()
            ));
            return ResponseEntity.ok(response);
        } else {
            System.out.println("Login failed for username: " + request.getUsername());
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.badRequest().body(response);
        }
    }
}