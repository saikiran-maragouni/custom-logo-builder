package com.logobuilder.dto;

public class LogoSuggestionRequest {
    private String businessName;
    private String keywords;
    private String style;
    private String color;
    
    public LogoSuggestionRequest() {}
    
    public LogoSuggestionRequest(String businessName, String keywords, String style, String color) {
        this.businessName = businessName;
        this.keywords = keywords;
        this.style = style;
        this.color = color;
    }
    
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    
    public String getKeywords() { return keywords; }
    public void setKeywords(String keywords) { this.keywords = keywords; }
    
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}