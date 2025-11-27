import React from 'react';

const Templates = ({ canvas }) => {
  const templates = [
    {
      name: 'Modern Circle',
      data: {
        objects: [
          { type: 'circle', left: 350, top: 250, radius: 80, fill: '#667eea', stroke: '#764ba2', strokeWidth: 3 },
          { type: 'text', left: 400, top: 360, text: 'YOUR BRAND', fontFamily: 'Arial', fontSize: 32, fill: '#667eea', fontWeight: 'bold', originX: 'center' }
        ]
      }
    },
    {
      name: 'Corporate Shield',
      data: {
        objects: [
          { type: 'polygon', left: 350, top: 200, points: [{x: 0, y: -80}, {x: 60, y: -40}, {x: 60, y: 40}, {x: 0, y: 80}, {x: -60, y: 40}, {x: -60, y: -40}], fill: '#842A3B', stroke: '#A3485A', strokeWidth: 3 },
          { type: 'text', left: 400, top: 340, text: 'COMPANY', fontFamily: 'Arial', fontSize: 28, fill: '#842A3B', fontWeight: 'bold', originX: 'center' }
        ]
      }
    },
    {
      name: 'Tech Hexagon',
      data: {
        objects: [
          { type: 'polygon', left: 350, top: 220, points: [{x: 0, y: -60}, {x: 52, y: -30}, {x: 52, y: 30}, {x: 0, y: 60}, {x: -52, y: 30}, {x: -52, y: -30}], fill: '#059669', stroke: '#047857', strokeWidth: 3 },
          { type: 'text', left: 400, top: 330, text: 'TECH', fontFamily: 'Arial', fontSize: 30, fill: '#059669', fontWeight: 'bold', originX: 'center' }
        ]
      }
    },
    {
      name: 'Creative Star',
      data: {
        objects: [
          { type: 'polygon', left: 350, top: 230, points: [{x: 0, y: -50}, {x: 15, y: -15}, {x: 50, y: -10}, {x: 20, y: 10}, {x: 30, y: 45}, {x: 0, y: 25}, {x: -30, y: 45}, {x: -20, y: 10}, {x: -50, y: -10}, {x: -15, y: -15}], fill: '#f59e0b', stroke: '#d97706', strokeWidth: 2 },
          { type: 'text', left: 400, top: 330, text: 'CREATIVE', fontFamily: 'Arial', fontSize: 26, fill: '#f59e0b', fontWeight: 'bold', originX: 'center' }
        ]
      }
    },
    {
      name: 'Minimal Square',
      data: {
        objects: [
          { type: 'rect', left: 320, top: 220, width: 160, height: 160, fill: 'transparent', stroke: '#6366f1', strokeWidth: 4, rx: 10, ry: 10 },
          { type: 'text', left: 400, top: 300, text: 'BRAND', fontFamily: 'Arial', fontSize: 36, fill: '#6366f1', fontWeight: 'bold', originX: 'center', originY: 'center' }
        ]
      }
    },
    {
      name: 'Diamond Elite',
      data: {
        objects: [
          { type: 'polygon', left: 350, top: 230, points: [{x: 0, y: -60}, {x: 50, y: 0}, {x: 0, y: 60}, {x: -50, y: 0}], fill: '#8b5cf6', stroke: '#7c3aed', strokeWidth: 3 },
          { type: 'text', left: 400, top: 340, text: 'ELITE', fontFamily: 'Arial', fontSize: 30, fill: '#8b5cf6', fontWeight: 'bold', originX: 'center' }
        ]
      }
    }
  ];

  const applyTemplate = (template) => {
    if (!canvas) return;
    
    canvas.clear();
    canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
    
    template.data.objects.forEach(obj => {
      let fabricObj;
      switch (obj.type) {
        case 'circle':
          fabricObj = new window.fabric.Circle(obj);
          break;
        case 'rect':
          fabricObj = new window.fabric.Rect(obj);
          break;
        case 'polygon':
          fabricObj = new window.fabric.Polygon(obj.points, obj);
          break;
        case 'text':
          fabricObj = new window.fabric.Text(obj.text, obj);
          break;
        default:
          return;
      }
      canvas.add(fabricObj);
    });
    
    canvas.renderAll();
  };

  return (
    <div className="templates-panel">
      <h3>Logo Templates</h3>
      <div className="templates-grid">
        {templates.map((template, index) => (
          <div key={index} className="template-card" onClick={() => applyTemplate(template)}>
            <div className="template-preview">
              <div style={{ fontSize: '2rem', color: '#667eea' }}>🎨</div>
            </div>
            <div className="template-name">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
