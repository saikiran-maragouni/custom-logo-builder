import React, { useState, useEffect } from 'react';
import { logoAPI } from '../services/api';

const GlobalLogos = ({ canvas, switchToEditor }) => {
  const [publicLogos, setPublicLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicLogos();
  }, []);

  const fetchPublicLogos = async () => {
    try {
      const response = await logoAPI.getPublicLogos();
      setPublicLogos(response.data);
    } catch (error) {
      console.error('Error fetching public logos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLogoToCanvas = (logo) => {
    if (!logo.canvasData) {
      alert('Logo data is empty or corrupted.');
      return;
    }
    
    try {
      console.log('Loading logo to canvas:', logo.name);
      
      // Store logo data in localStorage for the editor to pick up
      localStorage.setItem('logoToLoad', JSON.stringify({
        name: logo.name,
        canvasData: logo.canvasData,
        timestamp: Date.now()
      }));
      
      // Switch to editor view
      if (switchToEditor) {
        switchToEditor();
        alert('Switched to Editor. Logo will load automatically.');
      } else {
        alert('Logo data saved. Please switch to Editor to see it.');
      }
      
    } catch (error) {
      console.error('Error preparing logo:', error);
      alert('Error loading logo: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="global-logos">
        <h3>🌍 Global Logo Gallery</h3>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading">Loading public logos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="global-logos">
      <h3>🌍 Global Logo Gallery</h3>
      <p style={{ fontSize: '0.875rem', color: '#A3485A', marginBottom: '1rem' }}>
        Discover amazing logos created by our community
      </p>
      
      {publicLogos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#A3485A' }}>
          No public logos available yet. Be the first to share your creation!
        </div>
      ) : (
        <div className="logos-grid">
          {publicLogos.map((logo) => (
            <div key={logo.id} className="logo-card">
              <div className="logo-preview-small">
                <div style={{ fontSize: '0.75rem', color: '#842A3B', fontWeight: 'bold' }}>
                  {logo.name}
                </div>
              </div>
              <div className="logo-details">
                <div className="logo-name">{logo.name}</div>
                <div className="logo-author">by @{logo.username}</div>
                <div className="logo-date">
                  {new Date(logo.createdAt).toLocaleDateString()}
                </div>
                <button 
                  className="load-btn"
                  onClick={() => loadLogoToCanvas(logo)}
                  title="Load this logo to canvas"
                >
                  Load to Canvas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalLogos;