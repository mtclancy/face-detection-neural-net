import React from 'react';
import type { TrainingData } from '../types';

interface InputVisualizerProps {
  data: TrainingData | null;
  prediction?: number;
  title?: string;
}

export const InputVisualizer: React.FC<InputVisualizerProps> = ({ 
  data, 
  prediction, 
  title = "Input Pattern" 
}) => {
  if (!data) {
    return (
      <div className="input-visualizer">
        <h3>{title}</h3>
        <div className="placeholder">No data to display</div>
      </div>
    );
  }

  // Convert 100-element array to 10x10 grid
  const grid: number[][] = [];
  for (let i = 0; i < 10; i++) {
    grid.push(data.inputs.slice(i * 10, (i + 1) * 10));
  }

  const label = data.label === 1 ? 'Face' : 'Non-Face';
  const labelColor = data.label === 1 ? '#4CAF50' : '#f44336';

  return (
    <div className="input-visualizer">
      <h3>{title}</h3>
      <div className="grid-container">
        <div className="grid-label" style={{ color: labelColor }}>
          Label: {label} ({data.label})
        </div>
        <div className="pixel-grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="pixel-row">
              {row.map((pixel, colIdx) => (
                <div
                  key={colIdx}
                  className="pixel"
                  style={{
                    backgroundColor: pixel === 1 ? '#000' : '#fff',
                    border: '1px solid #ccc'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        {prediction !== undefined && (
          <div className="prediction">
            Prediction: {prediction.toFixed(4)}
            <div className="prediction-bar">
              <div 
                className="prediction-fill"
                style={{ 
                  width: `${prediction * 100}%`,
                  backgroundColor: prediction > 0.5 ? '#4CAF50' : '#f44336'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

