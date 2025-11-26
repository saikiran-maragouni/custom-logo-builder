import React, { useState } from 'react';
import { fabric } from 'fabric';
import { logoAPI } from '../services/api';

const Toolbar = ({ selectedTool, setSelectedTool, canvas, history, setHistory, historyIndex, setHistoryIndex }) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [logoName, setLogoName] = useState('');
  const [user, setUser] = useState(null);
  const [customText, setCustomText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [selectedShape, setSelectedShape] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textOpacity, setTextOpacity] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const undo = () => {
    if (historyIndex > 0 && canvas && history.length > 0) {
      const newIndex = historyIndex - 1;
      const state = history[newIndex];
      if (state) {
        canvas.loadFromJSON(state, () => {
          canvas.renderAll();
        });
        setHistoryIndex(newIndex);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1 && canvas && history.length > 0) {
      const newIndex = historyIndex + 1;
      const state = history[newIndex];
      if (state) {
        canvas.loadFromJSON(state, () => {
          canvas.renderAll();
        });
        setHistoryIndex(newIndex);
      }
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, canvas]);

  const saveToHistory = () => {
    if (!canvas) return;
    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Add drawing history save
  React.useEffect(() => {
    if (!canvas) return;
    
    const handlePathCreated = () => {
      setTimeout(saveToHistory, 100);
    };
    
    canvas.on('path:created', handlePathCreated);
    
    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [canvas, saveToHistory]);

  const addShape = (shapeType) => {
    if (!canvas) return;

    let shape;
    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 60,
          fill: selectedColor,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: selectedColor,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: 100,
          top: 100,
          width: 80,
          height: 80,
          fill: selectedColor,
        });
        break;
      case 'star':
        const starPoints = [];
        const outerRadius = 50;
        const innerRadius = 25;
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          starPoints.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
          });
        }
        shape = new fabric.Polygon(starPoints, {
          left: 100,
          top: 100,
          fill: selectedColor,
        });
        break;
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          hexPoints.push({
            x: Math.cos(angle) * 40,
            y: Math.sin(angle) * 40
          });
        }
        shape = new fabric.Polygon(hexPoints, {
          left: 100,
          top: 100,
          fill: selectedColor,
        });
        break;
      case 'diamond':
        const diamondPoints = [
          { x: 0, y: -40 },
          { x: 40, y: 0 },
          { x: 0, y: 40 },
          { x: -40, y: 0 }
        ];
        shape = new fabric.Polygon(diamondPoints, {
          left: 100,
          top: 100,
          fill: selectedColor,
        });
        break;
      case 'arrow':
        const arrowPoints = [
          { x: -30, y: -10 },
          { x: 20, y: -10 },
          { x: 20, y: -20 },
          { x: 40, y: 0 },
          { x: 20, y: 20 },
          { x: 20, y: 10 },
          { x: -30, y: 10 }
        ];
        shape = new fabric.Polygon(arrowPoints, {
          left: 100,
          top: 100,
          fill: selectedColor,
        });
        break;
      case 'ellipse':
        shape = new fabric.Ellipse({
          left: 100,
          top: 100,
          rx: 60,
          ry: 30,
          fill: selectedColor,
        });
        break;
      case 'line':
        shape = new fabric.Line([50, 100, 200, 100], {
          left: 100,
          top: 100,
          stroke: selectedColor,
          strokeWidth: 3,
        });
        break;
      default:
        return;
    }
    canvas.add(shape);
    canvas.renderAll();
    setTimeout(saveToHistory, 100);
  };

  const addText = () => {
    if (!canvas) return;
    
    const textToAdd = customText || 'Your Text';
    const text = new fabric.Text(textToAdd, {
      left: 150,
      top: 150,
      fontFamily: fontFamily,
      fontSize: fontSize,
      fill: selectedColor,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      opacity: textOpacity,
      selectable: true,
      editable: true
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    setTimeout(saveToHistory, 100);
  };
  
  const updateSelectedText = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      activeObject.set({
        fontFamily: fontFamily,
        fontSize: fontSize,
        fill: selectedColor,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        opacity: textOpacity
      });
      canvas.renderAll();
      setTimeout(saveToHistory, 100);
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !canvas) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        canvas.add(img);
        canvas.renderAll();
        setTimeout(saveToHistory, 100);
      });
    };
    reader.readAsDataURL(file);
  };

  const saveLogo = async (isPublic = false) => {
    if (!canvas || !logoName) {
      alert('Please enter a logo name');
      return;
    }

    if (!user?.id) {
      alert('Please log in to save logos');
      return;
    }

    try {
      const canvasData = JSON.stringify(canvas.toJSON());
      console.log('Saving logo:', { name: logoName, isPublic, userId: user.id });
      
      const response = await logoAPI.createLogo({
        name: logoName,
        canvasData: canvasData,
        isPublic: isPublic
      }, user.id);
      
      if (response.status === 200) {
        alert(`Logo saved ${isPublic ? 'publicly' : 'privately'} successfully!`);
        setLogoName('');
        window.dispatchEvent(new CustomEvent('logoSaved'));
      }
    } catch (error) {
      console.error('Full error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMsg = 'Error saving logo';
      if (error.response?.data) {
        errorMsg = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(errorMsg);
    }
  };

  return (
    <div className="toolbar">
      <h3>Tools</h3>
      
      <div className="tool-group">
        <h4>History</h4>
        <div className="tool-buttons">
          <button
            className="tool-btn"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            className="tool-btn"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
          >
            Redo
          </button>
        </div>
      </div>

      <div className="tool-group">
        <h4>Selection</h4>
        <div className="tool-buttons">
          <button
            className={`tool-btn ${selectedTool === 'select' ? 'active' : ''}`}
            onClick={() => setSelectedTool('select')}
          >
            Select
          </button>
          <button
            className={`tool-btn ${selectedTool === 'draw' ? 'active' : ''}`}
            onClick={() => setSelectedTool('draw')}
          >
            Draw
          </button>
        </div>
      </div>

      <div className="tool-group">
        <h4>Basic Shapes</h4>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => addShape('rectangle')}>
            Rectangle
          </button>
          <button className="tool-btn" onClick={() => addShape('circle')}>
            Circle
          </button>
          <button className="tool-btn" onClick={() => addShape('triangle')}>
            Triangle
          </button>
          <button className="tool-btn" onClick={() => addShape('ellipse')}>
            Ellipse
          </button>
        </div>
      </div>

      <div className="tool-group">
        <h4>Advanced Shapes</h4>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => addShape('star')}>
            Star
          </button>
          <button className="tool-btn" onClick={() => addShape('hexagon')}>
            Hexagon
          </button>
          <button className="tool-btn" onClick={() => addShape('diamond')}>
            Diamond
          </button>
          <button className="tool-btn" onClick={() => addShape('arrow')}>
            Arrow
          </button>
        </div>
      </div>

      <div className="tool-group">
        <h4>Lines</h4>
        <div className="tool-buttons">
          <button className="tool-btn" onClick={() => addShape('line')}>
            Line
          </button>
        </div>
      </div>

      <div className="tool-group">
        <h4>Text</h4>
        <input
          type="text"
          placeholder="Enter your text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '8px', border: '2px solid #A3485A' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <select 
            value={fontFamily} 
            onChange={(e) => { setFontFamily(e.target.value); updateSelectedText(); }}
            style={{ flex: 1, padding: '0.25rem', borderRadius: '6px', border: '2px solid #A3485A' }}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Impact">Impact</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Courier New">Courier New</option>
            <option value="Palatino">Palatino</option>
            <option value="Garamond">Garamond</option>
            <option value="Bookman">Bookman</option>
            <option value="Avant Garde">Avant Garde</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Monaco">Monaco</option>
          </select>
          <input
            type="number"
            value={fontSize}
            onChange={(e) => { setFontSize(parseInt(e.target.value)); updateSelectedText(); }}
            min="8"
            max="100"
            style={{ width: '60px', padding: '0.25rem', borderRadius: '6px', border: '2px solid #A3485A' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button 
            className={`tool-btn ${isBold ? 'active' : ''}`}
            onClick={() => { setIsBold(!isBold); updateSelectedText(); }}
            style={{ flex: 1, fontWeight: 'bold' }}
          >
            B
          </button>
          <button 
            className={`tool-btn ${isItalic ? 'active' : ''}`}
            onClick={() => { setIsItalic(!isItalic); updateSelectedText(); }}
            style={{ flex: 1, fontStyle: 'italic' }}
          >
            I
          </button>
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: '#842A3B' }}>Opacity: {Math.round(textOpacity * 100)}%</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={textOpacity}
            onChange={(e) => { setTextOpacity(parseFloat(e.target.value)); updateSelectedText(); }}
            style={{ width: '100%' }}
          />
        </div>
        
        <button className="tool-btn" onClick={addText} style={{ width: '100%', marginBottom: '0.5rem' }}>
          Add Text
        </button>
      </div>

      <div className="tool-group">
        <h4>Color</h4>
        <div className="color-picker">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>
      </div>

      <div className="tool-group">
        <h4>Graphics</h4>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '8px', border: '2px solid #A3485A' }}
        />
      </div>

      <div className="tool-group">
        <h4>Save Logo</h4>
        <input
          type="text"
          placeholder="Logo name"
          value={logoName}
          onChange={(e) => setLogoName(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '8px', border: '2px solid #A3485A' }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="tool-btn" onClick={() => saveLogo(false)} style={{ flex: 1 }}>
            Save Private
          </button>
          <button className="tool-btn" onClick={() => saveLogo(true)} style={{ flex: 1 }}>
            Save Public
          </button>
        </div>
      </div>


    </div>
  );
};

export default Toolbar;