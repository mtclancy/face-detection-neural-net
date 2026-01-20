import React from 'react';
import type { TestResults } from '../types';

interface ResultsDisplayProps {
  results: TestResults | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="results-display">
        <h3>Test Results</h3>
        <div className="placeholder">No test results yet</div>
      </div>
    );
  }

  const accuracyColor = results.accuracy >= 95 ? '#4CAF50' : 
                        results.accuracy >= 75 ? '#FF9800' : '#f44336';

  return (
    <div className="results-display">
      <h3>Test Results</h3>
      <div className="results-content">
        <div className="accuracy-display">
          <div className="accuracy-label">Accuracy</div>
          <div 
            className="accuracy-value"
            style={{ color: accuracyColor }}
          >
            {results.accuracy.toFixed(2)}%
          </div>
          <div className="accuracy-bar">
            <div 
              className="accuracy-fill"
              style={{ 
                width: `${results.accuracy}%`,
                backgroundColor: accuracyColor
              }}
            />
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric">
            <div className="metric-label">Correct Predictions</div>
            <div className="metric-value">{results.correctPredictions}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Average Error</div>
            <div className="metric-value">{results.avgTestError.toFixed(4)}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Total Error</div>
            <div className="metric-value">{results.totalTestError.toFixed(4)}</div>
          </div>
        </div>

        <div className="performance-indicator">
          {results.accuracy >= 95 && (
            <div className="performance-badge excellent">Excellent Performance!</div>
          )}
          {results.accuracy >= 75 && results.accuracy < 95 && (
            <div className="performance-badge good">Good Performance</div>
          )}
          {results.accuracy < 75 && (
            <div className="performance-badge needs-improvement">Needs More Training</div>
          )}
        </div>
      </div>
    </div>
  );
};

