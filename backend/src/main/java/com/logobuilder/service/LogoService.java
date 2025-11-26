package com.logobuilder.service;

import com.logobuilder.model.Logo;
import com.logobuilder.repository.LogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LogoService {
    
    @Autowired
    private LogoRepository logoRepository;
    
    public List<Logo> getAllLogos() {
        return logoRepository.findAll();
    }
    
    public Optional<Logo> getLogoById(Long id) {
        return logoRepository.findById(id);
    }
    
    public Logo saveLogo(Logo logo) {
        return logoRepository.save(logo);
    }
    
    public void deleteLogo(Long id) {
        logoRepository.deleteById(id);
    }
    
    public List<Logo> getLogosByUserId(Long userId) {
        return logoRepository.findByUserId(userId);
    }
    
    public List<Logo> getPublicLogos() {
        return logoRepository.findByIsPublicTrue();
    }
}