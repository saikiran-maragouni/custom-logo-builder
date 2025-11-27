package com.logobuilder.controller;

import com.logobuilder.dto.BrandingSuggestionRequest;
import com.logobuilder.dto.LogoSuggestionRequest;
import com.logobuilder.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:3000", "https://*.railway.app", "https://*.up.railway.app", "https://*.onrender.com", "https://*.vercel.app"})
public class AIController {
    
    @Autowired
    private AIService aiService;
    
    @PostMapping("/branding-suggestions")
    public String getBrandingSuggestions(@RequestBody BrandingSuggestionRequest request) {
        return aiService.getBrandingSuggestions(
            request.getIndustry(),
            request.getBrandKeywords(),
            request.getStyle()
        );
    }
    
    @PostMapping("/logo-suggestions")
    public String getLogoSuggestions(@RequestBody LogoSuggestionRequest request) {
        return aiService.getLogoSuggestions(
            request.getBusinessName(),
            request.getKeywords(),
            request.getStyle(),
            request.getColor()
        );
    }
}