package com.logobuilder.dto;

public class BrandingSuggestionRequest {
    private String industry;
    private String brandKeywords;
    private String style;
    
    public BrandingSuggestionRequest() {}
    
    public BrandingSuggestionRequest(String industry, String brandKeywords, String style) {
        this.industry = industry;
        this.brandKeywords = brandKeywords;
        this.style = style;
    }
    
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    
    public String getBrandKeywords() { return brandKeywords; }
    public void setBrandKeywords(String brandKeywords) { this.brandKeywords = brandKeywords; }
    
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }
}