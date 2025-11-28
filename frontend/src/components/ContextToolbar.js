import React, { useState, useEffect } from 'react';

const ContextToolbar = ({ canvas, history, setHistory, historyIndex, setHistoryIndex }) => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clipboard, setClipboard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showOnRightClick, setShowOnRightClick] = useState(false);
  const [canvasRightClick, setCanvasRightClick] = useState(false);

  const saveToHistory = () => {
    if (!canvas) return;
    const state = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = (e) => {
      const obj = e.selected?.[0];
      if (obj) {
        setSelectedObject(obj);
        setIsVisible(true);
        const objCoords = obj.getBoundingRect();
        const canvasElement = canvas.getElement();
        const canvasRect = canvasElement.getBoundingClientRect();
        
        setPosition({
          x: Math.min(Math.max(objCoords.left + objCoords.width + 20, 100), canvasRect.width - 100),
          y: Math.max(objCoords.top - 20, 10)
        });
      } else {
        setSelectedObject(null);
        setIsVisible(false);
      }
    };

    const handleDeselection = () => {
      setSelectedObject(null);
      setIsVisible(false);
      setShowOnRightClick(false);
      setCanvasRightClick(false);
    };
    
    const handleRightClick = (e) => {
      e.preventDefault();
      const pointer = canvas.getPointer(e.e);
      const obj = canvas.findTarget(e.e);
      
      if (obj) {
        canvas.setActiveObject(obj);
        setSelectedObject(obj);
        setIsVisible(true);
        setShowOnRightClick(true);
        setCanvasRightClick(false);
        
        const objCoords = obj.getBoundingRect();
        const canvasElement = canvas.getElement();
        const canvasRect = canvasElement.getBoundingClientRect();
        
        setPosition({
          x: Math.min(Math.max(pointer.x + 30, 100), canvasRect.width - 100),
          y: Math.max(pointer.y - 20, 10)
        });
      } else {
        // Right-click on empty canvas
        setSelectedObject(null);
        setIsVisible(false);
        setShowOnRightClick(false);
        setCanvasRightClick(true);
        
        setPosition({
          x: Math.min(Math.max(pointer.x, 50), canvas.width - 50),
          y: Math.max(pointer.y - 30, 10)
        });
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleDeselection);
    canvas.on('mouse:down', (e) => {
      if (e.e.button === 2) handleRightClick(e);
    });

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleDeselection);
      canvas.off('mouse:down');
    };
  }, [canvas]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedObject || !canvas) return;
      
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copyObject();
      } else if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        cutObject();
      } else if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        pasteObject();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, canvas, clipboard]);

  const removeObject = () => {
    if (selectedObject && canvas) {
      canvas.remove(selectedObject);
      canvas.renderAll();
      setSelectedObject(null);
      setTimeout(saveToHistory, 100);
    }
  };

  const copyObject = () => {
    if (selectedObject) {
      selectedObject.clone((cloned) => {
        setClipboard(cloned);
      });
    }
  };

  const cutObject = () => {
    if (selectedObject && canvas) {
      selectedObject.clone((cloned) => {
        setClipboard(cloned);
        canvas.remove(selectedObject);
        canvas.renderAll();
        setSelectedObject(null);
        setTimeout(saveToHistory, 100);
      });
    }
  };

  const pasteObject = () => {
    if (clipboard && canvas) {
      clipboard.clone((cloned) => {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
        setTimeout(saveToHistory, 100);
      });
    }
  };

  if ((!selectedObject || (!isVisible && !showOnRightClick)) && !canvasRightClick) return null;

  return (
    <div 
      className="context-toolbar"
      style={{
        position: 'absolute',
        left: position.x - (canvasRightClick ? 15 : 60),
        top: position.y,
        zIndex: 1000,
        pointerEvents: 'auto'
      }}
    >
      {canvasRightClick ? (
        <button 
          className="context-btn" 
          onClick={pasteObject} 
          disabled={!clipboard}
          title="Paste"
        >
          📄
        </button>
      ) : (
        <>
          <button className="context-btn" onClick={cutObject} title="Cut">
            ✂️
          </button>
          <button className="context-btn" onClick={copyObject} title="Copy">
            📋
          </button>
          <button 
            className="context-btn" 
            onClick={pasteObject} 
            disabled={!clipboard}
            title="Paste"
          >
            📄
          </button>
          <button className="context-btn" onClick={removeObject} title="Delete">
            🗑️
          </button>
        </>
      )}
    </div>
  );
};

export default ContextToolbar;