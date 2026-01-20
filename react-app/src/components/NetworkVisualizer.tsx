import React from 'react';
import { NeuralNetwork } from '../NeuralNetwork';

interface NetworkVisualizerProps {
  network: NeuralNetwork | null;
}

export const NetworkVisualizer: React.FC<NetworkVisualizerProps> = ({ network }) => {
  if (!network) {
    return (
      <div className="network-visualizer">
        <h3>Network Architecture</h3>
        <div className="placeholder">No network created</div>
      </div>
    );
  }

  const layerSizes = network.getLayerSizes();

  return (
    <div className="network-visualizer">
      <h3>Network Architecture</h3>
      <div className="network-diagram">
        <div className="layer-info">
          <div className="layer-label">Input</div>
          <div className="layer-size">100</div>
        </div>
        {layerSizes.map((size, idx) => (
          <React.Fragment key={idx}>
            <div className="connection-arrow">→</div>
            <div className="layer-info">
              <div className="layer-label">Layer {idx + 1}</div>
              <div className="layer-size">{size}</div>
              <div className="neurons">
                {Array.from({ length: Math.min(size, 10) }).map((_, i) => (
                  <div key={i} className="neuron-dot" />
                ))}
                {size > 10 && <span className="more-neurons">+{size - 10}</span>}
              </div>
            </div>
          </React.Fragment>
        ))}
        <div className="connection-arrow">→</div>
        <div className="layer-info">
          <div className="layer-label">Output</div>
          <div className="layer-size">1</div>
        </div>
      </div>
      <div className="architecture-summary">
        Architecture: 100 → {layerSizes.join(' → ')} → 1
      </div>
    </div>
  );
};

