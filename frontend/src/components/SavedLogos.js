import React, { useState, useEffect } from 'react';
import { logoAPI } from '../services/api';

const SavedLogos = ({ canvas, user }) => {
  const [savedLogos, setSavedLogos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSavedLogos();
    }
  }, [user]);
  
  useEffect(() => {
    const handleLogoSaved = () => {
      loadSavedLogos();
    };
    
    window.addEventListener('logoSaved', handleLogoSaved);
    return () => window.removeEventListener('logoSaved', handleLogoSaved);
  }, []);

  const loadSavedLogos = async () => {
    if (!user?.id) {
      setSavedLogos([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await logoAPI.getAllLogos(user.id);
      console.log('Loaded logos:', response.data);
      setSavedLogos(response.data || []);
    } catch (error) {
      console.error('Error loading logos:', error);
      setSavedLogos([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLogo = async (logo) => {
    if (!canvas) return;

    try {
      const canvasData = JSON.parse(logo.canvasData);
      canvas.loadFromJSON(canvasData, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const deleteLogo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this logo?')) return;

    try {
      await logoAPI.deleteLogo(id);
      alert('Logo deleted successfully!');
      loadSavedLogos();
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Error deleting logo. Please try again.');
    }
  };

  return (
    <div className="saved-logos">
      <h3>Saved Logos</h3>
      
      <button 
        className="tool-btn" 
        onClick={loadSavedLogos}
        style={{ width: '100%', marginBottom: '1rem' }}
      >
        Refresh
      </button>

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '2rem', color: '#667eea' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>✨ Loading logos...</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Please wait while we fetch your designs</div>
        </div>
      ) : savedLogos.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
          borderRadius: '12px',
          border: '2px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
          <div style={{ color: '#667eea', fontWeight: '600', marginBottom: '0.25rem' }}>No saved logos found</div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Create and save a logo first!</div>
        </div>
      ) : (
        <div className="logos-list">
          {savedLogos.map((logo) => (
            <div key={logo.id} className="logo-item">
              <div className="logo-name">{logo.name}</div>
              <div className="logo-actions">
                <button 
                  className="tool-btn"
                  onClick={() => loadLogo(logo)}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  Load
                </button>
                <button 
                  className="tool-btn"
                  onClick={() => deleteLogo(logo.id)}
                  style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem',
                    background: '#dc2626',
                    color: 'white',
                    marginLeft: '0.25rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLogos;