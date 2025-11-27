import React, { useState } from 'react';
import { aiAPI } from '../services/api';

const BrandingSuggestions = ({ canvas }) => {
  const [industry, setIndustry] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [style, setStyle] = useState('modern');
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSuggestions = async () => {
    if (!industry || !brandKeywords) return;

    setLoading(true);
    try {
      const response = await aiAPI.getBrandingSuggestions({
        industry,
        brandKeywords,
        style,
      });
      
      let parsedSuggestions;
      try {
        parsedSuggestions = JSON.parse(response.data);
      } catch {
        parsedSuggestions = {
          colorPalettes: [
            { name: 'Professional Blue', colors: ['#2563eb', '#1e40af', '#f8fafc'], description: 'Trust and reliability' },
            { name: 'Modern Green', colors: ['#059669', '#047857', '#f0fdf4'], description: 'Growth and innovation' },
            { name: 'Creative Orange', colors: ['#ea580c', '#c2410c', '#fff7ed'], description: 'Energy and creativity' },
          ],
          fonts: [
            { primary: 'Inter', secondary: 'Open Sans', description: 'Modern and clean' },
            { primary: 'Roboto', secondary: 'Lato', description: 'Friendly and versatile' },
            { primary: 'Poppins', secondary: 'Source Sans Pro', description: 'Contemporary and professional' },
          ],
          layouts: [
            { name: 'Centered Stack', description: 'Icon centered above text, balanced and formal' },
            { name: 'Horizontal Lock-up', description: 'Icon and text side-by-side, compact and versatile' },
            { name: 'Integrated Design', description: 'Text and icon merged, unique and memorable' },
          ],
          brandingTips: ['Maintain consistency across all touchpoints', 'Ensure scalability', 'Test readability in various contexts']
        };
      }
      
      setSuggestions(parsedSuggestions);
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyColorPalette = (colors) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', colors[0]);
      canvas.renderAll();
    }
  };

  return (
    <div className="branding-suggestions">
      <h3>AI Branding Suggestions</h3>
      
      <div className="branding-form">
        <input
          type="text"
          placeholder="Industry (e.g., Technology, Healthcare)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Brand keywords (e.g., innovative, reliable)"
          value={brandKeywords}
          onChange={(e) => setBrandKeywords(e.target.value)}
        />
        <select value={style} onChange={(e) => setStyle(e.target.value)}>
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="minimalist">Minimalist</option>
          <option value="bold">Bold</option>
        </select>
        
        <button 
          className={`suggest-btn ${loading ? 'loading' : ''}`}
          onClick={getSuggestions}
          disabled={loading || !industry || !brandKeywords}
        >
          {loading ? (
            <span>
              <span className="spinner">🧠</span> AI is analyzing your brand...
            </span>
          ) : (
            <span>
              ✨ Get AI Branding Suggestions
            </span>
          )}
        </button>
      </div>

      {suggestions && (
        <div className="suggestions-result">
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>
            🎨 Color Palettes
          </h4>
          {suggestions.colorPalettes?.map((palette, index) => (
            <div key={index} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem', color: '#842A3B' }}>
                {palette.name}
              </div>
              {palette.description && (
                <div style={{ fontSize: '0.75rem', color: '#A3485A', marginBottom: '0.5rem' }}>
                  {palette.description}
                </div>
              )}
              <div className="color-palette">
                {palette.colors.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => applyColorPalette(palette.colors)}
                    title={`${color} - Click to apply`}
                  />
                ))}
              </div>
            </div>
          ))}

          <h4 style={{ color: '#667eea', marginBottom: '1rem', marginTop: '1.5rem' }}>
            🔤 Font Combinations
          </h4>
          {suggestions.fonts?.map((font, index) => (
            <div key={index} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.3)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#842A3B' }}>
                {font.primary} + {font.secondary}
              </div>
              {font.description && (
                <div style={{ fontSize: '0.75rem', color: '#A3485A', marginTop: '0.25rem' }}>
                  {font.description}
                </div>
              )}
            </div>
          ))}

          <h4 style={{ color: '#667eea', marginBottom: '1rem', marginTop: '1.5rem' }}>
            📐 Layout Ideas
          </h4>
          {suggestions.layouts?.map((layout, index) => (
            <div key={index} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.3)', borderRadius: '6px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#842A3B' }}>
                {layout.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A3485A', marginTop: '0.25rem' }}>
                {layout.description}
              </div>
            </div>
          ))}
          
          {suggestions.brandingTips && (
            <>
              <h4 style={{ color: '#667eea', marginBottom: '1rem', marginTop: '1.5rem' }}>
                💡 Branding Tips
              </h4>
              {suggestions.brandingTips.map((tip, index) => (
                <div key={index} style={{ fontSize: '0.75rem', color: '#A3485A', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                  • {tip}
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandingSuggestions;