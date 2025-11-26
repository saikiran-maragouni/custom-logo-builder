package com.logobuilder.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;

@Entity
@Table(name = "logos")
public class Logo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String canvasData;
    
    private LocalDateTime createdAt;
    
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
    
    @JsonProperty("username")
    public String getUsername() {
        return user != null ? user.getUsername() : null;
    }
    
    @JsonProperty("userId")
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }
    
    public Logo() {
        this.createdAt = LocalDateTime.now();
        this.isPublic = false;
    }
    
    public Logo(String name, String canvasData) {
        this.name = name;
        this.canvasData = canvasData;
        this.createdAt = LocalDateTime.now();
        this.isPublic = false;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCanvasData() { return canvasData; }
    public void setCanvasData(String canvasData) { this.canvasData = canvasData; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Boolean getIsPublic() { return isPublic; }
    public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }
}