import React, { useState } from 'react';
import LogoGenerator from './LogoGenerator';
import BrandingSuggestions from './BrandingSuggestions';

const AITools = ({ canvas }) => {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="ai-tools">
      <h3>✨ AI Tools</h3>
      <div className="ai-tabs">
        <button 
          className={`ai-tab ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          🎨 Logo Generator
        </button>
        <button 
          className={`ai-tab ${activeTab === 'branding' ? 'active' : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          🎯 Branding
        </button>
      </div>
      <div className="ai-content">
        {activeTab === 'generator' ? (
          <LogoGenerator canvas={canvas} />
        ) : (
          <BrandingSuggestions canvas={canvas} />
        )}
      </div>
    </div>
  );
};

export default AITools;
