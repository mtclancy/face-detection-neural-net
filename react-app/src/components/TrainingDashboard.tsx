import React, { useState } from 'react';
import { NeuralNetwork } from '../NeuralNetwork';
import type { TrainingData } from '../types';

interface TrainingDashboardProps {
  network: NeuralNetwork | null;
  trainingData: TrainingData[];
  onTrainingComplete: (errors: number[]) => void;
  onTestComplete: (results: any) => void;
}

export const TrainingDashboard: React.FC<TrainingDashboardProps> = ({
  network,
  trainingData,
  onTrainingComplete,
  onTestComplete: _onTestComplete
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [epochs, setEpochs] = useState(10);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [isTesting] = useState(false);

  const handleTrain = async () => {
    if (!network || trainingData.length === 0) return;

    setIsTraining(true);
    setCurrentEpoch(0);
    setErrors([]);

    const trainingErrors: number[] = [];
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochError = 0;
      
      for (const sample of trainingData) {
        const error = network.train(sample.inputs, sample.label);
        epochError += error;
      }
      
      const avgError = epochError / trainingData.length;
      trainingErrors.push(avgError);
      setErrors([...trainingErrors]);
      setCurrentEpoch(epoch + 1);
      
      // Small delay for visualization
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsTraining(false);
    onTrainingComplete(trainingErrors);
  };


  return (
    <div className="training-dashboard">
      <h3>Training Controls</h3>
      <div className="controls">
        <div className="control-group">
          <label>
            Epochs:
            <input
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value) || 10)}
              min="1"
              max="100"
              disabled={isTraining}
            />
          </label>
        </div>
        <div className="button-group">
          <button 
            onClick={handleTrain} 
            disabled={!network || isTraining || trainingData.length === 0}
            className="train-button"
          >
            {isTraining ? `Training... (${currentEpoch}/${epochs})` : 'Train Network'}
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="training-progress">
          <h4>Training Progress</h4>
          <div className="error-chart">
            <div className="chart-container">
              {errors.map((error, idx) => (
                <div
                  key={idx}
                  className="error-bar"
                  style={{
                    height: `${Math.min(error * 400, 100)}%`,
                    backgroundColor: isTraining && idx === errors.length - 1 ? '#2196F3' : '#4CAF50'
                  }}
                  title={`Epoch ${idx + 1}: ${error.toFixed(4)}`}
                />
              ))}
            </div>
            <div className="chart-labels">
              {errors.map((_, idx) => (
                <span key={idx}>{idx + 1}</span>
              ))}
            </div>
          </div>
          <div className="error-stats">
            <div>Current Error: {errors[errors.length - 1]?.toFixed(4) || 'N/A'}</div>
            <div>Initial Error: {errors[0]?.toFixed(4) || 'N/A'}</div>
            {errors.length > 1 && (
              <div>Improvement: {((errors[0]! - errors[errors.length - 1]!) / errors[0]! * 100).toFixed(1)}%</div>
            )}
          </div>
        </div>
      )}

      <div className="test-section">
        <button
          onClick={() => {
            // This will be handled by parent component
            const event = new CustomEvent('testRequested');
            window.dispatchEvent(event);
          }}
          disabled={!network || isTesting || errors.length === 0}
          className="test-button"
        >
          {isTesting ? 'Testing...' : 'Run Test'}
        </button>
      </div>
    </div>
  );
};

