import React, { useState, useEffect } from 'react';
import { logoAPI } from '../services/api';

const SavePanel = ({ canvas }) => {
  const [logoName, setLogoName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveLogo = async (isPublic = false) => {
    if (!canvas || !logoName) {
      alert('Please enter a logo name');
      return;
    }

    try {
      const canvasData = JSON.stringify(canvas.toJSON());
      const response = await logoAPI.createLogo({
        name: logoName,
        canvasData: canvasData,
        isPublic: isPublic
      }, user?.id);
      
      if (response.status === 200) {
        alert(`Logo saved ${isPublic ? 'publicly' : 'privately'} successfully!`);
        setLogoName('');
      }
    } catch (error) {
      console.error('Error saving logo:', error);
      const errorMsg = error.response?.data || 'Error saving logo';
      alert(errorMsg);
    }
  };

  return (
    <div className="save-panel">
      <div className="save-content">
        <h4>💾 Save Logo</h4>
        <div className="save-form">
          <input
            type="text"
            placeholder="Enter logo name"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            className="save-input"
          />
          <div className="save-buttons">
            <button 
              className="save-btn private" 
              onClick={() => saveLogo(false)}
              disabled={!logoName}
            >
              🔒 Save Private
            </button>
            <button 
              className="save-btn public" 
              onClick={() => saveLogo(true)}
              disabled={!logoName}
            >
              🌍 Save Public
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePanel;