import React, { useState, useEffect } from 'react';
import LogoCanvas from './components/LogoCanvas';
import Toolbar from './components/Toolbar';
import BrandingSuggestions from './components/BrandingSuggestions';
import SavedLogos from './components/SavedLogos';
import LogoGenerator from './components/LogoGenerator';
import ContextToolbar from './components/ContextToolbar';
import Login from './components/Login';
import Register from './components/Register';
import GlobalLogos from './components/GlobalLogos';
import './App.css';
import './ModernTheme.css';

function App() {
  const [selectedTool, setSelectedTool] = useState('select');
  const [canvas, setCanvas] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [currentView, setCurrentView] = useState('editor');
  const [isModernUI, setIsModernUI] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedTheme = localStorage.getItem('modernUI');
    if (savedTheme === 'true') {
      setIsModernUI(true);
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = !isModernUI;
    setIsModernUI(newTheme);
    localStorage.setItem('modernUI', newTheme.toString());
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return showRegister ? (
      <Register 
        onRegister={handleRegister} 
        switchToLogin={() => setShowRegister(false)} 
      />
    ) : (
      <Login 
        onLogin={handleLogin} 
        switchToRegister={() => setShowRegister(true)} 
      />
    );
  }

  return (
    <div className={`app ${isModernUI ? 'modern-theme' : 'classic-theme'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>Custom Logo Builder</h1>
          <nav className="nav-menu">
            <button 
              className={`nav-btn ${currentView === 'editor' ? 'active' : ''}`}
              onClick={() => setCurrentView('editor')}
            >
              Editor
            </button>
            <button 
              className={`nav-btn ${currentView === 'global' ? 'active' : ''}`}
              onClick={() => setCurrentView('global')}
            >
              Global Gallery
            </button>
          </nav>
          <div className="user-info">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle-btn"
              title={`Switch to ${isModernUI ? 'Classic' : 'Modern'} UI`}
            >
              {isModernUI ? '🎨' : '✨'}
            </button>
            <span>Welcome, {user.username}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      
      <div className="app-content">
        {currentView === 'editor' ? (
          <>
            <div className="left-panel">
              <Toolbar 
                selectedTool={selectedTool} 
                setSelectedTool={setSelectedTool}
                canvas={canvas}
                history={history}
                setHistory={setHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
              />
              <LogoGenerator canvas={canvas} />
              <BrandingSuggestions canvas={canvas} />
              <SavedLogos canvas={canvas} user={user} />
            </div>
            
            <div className="canvas-container" style={{ position: 'relative' }}>
              <LogoCanvas 
                selectedTool={selectedTool}
                setCanvas={setCanvas}
                history={history}
                setHistory={setHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
              />
              <ContextToolbar 
                canvas={canvas}
                history={history}
                setHistory={setHistory}
                historyIndex={historyIndex}
                setHistoryIndex={setHistoryIndex}
              />
            </div>
          </>
        ) : (
          <div className="global-view">
            <GlobalLogos canvas={canvas} switchToEditor={() => setCurrentView('editor')} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;