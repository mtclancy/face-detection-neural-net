import { useState, useEffect } from 'react';
import { Neuron } from '../Neuron';
import { getTrainingData, getTestData } from '../data-utils';
import type { TrainingData, TestResults } from '../types';
import { InputVisualizer } from './InputVisualizer';
import { NeuronDetailView } from './NeuronDetailView';
import { TrainingStepView, type TrainingStepDetails } from './TrainingStepView';
import { ResultsDisplay } from './ResultsDisplay';

export const SingleNeuronPage: React.FC = () => {
  const [neuron, setNeuron] = useState<Neuron | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [testData, setTestData] = useState<TrainingData[]>([]);
  const [currentSample, setCurrentSample] = useState<TrainingData | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingStepDetails[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epochs, setEpochs] = useState(10);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [weightsBefore, setWeightsBefore] = useState<number[] | null>(null);
  const [biasBefore, setBiasBefore] = useState<number | null>(null);

  // Initialize neuron and load data
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const trainData = await getTrainingData();
        const test = await getTestData();
        
        setTrainingData(trainData);
        setTestData(test);
        setCurrentSample(trainData[0] || null);

        // Create single neuron with 100 inputs
        const newNeuron = new Neuron(100, 0.1);
        setNeuron(newNeuron);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const handleTrainingStep = (details: TrainingStepDetails, weightsBefore: number[], biasBefore: number) => {
    setTrainingHistory(prev => [...prev, details]);
    setWeightsBefore(weightsBefore);
    setBiasBefore(biasBefore);
  };

  const handleTrain = async () => {
    if (!neuron || trainingData.length === 0) return;

    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingHistory([]);

    for (let epoch = 0; epoch < epochs; epoch++) {
      for (const sample of trainingData) {
        // For batch training, we don't need to show "before" state in detail view
        // Just save empty arrays to indicate we're not showing training step details
        const details = neuron.trainDetailed(sample.inputs, sample.label);
        handleTrainingStep({
          ...details,
          label: sample.label
        }, [], 0);
      }
      setCurrentEpoch(epoch + 1);
      // Small delay for visualization
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Clear the "before" state after batch training so detail view shows current state
    setWeightsBefore(null);
    setBiasBefore(null);

    setIsTraining(false);
    // Update current sample prediction
    if (currentSample) {
      setCurrentSample({ ...currentSample });
    }
  };

  const handleTest = () => {
    if (!neuron || testData.length === 0) return;
    const results = neuron.test(testData);
    setTestResults(results);
  };

  const handleNextSample = () => {
    if (trainingData.length > 0) {
      const nextIndex = (sampleIndex + 1) % trainingData.length;
      setSampleIndex(nextIndex);
      setCurrentSample(trainingData[nextIndex]!);
    }
  };

  const handlePreviousSample = () => {
    if (trainingData.length > 0) {
      const prevIndex = (sampleIndex - 1 + trainingData.length) % trainingData.length;
      setSampleIndex(prevIndex);
      setCurrentSample(trainingData[prevIndex]!);
    }
  };

  const getCurrentPrediction = (): number | undefined => {
    if (neuron && currentSample) {
      try {
        return neuron.predict(currentSample.inputs);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="single-neuron-page">
      <header className="app-header">
        <h1>🧠 Single Neuron Visualization</h1>
        <p>Detailed view of how a single neuron processes information and learns</p>
      </header>

      <div className="single-neuron-content">
        <div className="left-panel">
          <InputVisualizer 
            data={currentSample}
            prediction={getCurrentPrediction()}
            title="Current Sample"
          />

          <div className="sample-navigation">
            <button onClick={handlePreviousSample} disabled={trainingData.length === 0}>
              ← Previous
            </button>
            <span>Sample {sampleIndex + 1} of {trainingData.length}</span>
            <button onClick={handleNextSample} disabled={trainingData.length === 0}>
              Next →
            </button>
          </div>

          <NeuronDetailView 
            neuron={neuron}
            currentSample={currentSample}
            weightsBefore={weightsBefore}
            biasBefore={biasBefore}
          />
        </div>

        <div className="right-panel">
          <div className="training-controls-panel">
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
              <button 
                onClick={handleTrain} 
                disabled={!neuron || isTraining || trainingData.length === 0}
                className="train-button"
              >
                {isTraining ? `Training... (${currentEpoch}/${epochs})` : 'Train Neuron'}
              </button>
              <button
                onClick={handleTest}
                disabled={!neuron || isTraining}
                className="test-button"
              >
                Run Test
              </button>
            </div>
          </div>

          <TrainingStepView
            neuron={neuron}
            currentSample={currentSample}
            onTrainStep={handleTrainingStep}
            weightsBefore={weightsBefore}
            biasBefore={biasBefore}
          />

          {trainingHistory.length > 0 && (
            <div className="training-history">
              <h3>Training History</h3>
              <div className="history-stats">
                <div className="history-item">
                  <span className="history-label">Training Steps:</span>
                  <span className="history-value">{trainingHistory.length}</span>
                </div>
                <div className="history-item">
                  <span className="history-label">Latest Error:</span>
                  <span className="history-value">
                    {Math.abs(trainingHistory[trainingHistory.length - 1]?.error || 0).toFixed(4)}
                  </span>
                </div>
                <div className="history-item">
                  <span className="history-label">Latest Output:</span>
                  <span className="history-value">
                    {trainingHistory[trainingHistory.length - 1]?.output.toFixed(4) || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <ResultsDisplay results={testResults} />
        </div>
      </div>
    </div>
  );
};

