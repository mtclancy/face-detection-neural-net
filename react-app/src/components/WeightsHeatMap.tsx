import React from 'react';
import { Neuron } from '../Neuron';

interface WeightsHeatMapProps {
  neuron: Neuron | null;
  title?: string;
}

export const WeightsHeatMap: React.FC<WeightsHeatMapProps> = ({ 
  neuron, 
  title = "Neuron Weights" 
}) => {
  if (!neuron) {
    return (
      <div className="weights-heatmap">
        <h3>{title}</h3>
        <div className="placeholder">No neuron data available</div>
      </div>
    );
  }

  // Convert 100-element array to 10x10 grid
  const weightGrid: number[][] = [];
  for (let i = 0; i < 10; i++) {
    weightGrid.push(neuron.weights.slice(i * 10, (i + 1) * 10));
  }

  const getWeightColor = (weight: number): string => {
    const intensity = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      return `rgba(76, 175, 80, ${intensity})`; // Green for positive
    } else {
      return `rgba(244, 67, 54, ${intensity})`; // Red for negative
    }
  };

  return (
    <div className="weights-heatmap">
      <h3>{title}</h3>
      <div className="grid-container">
        <div className="pixel-grid">
          {weightGrid.map((row, rowIdx) => (
            <div key={rowIdx} className="pixel-row">
              {row.map((weight, colIdx) => (
                <div
                  key={colIdx}
                  className="pixel weight-pixel"
                  style={{
                    backgroundColor: getWeightColor(weight),
                    border: '1px solid #ccc',
                    color: Math.abs(weight) > 0.5 ? '#fff' : '#000',
                    fontSize: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={`Weight: ${weight.toFixed(3)}`}
                >
                  {weight.toFixed(2)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="weight-legend">
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'rgba(76, 175, 80, 0.8)' }}></span>
            Positive
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: 'rgba(244, 67, 54, 0.8)' }}></span>
            Negative
          </span>
        </div>
      </div>
    </div>
  );
};
