import React from 'react';
import { Neuron } from '../Neuron';
import type { TrainingData } from '../types';

interface NeuronDetailViewProps {
  neuron: Neuron | null;
  currentSample: TrainingData | null;
  weightsBefore?: number[] | null;
  biasBefore?: number | null;
}

export const NeuronDetailView: React.FC<NeuronDetailViewProps> = ({ 
  neuron, 
  currentSample,
  weightsBefore,
  biasBefore
}) => {
  if (!neuron || !currentSample) {
    return (
      <div className="neuron-detail-view">
        <div className="placeholder">No neuron or sample data</div>
      </div>
    );
  }

  // Use "before" values if provided (from training step), otherwise use current values
  // Only use "before" values if they're actually provided (not empty arrays from batch training)
  const useBeforeValues = weightsBefore !== null && 
                          weightsBefore !== undefined && 
                          weightsBefore.length > 0 &&
                          biasBefore !== null && 
                          biasBefore !== undefined;
  const weights = useBeforeValues ? weightsBefore : neuron.weights;
  const bias = useBeforeValues ? biasBefore : neuron.bias;
  const learningRate = neuron.learningRate;

  // Calculate forward pass manually if using "before" values, otherwise use neuron method
  let details: { weightedSum: number; output: number; weightedInputs: number[] };
  if (useBeforeValues) {
    // Manually calculate forward pass with "before" weights and bias
    const weightedInputs: number[] = [];
    let weightedSum = 0;
    for (let i = 0; i < currentSample.inputs.length; i++) {
      const weighted = currentSample.inputs[i]! * weights[i]!;
      weightedInputs.push(weighted);
      weightedSum += weighted;
    }
    weightedSum += bias;
    const output = 1 / (1 + Math.exp(-weightedSum));
    details = { weightedSum, output, weightedInputs };
  } else {
    details = neuron.forwardDetailed(currentSample.inputs);
  }

  // Convert 100-element arrays to 10x10 grids
  const inputGrid: number[][] = [];
  const weightGrid: number[][] = [];
  const weightedInputGrid: number[][] = [];
  
  for (let i = 0; i < 10; i++) {
    inputGrid.push(currentSample.inputs.slice(i * 10, (i + 1) * 10));
    weightGrid.push(weights.slice(i * 10, (i + 1) * 10));
    weightedInputGrid.push(details.weightedInputs.slice(i * 10, (i + 1) * 10));
  }

  const getWeightColor = (weight: number): string => {
    const intensity = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      return `rgba(76, 175, 80, ${intensity})`; // Green for positive
    } else {
      return `rgba(244, 67, 54, ${intensity})`; // Red for negative
    }
  };

  const getWeightedColor = (value: number): string => {
    const intensity = Math.min(Math.abs(value) / 2, 1);
    if (value > 0) {
      return `rgba(76, 175, 80, ${intensity})`;
    } else {
      return `rgba(244, 67, 54, ${intensity})`;
    }
  };

  return (
    <div className="neuron-detail-view">
      <h3>Prediction Mechanics</h3>
      
      <div className="neuron-stats">
        <div className="stat-item">
          <div className="stat-label">Bias</div>
          <div className="stat-value">{bias.toFixed(4)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Learning Rate</div>
          <div className="stat-value">{learningRate}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Weighted Sum</div>
          <div className="stat-value">{details.weightedSum.toFixed(4)}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Sigmoid Output</div>
          <div className="stat-value">{details.output.toFixed(4)}</div>
        </div>
      </div>

      <div className="calculation-flow">
        <div className="flow-step">
          <h4>Step 1: Input Values</h4>
          <div className="grid-container">
            <div className="pixel-grid">
              {inputGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="pixel-row">
                  {row.map((pixel, colIdx) => (
                    <div
                      key={colIdx}
                      className="pixel"
                      style={{
                        backgroundColor: pixel === 1 ? '#000' : '#fff',
                        border: '1px solid #ccc',
                        color: pixel === 1 ? '#fff' : '#000',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {pixel}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-arrow">×</div>

        <div className="flow-step">
          <h4>Step 2: Weights</h4>
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

        <div className="flow-arrow">=</div>

        <div className="flow-step">
          <h4>Step 3: Weighted Inputs (Input × Weight)</h4>
          <div className="grid-container">
            <div className="pixel-grid">
              {weightedInputGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="pixel-row">
                  {row.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className="pixel weighted-pixel"
                      style={{
                        backgroundColor: getWeightedColor(value),
                        border: '1px solid #ccc',
                        color: Math.abs(value) > 0.5 ? '#fff' : '#000',
                        fontSize: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={`Weighted: ${value.toFixed(3)}`}
                    >
                      {value.toFixed(2)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flow-arrow">+</div>

        <div className="flow-step">
          <h4>Step 4: Sum + Bias</h4>
          <div className="calculation-display">
            <div className="formula">
              <div className="formula-line">
                Σ(Input × Weight) = {details.weightedInputs.reduce((sum, val) => sum + val, 0).toFixed(4)}
              </div>
              <div className="formula-line">
                + Bias = {bias.toFixed(4)}
              </div>
              <div className="formula-line">
                = {details.weightedInputs.reduce((sum, val) => sum + val, 0).toFixed(4)} + {bias.toFixed(4)} = {(details.weightedInputs.reduce((sum, val) => sum + val, 0) + bias).toFixed(4)}
              </div>
              <div className="formula-line formula-result">
                Weighted Sum = <strong>{details.weightedSum.toFixed(4)}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-step">
          <h4>Step 5: Sigmoid Activation</h4>
          <div className="activation-display">
            <div className="formula">
              <div className="formula-line">
                sigmoid({details.weightedSum.toFixed(4)}) = 1 / (1 + e^(-{details.weightedSum.toFixed(4)}))
              </div>
              <div className="formula-line formula-result">
                = <strong>{details.output.toFixed(4)}</strong>
              </div>
            </div>
            <div className="output-bar">
              <div 
                className="output-fill"
                style={{ 
                  width: `${details.output * 100}%`,
                  backgroundColor: details.output > 0.5 ? '#4CAF50' : '#f44336'
                }}
              />
              <span className="output-label">{details.output.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

