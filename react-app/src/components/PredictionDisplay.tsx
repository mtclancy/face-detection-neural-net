import React from 'react';

interface PredictionDisplayProps {
  prediction: number | undefined;
  title?: string;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ 
  prediction, 
  title = "Prediction" 
}) => {
  if (prediction === undefined) {
    return (
      <div className="prediction-display">
        <h3>{title}</h3>
        <div className="placeholder">No prediction available</div>
      </div>
    );
  }

  return (
    <div className="prediction-display">
      <h3>{title}</h3>
      <div className="prediction-content">
        <div className="prediction-value">
          Prediction: <strong>{prediction.toFixed(4)}</strong>
        </div>
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
    </div>
  );
};
