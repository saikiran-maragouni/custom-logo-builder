import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const LogoCanvas = ({ selectedTool, setCanvas, history, setHistory, historyIndex, setHistoryIndex }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = canvas;
    setCanvas(canvas);

    // Save initial state
    const initialState = JSON.stringify(canvas.toJSON());
    setHistory([initialState]);
    setHistoryIndex(0);

    // Check for logo to load from localStorage
    const logoToLoad = localStorage.getItem('logoToLoad');
    if (logoToLoad) {
      try {
        const logoData = JSON.parse(logoToLoad);
        const canvasData = JSON.parse(logoData.canvasData);
        
        canvas.loadFromJSON(canvasData, () => {
          canvas.renderAll();
          console.log('Logo loaded from Global Gallery');
        });
        
        // Clear the stored logo data
        localStorage.removeItem('logoToLoad');
      } catch (error) {
        console.error('Error loading stored logo:', error);
        localStorage.removeItem('logoToLoad');
      }
    }

    return () => {
      canvas.dispose();
    };
  }, [setCanvas, setHistory, setHistoryIndex]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = selectedTool === 'draw';
    canvas.selection = selectedTool === 'select';

    if (selectedTool === 'draw') {
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = '#000000';
    }
  }, [selectedTool]);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default LogoCanvas;