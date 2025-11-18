import React, { useState } from 'react';
import { Neuron } from '../Neuron';
import type { TrainingData } from '../types';

interface TrainingStepViewProps {
  neuron: Neuron | null;
  currentSample: TrainingData | null;
  onTrainStep: (details: TrainingStepDetails, weightsBefore: number[], biasBefore: number) => void;
  weightsBefore?: number[] | null;
  biasBefore?: number | null;
}

export interface TrainingStepDetails {
  output: number;
  error: number;
  delta: number;
  weightUpdates: number[];
  biasUpdate: number;
  weightedSum: number;
  weightedInputs: number[];
  sigmoidDerivative: number;
  label: number;
}

export const TrainingStepView: React.FC<TrainingStepViewProps> = ({
  neuron,
  currentSample,
  onTrainStep,
  weightsBefore: weightsBeforeProp,
  biasBefore: biasBeforeProp
}) => {
  const [lastTrainingStep, setLastTrainingStep] = useState<TrainingStepDetails | null>(null);
  const [weightsBefore, setWeightsBefore] = useState<number[]>([]);
  const [biasBefore, setBiasBefore] = useState(0);

  if (!neuron || !currentSample) {
    return (
      <div className="training-step-view">
        <div className="placeholder">No neuron or sample data</div>
      </div>
    );
  }

  const handleTrainStep = () => {
    // Save current weights and bias before training
    const savedWeights = [...neuron.weights];
    const savedBias = neuron.bias;
    setWeightsBefore(savedWeights);
    setBiasBefore(savedBias);

    // Perform training step and get detailed information
    const details = neuron.trainDetailed(currentSample.inputs, currentSample.label);
    const fullDetails: TrainingStepDetails = {
      ...details,
      label: currentSample.label
    };

    setLastTrainingStep(fullDetails);
    onTrainStep(fullDetails, savedWeights, savedBias);
  };

  // Use props if available, otherwise use local state
  // Fallback to neuron's current values if both are empty (shouldn't happen when lastTrainingStep exists)
  const displayWeightsBefore = (weightsBeforeProp && weightsBeforeProp.length > 0) 
    ? weightsBeforeProp 
    : (weightsBefore.length > 0 ? weightsBefore : (neuron?.weights || []));
  const displayBiasBefore = (biasBeforeProp !== null && biasBeforeProp !== undefined)
    ? biasBeforeProp
    : (weightsBefore.length > 0 ? biasBefore : (neuron?.bias ?? 0));

  const getWeightColor = (weight: number): string => {
    const intensity = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      return `rgba(76, 175, 80, ${intensity})`;
    } else {
      return `rgba(244, 67, 54, ${intensity})`;
    }
  };

  const getUpdateColor = (update: number): string => {
    if (update > 0) {
      return '#4CAF50';
    } else if (update < 0) {
      return '#f44336';
    }
    return '#999';
  };

  return (
    <div className="training-step-view">
      <h3>Training Step Details</h3>
      
      <div className="training-controls">
        <button onClick={handleTrainStep} className="train-step-button">
          Train on Current Sample
        </button>
      </div>

      {lastTrainingStep && (
        <div className="training-details">
          <div className="forward-pass-section">
            <h4>Forward Pass Calculation</h4>
            <div className="formula">
              <div className="formula-line">
                Σ(Input × Weight) = {lastTrainingStep.weightedInputs.reduce((sum, val) => sum + val, 0).toFixed(4)}
              </div>
              <div className="formula-line">
                + Bias (before update) = {displayBiasBefore.toFixed(4)}
              </div>
              <div className="formula-line">
                = {lastTrainingStep.weightedInputs.reduce((sum, val) => sum + val, 0).toFixed(4)} + {displayBiasBefore.toFixed(4)} = {(lastTrainingStep.weightedInputs.reduce((sum, val) => sum + val, 0) + displayBiasBefore).toFixed(4)}
              </div>
              <div className="formula-line formula-result">
                Weighted Sum = <strong>{lastTrainingStep.weightedSum.toFixed(4)}</strong>
              </div>
              <div className="formula-line">
                sigmoid({lastTrainingStep.weightedSum.toFixed(4)}) = 1 / (1 + e^(-{lastTrainingStep.weightedSum.toFixed(4)}))
              </div>
              <div className="formula-line formula-result">
                Output = <strong>{lastTrainingStep.output.toFixed(4)}</strong>
              </div>
            </div>
          </div>

          <div className="error-section">
            <h4>Error Calculation</h4>
            <div className="formula">
              <div className="formula-line">
                Target Label: <strong>{lastTrainingStep.label}</strong>
              </div>
              <div className="formula-line">
                Predicted Output: <strong>{lastTrainingStep.output.toFixed(4)}</strong>
              </div>
              <div className="formula-line formula-error">
                Error = Target - Output = {lastTrainingStep.label} - {lastTrainingStep.output.toFixed(4)} = <strong>{lastTrainingStep.error.toFixed(4)}</strong>
              </div>
            </div>
          </div>

          <div className="delta-section">
            <h4>Delta (Weight Update Coefficient)</h4>
            <div className="formula">
              <div className="formula-line">
                Sigmoid Derivative: sigmoid'({lastTrainingStep.output.toFixed(4)}) = {lastTrainingStep.sigmoidDerivative.toFixed(4)}
              </div>
              <div className="formula-line formula-result">
                Delta = Error × Sigmoid' = {lastTrainingStep.error.toFixed(4)} × {lastTrainingStep.sigmoidDerivative.toFixed(4)} = <strong>{lastTrainingStep.delta.toFixed(4)}</strong>
              </div>
            </div>
          </div>

          <div className="weight-updates-section">
            <h4>Weight Updates</h4>
            <div className="update-info">
              <div className="update-formula">
                <div className="formula-line">
                  Weight Update = Learning Rate × Delta × Input
                </div>
                <div className="formula-line">
                  = {neuron.learningRate} × {lastTrainingStep.delta.toFixed(4)} × Input
                </div>
              </div>
            </div>

            <div className="weights-comparison">
              <div className="weights-grid">
                <h5>Weights Before</h5>
                <div className="weight-grid-container">
                  {Array.from({ length: 10 }, (_, rowIdx) => (
                    <div key={rowIdx} className="weight-row">
                      {displayWeightsBefore.slice(rowIdx * 10, (rowIdx + 1) * 10).map((weight, colIdx) => (
                        <div
                          key={colIdx}
                          className="weight-cell"
                          style={{ backgroundColor: getWeightColor(weight) }}
                          title={`Before: ${weight.toFixed(3)}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="update-grid">
                <h5>Updates</h5>
                <div className="weight-grid-container">
                  {Array.from({ length: 10 }, (_, rowIdx) => (
                    <div key={rowIdx} className="weight-row">
                      {lastTrainingStep.weightUpdates.slice(rowIdx * 10, (rowIdx + 1) * 10).map((update, colIdx) => (
                        <div
                          key={colIdx}
                          className="weight-cell update-cell"
                          style={{ 
                            backgroundColor: getUpdateColor(update),
                            opacity: Math.min(Math.abs(update) * 10, 1)
                          }}
                          title={`Update: ${update.toFixed(4)}`}
                        >
                          {Math.abs(update) > 0.01 ? (update > 0 ? '+' : '') + update.toFixed(2) : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="weights-grid">
                <h5>Weights After</h5>
                <div className="weight-grid-container">
                  {Array.from({ length: 10 }, (_, rowIdx) => (
                    <div key={rowIdx} className="weight-row">
                      {neuron.weights.slice(rowIdx * 10, (rowIdx + 1) * 10).map((weight, colIdx) => (
                        <div
                          key={colIdx}
                          className="weight-cell"
                          style={{ backgroundColor: getWeightColor(weight) }}
                          title={`After: ${weight.toFixed(3)}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bias-update">
              <h5>Bias Update</h5>
              <div className="bias-comparison">
                <div className="bias-item">
                  <span className="bias-label">Before:</span>
                  <span className="bias-value">{displayBiasBefore.toFixed(4)}</span>
                </div>
                <div className="bias-item">
                  <span className="bias-label">Update:</span>
                  <span className="bias-value" style={{ color: getUpdateColor(lastTrainingStep.biasUpdate) }}>
                    {lastTrainingStep.biasUpdate > 0 ? '+' : ''}{lastTrainingStep.biasUpdate.toFixed(4)}
                  </span>
                </div>
                <div className="bias-item">
                  <span className="bias-label">After:</span>
                  <span className="bias-value">{neuron.bias.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

