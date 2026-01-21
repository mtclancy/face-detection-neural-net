import React from 'react';
import { Neuron } from '../Neuron';
import type { TrainingData } from '../types';

interface CurrentStateProps {
  currentSample: TrainingData | null;
  neuron: Neuron | null;
}

export const CurrentState: React.FC<CurrentStateProps> = ({ 
  currentSample, 
  neuron 
}) => {
  // Prepare input grid
  let inputGrid: number[][] = [];
  if (currentSample) {
    for (let i = 0; i < 10; i++) {
      inputGrid.push(currentSample.inputs.slice(i * 10, (i + 1) * 10));
    }
  }

  // Prepare weight grid
  let weightGrid: number[][] = [];
  if (neuron) {
    for (let i = 0; i < 10; i++) {
      weightGrid.push(neuron.weights.slice(i * 10, (i + 1) * 10));
    }
  }

  const getWeightColor = (weight: number): string => {
    const intensity = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      return `rgba(76, 175, 80, ${intensity})`; // Green for positive
    } else {
      return `rgba(244, 67, 54, ${intensity})`; // Red for negative
    }
  };

  const label = currentSample?.label === 1 ? 'Face' : 'Non-Face';
  const labelColor = currentSample?.label === 1 ? '#4CAF50' : '#f44336';

  return (
    <div className="current-state">
      <h3>Current State</h3>
      <div className="current-state-grid">
        <div className="current-state-item">
          {!currentSample ? (
            <div className="placeholder">No sample data</div>
          ) : (
            <div className="grid-container">
              <div className="grid-label" style={{ color: labelColor }}>
                Label: {label} ({currentSample.label})
              </div>
              <div className="pixel-grid">
                {inputGrid.map((row, rowIdx) => (
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
            </div>
          )}
        </div>

        <div className="current-state-item">
          <h4>Initial Weights State</h4>
          {!neuron ? (
            <div className="placeholder">No neuron data</div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
