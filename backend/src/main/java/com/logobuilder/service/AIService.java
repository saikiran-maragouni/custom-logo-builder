package com.logobuilder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class AIService {
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final String API_KEY = "AIzaSyATz1nPZxGT1JtDq653bpauGDqz-OMUGKo";
    
    public AIService() {
        this.webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com/v1beta")
            .defaultHeader("Content-Type", "application/json")
            .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public String getBrandingSuggestions(String industry, String brandKeywords, String style) {
        try {
            String prompt = String.format(
                "As a professional brand designer with 15+ years experience, create comprehensive branding suggestions for a %s company. " +
                "Brand keywords: %s, Design style: %s. \n\n" +
                "Provide EXACTLY this JSON structure:\n" +
                "{\n" +
                "  \"colorPalettes\": [\n" +
                "    {\"name\": \"Primary Palette\", \"colors\": [\"#primary\", \"#secondary\", \"#accent\"], \"description\": \"Brief description\"},\n" +
                "    {\"name\": \"Alternative 1\", \"colors\": [\"#color1\", \"#color2\", \"#color3\"], \"description\": \"Brief description\"},\n" +
                "    {\"name\": \"Alternative 2\", \"colors\": [\"#color1\", \"#color2\", \"#color3\"], \"description\": \"Brief description\"}\n" +
                "  ],\n" +
                "  \"fonts\": [\n" +
                "    {\"primary\": \"FontName1\", \"secondary\": \"FontName2\", \"description\": \"Usage description\"},\n" +
                "    {\"primary\": \"FontName3\", \"secondary\": \"FontName4\", \"description\": \"Usage description\"},\n" +
                "    {\"primary\": \"FontName5\", \"secondary\": \"FontName6\", \"description\": \"Usage description\"}\n" +
                "  ],\n" +
                "  \"layouts\": [\n" +
                "    {\"name\": \"Layout1\", \"description\": \"Detailed description with positioning\"},\n" +
                "    {\"name\": \"Layout2\", \"description\": \"Detailed description with positioning\"},\n" +
                "    {\"name\": \"Layout3\", \"description\": \"Detailed description with positioning\"}\n" +
                "  ],\n" +
                "  \"brandingTips\": [\"Tip1\", \"Tip2\", \"Tip3\"]\n" +
                "}\n\n" +
                "Consider %s industry standards, target audience psychology, and %s aesthetic principles. " +
                "Ensure colors work well together and fonts are web-safe. Only return valid JSON, no additional text.",
                industry, brandKeywords, style, industry, style
            );
            
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);
            
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);
            
            String response = webClient.post()
                .uri("/models/gemini-2.0-flash-exp:generateContent?key=" + API_KEY)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            JsonNode jsonResponse = objectMapper.readTree(response);
            String aiResponse = jsonResponse.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean the response to extract JSON
            String cleanResponse = aiResponse;
            if (aiResponse.contains("```json")) {
                cleanResponse = aiResponse.substring(aiResponse.indexOf("```json") + 7);
                if (cleanResponse.contains("```")) {
                    cleanResponse = cleanResponse.substring(0, cleanResponse.indexOf("```"));
                }
            }
            cleanResponse = cleanResponse.trim();
            
            return cleanResponse != null && !cleanResponse.isEmpty() ? cleanResponse : getDefaultSuggestions();
            
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return getDefaultSuggestions();
        }
    }
    
    public String getLogoSuggestions(String businessName, String keywords, String style, String color) {
        try {
            String prompt = String.format(
                "As a senior logo designer, create 3 distinctive logo concepts for '%s'. " +
                "Industry/Keywords: %s, Style: %s, Color preference: %s.\n\n" +
                "Return EXACTLY this JSON structure:\n" +
                "{\n" +
                "  \"logos\": [\n" +
                "    {\n" +
                "      \"name\": \"Concept Name\",\n" +
                "      \"description\": \"Detailed design rationale and symbolism\",\n" +
                "      \"elements\": [\"element1\", \"element2\", \"text\"],\n" +
                "      \"colors\": [\"#primary\", \"#secondary\"],\n" +
                "      \"layout\": \"Layout description\",\n" +
                "      \"symbolism\": \"What the logo represents\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Available elements: text, circle, rectangle, triangle, star, hexagon, diamond, arrow, ellipse, line\n" +
                "Create meaningful combinations that tell the brand story. Each logo should be unique and industry-appropriate. " +
                "Consider: brand personality, target audience, scalability, memorability. " +
                "Use professional color combinations with proper contrast. Only return valid JSON.",
                businessName, keywords, style != null ? style : "modern", color != null ? color : "professional"
            );
            
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            parts.add(part);
            
            content.put("parts", parts);
            contents.add(content);
            requestBody.put("contents", contents);
            
            String response = webClient.post()
                .uri("/models/gemini-2.0-flash-exp:generateContent?key=" + API_KEY)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            JsonNode jsonResponse = objectMapper.readTree(response);
            String aiResponse = jsonResponse.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
            // Clean the response to extract JSON
            String cleanResponse = aiResponse;
            if (aiResponse.contains("```json")) {
                cleanResponse = aiResponse.substring(aiResponse.indexOf("```json") + 7);
                if (cleanResponse.contains("```")) {
                    cleanResponse = cleanResponse.substring(0, cleanResponse.indexOf("```"));
                }
            }
            cleanResponse = cleanResponse.trim();
            
            return cleanResponse != null && !cleanResponse.isEmpty() ? cleanResponse : getDefaultLogoSuggestions(businessName);
            
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return getDefaultLogoSuggestions(businessName);
        }
    }
    
    private String getDefaultSuggestions() {
        return "{\n" +
               "  \"colorPalettes\": [\n" +
               "    {\"name\": \"Professional Blue\", \"colors\": [\"#2563eb\", \"#1e40af\", \"#f8fafc\"], \"description\": \"Trust, reliability, corporate\"},\n" +
               "    {\"name\": \"Modern Green\", \"colors\": [\"#059669\", \"#047857\", \"#f0fdf4\"], \"description\": \"Growth, sustainability, innovation\"},\n" +
               "    {\"name\": \"Creative Orange\", \"colors\": [\"#ea580c\", \"#c2410c\", \"#fff7ed\"], \"description\": \"Energy, creativity, enthusiasm\"}\n" +
               "  ],\n" +
               "  \"fonts\": [\n" +
               "    {\"primary\": \"Inter\", \"secondary\": \"Open Sans\", \"description\": \"Modern, clean, highly readable\"},\n" +
               "    {\"primary\": \"Roboto\", \"secondary\": \"Lato\", \"description\": \"Friendly, approachable, versatile\"},\n" +
               "    {\"primary\": \"Poppins\", \"secondary\": \"Source Sans Pro\", \"description\": \"Contemporary, geometric, professional\"}\n" +
               "  ],\n" +
               "  \"layouts\": [\n" +
               "    {\"name\": \"Centered Stack\", \"description\": \"Icon centered above text, balanced and formal\"},\n" +
               "    {\"name\": \"Horizontal Lock-up\", \"description\": \"Icon and text side-by-side, compact and versatile\"},\n" +
               "    {\"name\": \"Integrated Design\", \"description\": \"Text and icon merged, unique and memorable\"}\n" +
               "  ],\n" +
               "  \"brandingTips\": [\"Maintain consistency across all touchpoints\", \"Ensure scalability from business cards to billboards\", \"Test readability in various contexts\"]\n" +
               "}";
    }
    
    private String getDefaultLogoSuggestions(String businessName) {
        return String.format(
            "{\"logos\": [" +
            "{\"name\": \"%s Corporate\", \"description\": \"Professional rectangular frame with bold typography, conveying stability and trust\", \"elements\": [\"rectangle\", \"text\"], \"colors\": [\"#2563eb\", \"#ffffff\"], \"layout\": \"Horizontal lockup\", \"symbolism\": \"Foundation and reliability\"}," +
            "{\"name\": \"%s Dynamic\", \"description\": \"Circular icon with integrated text, representing unity and continuous growth\", \"elements\": [\"circle\", \"text\", \"star\"], \"colors\": [\"#059669\", \"#ffffff\"], \"layout\": \"Icon above text\", \"symbolism\": \"Innovation and excellence\"}," +
            "{\"name\": \"%s Premium\", \"description\": \"Sophisticated diamond and arrow combination suggesting forward movement and premium quality\", \"elements\": [\"diamond\", \"arrow\", \"text\"], \"colors\": [\"#7c3aed\", \"#fbbf24\"], \"layout\": \"Integrated design\", \"symbolism\": \"Luxury and progress\"}" +
            "]}", businessName, businessName, businessName
        );
    }
}