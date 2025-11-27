package com.logobuilder.controller;

import com.logobuilder.model.Logo;
import com.logobuilder.model.User;
import com.logobuilder.service.LogoService;
import com.logobuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/logos")
@CrossOrigin(origins = {"http://localhost:3000", "https://*.railway.app", "https://*.up.railway.app", "https://*.onrender.com", "https://*.vercel.app"})
public class LogoController {
    
    @Autowired
    private LogoService logoService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<Logo> getAllLogos(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            return logoService.getLogosByUserId(userId);
        }
        return logoService.getAllLogos();
    }
    
    @GetMapping("/public")
    public List<Logo> getPublicLogos() {
        return logoService.getPublicLogos();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Logo> getLogoById(@PathVariable Long id) {
        return logoService.getLogoById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createLogo(@RequestBody Logo logo, @RequestParam(required = false) Long userId) {
        try {
            System.out.println("Received logo save request: " + logo.getName() + ", userId: " + userId + ", isPublic: " + logo.getIsPublic());
            
            // Validate required fields
            if (logo.getName() == null || logo.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Logo name is required");
            }
            
            if (logo.getCanvasData() == null || logo.getCanvasData().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Canvas data is required");
            }
            
            // Set default values if null
            if (logo.getIsPublic() == null) {
                logo.setIsPublic(false);
            }
            
            if (userId != null) {
                User user = userService.findById(userId).orElse(null);
                if (user != null) {
                    logo.setUser(user);
                    System.out.println("User found and set: " + user.getUsername());
                } else {
                    System.out.println("User not found for ID: " + userId);
                    return ResponseEntity.badRequest().body("User not found");
                }
            } else {
                return ResponseEntity.badRequest().body("User ID is required");
            }
            
            Logo savedLogo = logoService.saveLogo(logo);
            System.out.println("Logo saved successfully with ID: " + savedLogo.getId() + ", isPublic: " + savedLogo.getIsPublic());
            return ResponseEntity.ok(savedLogo);
        } catch (Exception e) {
            System.err.println("Error saving logo: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error saving logo: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Logo> updateLogo(@PathVariable Long id, @RequestBody Logo logoDetails) {
        return logoService.getLogoById(id)
            .map(logo -> {
                logo.setName(logoDetails.getName());
                logo.setCanvasData(logoDetails.getCanvasData());
                return ResponseEntity.ok(logoService.saveLogo(logo));
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLogo(@PathVariable Long id) {
        logoService.deleteLogo(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/debug/all")
    public ResponseEntity<?> getAllLogosDebug() {
        List<Logo> allLogos = logoService.getAllLogos();
        return ResponseEntity.ok(Map.of(
            "totalLogos", allLogos.size(),
            "logos", allLogos
        ));
    }
}