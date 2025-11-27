import React, { useState } from 'react';

const Preview = ({ canvas }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewBg, setPreviewBg] = useState('#ffffff');

  const backgrounds = [
    { name: 'White', color: '#ffffff' },
    { name: 'Black', color: '#000000' },
    { name: 'Gray', color: '#6b7280' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Green', color: '#10b981' }
  ];

  const generatePreview = () => {
    if (!canvas) return null;
    return canvas.toDataURL({ format: 'png', quality: 1 });
  };

  return (
    <div className="preview-panel">
      <h3>Logo Preview</h3>
      <button 
        className="tool-btn" 
        onClick={() => setShowPreview(!showPreview)}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </button>

      {showPreview && (
        <div className="preview-container">
          <div className="preview-backgrounds">
            {backgrounds.map((bg, index) => (
              <button
                key={index}
                className={`preview-bg-btn ${previewBg === bg.color ? 'active' : ''}`}
                style={{ backgroundColor: bg.color }}
                onClick={() => setPreviewBg(bg.color)}
                title={bg.name}
              />
            ))}
          </div>
          <div 
            className="preview-display" 
            style={{ backgroundColor: previewBg }}
          >
            {canvas && (
              <img 
                src={generatePreview()} 
                alt="Logo Preview" 
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Preview;
