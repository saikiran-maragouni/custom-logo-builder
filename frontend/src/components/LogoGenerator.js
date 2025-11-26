import React, { useState, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { fabric } from 'fabric';

const LogoGenerator = ({ canvas }) => {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [keywords, setKeywords] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [generatedLogos, setGeneratedLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [realtimePreview, setRealtimePreview] = useState(null);

  const logoStyles = ['Abstract', 'Mascot', 'Emblem', 'Corporate', 'Wordmark', 'Vintage', 'Classic'];
  const colors = ['Blue', 'Purple', 'Pink', 'Red', 'Orange', 'Green', 'Grayscale'];

  const generateLogos = async () => {
    if (!businessName || !industry) return;

    setLoading(true);
    try {
      const response = await aiAPI.getLogoSuggestions({
        businessName,
        keywords: `${industry}, ${keywords}`.trim().replace(/^,\s*|,\s*$/g, ''),
        style: selectedStyle,
        color: selectedColor
      });
      
      let suggestions;
      try {
        suggestions = JSON.parse(response.data);
      } catch {
        suggestions = getDefaultLogoSuggestions();
      }
      
      setGeneratedLogos(suggestions.logos || []);
    } catch (error) {
      console.error('Error generating logos:', error);
      setGeneratedLogos(getDefaultLogoSuggestions().logos);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultLogoSuggestions = () => ({
    logos: [
      {
        name: `${businessName} Corporate`,
        description: 'Professional rectangular frame with bold typography, conveying stability and trust',
        elements: ['rectangle', 'text'],
        colors: ['#2563eb', '#ffffff'],
        layout: 'Horizontal lockup',
        symbolism: 'Foundation and reliability'
      },
      {
        name: `${businessName} Dynamic`,
        description: 'Circular icon with integrated text, representing unity and continuous growth',
        elements: ['circle', 'text', 'star'],
        colors: ['#059669', '#ffffff'],
        layout: 'Icon above text',
        symbolism: 'Innovation and excellence'
      },
      {
        name: `${businessName} Premium`,
        description: 'Sophisticated diamond and arrow combination suggesting forward movement and premium quality',
        elements: ['diamond', 'arrow', 'text'],
        colors: ['#7c3aed', '#fbbf24'],
        layout: 'Integrated design',
        symbolism: 'Luxury and progress'
      }
    ]
  });

  const applyLogoToCanvas = (logo) => {
    if (!canvas) return;

    canvas.clear();
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let textElement = null;
    const shapes = [];

    // Create shapes first
    logo.elements.forEach((element, index) => {
      if (element === 'text') return;
      
      let shape;
      const color = logo.colors[index % logo.colors.length];
      const baseSize = 60;

      switch (element) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: centerX - baseSize,
            top: centerY - baseSize/2,
            width: baseSize * 2,
            height: baseSize,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2,
            rx: 8,
            ry: 8
          });
          break;
        case 'circle':
          shape = new fabric.Circle({
            left: centerX - baseSize/2,
            top: centerY - baseSize/2,
            radius: baseSize/2,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2
          });
          break;
        case 'triangle':
          shape = new fabric.Triangle({
            left: centerX - baseSize/2,
            top: centerY - baseSize/2,
            width: baseSize,
            height: baseSize,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2
          });
          break;
        case 'star':
          const starPoints = [];
          const outerRadius = baseSize/2;
          const innerRadius = baseSize/4;
          for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            starPoints.push({
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius
            });
          }
          shape = new fabric.Polygon(starPoints, {
            left: centerX - baseSize/2,
            top: centerY - baseSize/2,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2
          });
          break;
        case 'diamond':
          const diamondPoints = [
            { x: 0, y: -baseSize/2 },
            { x: baseSize/2, y: 0 },
            { x: 0, y: baseSize/2 },
            { x: -baseSize/2, y: 0 }
          ];
          shape = new fabric.Polygon(diamondPoints, {
            left: centerX - baseSize/2,
            top: centerY - baseSize/2,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2
          });
          break;
        case 'arrow':
          const arrowPoints = [
            { x: -baseSize/2, y: -baseSize/4 },
            { x: baseSize/4, y: -baseSize/4 },
            { x: baseSize/4, y: -baseSize/2 },
            { x: baseSize/2, y: 0 },
            { x: baseSize/4, y: baseSize/2 },
            { x: baseSize/4, y: baseSize/4 },
            { x: -baseSize/2, y: baseSize/4 }
          ];
          shape = new fabric.Polygon(arrowPoints, {
            left: centerX - baseSize/2,
            top: centerY - baseSize/2,
            fill: color,
            stroke: logo.colors[1] || '#000000',
            strokeWidth: 2
          });
          break;
      }

      if (shape) {
        shapes.push(shape);
        canvas.add(shape);
      }
    });

    // Add text element
    if (logo.elements.includes('text')) {
      const textColor = logo.colors.find(c => c !== shapes[0]?.fill) || '#000000';
      textElement = new fabric.Text(businessName, {
        left: centerX,
        top: centerY + 80,
        fontFamily: 'Arial',
        fontSize: 28,
        fill: textColor,
        fontWeight: 'bold',
        textAlign: 'center',
        originX: 'center',
        originY: 'center'
      });
      canvas.add(textElement);
    }

    canvas.renderAll();
  };
  
  const generateRealtimePreview = () => {
    if (!businessName) return;
    
    const preview = {
      name: `${businessName} Live`,
      description: 'Real-time generated preview',
      elements: ['circle', 'text'],
      colors: getColorFromStyle(),
      layout: 'Centered',
      symbolism: 'Dynamic preview'
    };
    
    setRealtimePreview(preview);
  };
  
  const getColorFromStyle = () => {
    const colorMap = {
      'Blue': ['#2563eb', '#ffffff'],
      'Purple': ['#7c3aed', '#ffffff'],
      'Pink': ['#ec4899', '#ffffff'],
      'Red': ['#dc2626', '#ffffff'],
      'Orange': ['#ea580c', '#ffffff'],
      'Green': ['#059669', '#ffffff'],
      'Grayscale': ['#374151', '#ffffff']
    };
    return colorMap[selectedColor] || ['#2563eb', '#ffffff'];
  };
  
  useEffect(() => {
    if (businessName) {
      generateRealtimePreview();
    }
  }, [businessName, selectedStyle, selectedColor]);

  return (
    <div className="logo-generator">
      <h3>AI Logo Generator</h3>
      
      <div className="generator-form">
        <input
          type="text"
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Industry (e.g., Healthcare, Technology)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <input
          type="text"
          placeholder="Additional keywords (optional)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        
        <div className="filters">
          <h4>Logo Styles</h4>
          <div className="filter-options">
            {logoStyles.map(style => (
              <button
                key={style}
                className={`filter-btn ${selectedStyle === style ? 'active' : ''}`}
                onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
              >
                {style}
              </button>
            ))}
          </div>
          
          <h4>Colors</h4>
          <div className="filter-options">
            {colors.map(color => (
              <button
                key={color}
                className={`filter-btn ${selectedColor === color ? 'active' : ''}`}
                onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={`generate-btn ${loading ? 'loading' : ''}`}
          onClick={generateLogos}
          disabled={loading || !businessName || !industry}
        >
          {loading ? (
            <span>
              ✨ Generating amazing logos...
            </span>
          ) : (
            <span>
              🎨 Generate Logos
            </span>
          )}
        </button>
      </div>

      {generatedLogos.length > 0 && (
        <div className="generated-logos">
          <h4 style={{ color: '#667eea', marginBottom: '1rem' }}>
            ✨ Generated Logo Ideas
          </h4>
          <div className="logo-suggestions">
            {generatedLogos.map((logo, index) => (
              <div key={index} className="logo-suggestion">
                <div className="logo-preview">
                  <div className="logo-placeholder" style={{ background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1] || logo.colors[0]})` }}>
                    <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {businessName.charAt(0)}
                    </div>
                  </div>
                </div>
                <div className="logo-info">
                  <div className="logo-title">{logo.name}</div>
                  <div className="logo-desc" style={{ marginBottom: '0.5rem' }}>{logo.description}</div>
                  {logo.symbolism && (
                    <div style={{ fontSize: '0.75rem', color: '#A3485A', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                      Symbolism: {logo.symbolism}
                    </div>
                  )}
                  {logo.layout && (
                    <div style={{ fontSize: '0.75rem', color: '#667eea', marginBottom: '0.5rem' }}>
                      Layout: {logo.layout}
                    </div>
                  )}
                  <div className="color-palette" style={{ marginBottom: '0.75rem' }}>
                    {logo.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="color-swatch"
                        style={{ backgroundColor: color, width: '20px', height: '20px' }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button 
                    className="apply-btn"
                    onClick={() => applyLogoToCanvas(logo)}
                  >
                    Apply to Canvas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoGenerator;