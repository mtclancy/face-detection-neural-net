import { useState, useEffect } from 'react';
import { NeuralNetwork } from './NeuralNetwork';
import { buildLayer } from './network-builder';
import { getTrainingData, getTestData } from './data-utils';
import type { TrainingData, TestResults } from './types';
import { NetworkVisualizer } from './components/NetworkVisualizer';
import { InputVisualizer } from './components/InputVisualizer';
import { TrainingDashboard } from './components/TrainingDashboard';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SingleNeuronPage } from './components/SingleNeuronPage';
import './App.css';

type Page = 'network' | 'neuron';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('network');
  const [network, setNetwork] = useState<NeuralNetwork | null>(null);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [testData, setTestData] = useState<TrainingData[]>([]);
  const [currentSample, setCurrentSample] = useState<TrainingData | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sampleIndex, setSampleIndex] = useState(0);

  // Initialize network and load data - only run once on mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const trainData = await getTrainingData();
        const test = await getTestData();
        
        setTrainingData(trainData);
        setTestData(test);
        setCurrentSample(trainData[0] || null);

        // Create network with architecture: 100 -> 10 -> 3 -> 1
        const layerOne = buildLayer(10, 100, 0.1);
        const layerTwo = buildLayer(3, 10, 0.1);
        const layerThree = buildLayer(1, 3, 0.1);
        const neuralNet = new NeuralNetwork([layerOne, layerTwo, layerThree]);
        
        setNetwork(neuralNet);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []); // Empty dependency array - only run once on mount

  // Listen for test requests - separate effect that uses current network and testData
  useEffect(() => {
    const handleTestRequest = async () => {
      if (network && testData.length > 0) {
        const results = network.test(testData);
        setTestResults(results);
      }
    };

    window.addEventListener('testRequested', handleTestRequest);
    return () => window.removeEventListener('testRequested', handleTestRequest);
  }, [network, testData]);

  const handleTrainingComplete = (errors: number[]) => {
    console.log('Training completed with errors:', errors);
    // Force re-render to update predictions
    if (network && currentSample) {
      setCurrentSample({ ...currentSample });
    }
  };

  const handleTestComplete = (results: TestResults) => {
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
    if (network && currentSample) {
      try {
        return network.predict(currentSample.inputs);
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  if (isLoading && currentPage === 'network') {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="page-switcher">
        <button
          className={`page-button ${currentPage === 'network' ? 'active' : ''}`}
          onClick={() => setCurrentPage('network')}
        >
          Multi-Layer Network
        </button>
        <button
          className={`page-button ${currentPage === 'neuron' ? 'active' : ''}`}
          onClick={() => setCurrentPage('neuron')}
        >
          Single Neuron
        </button>
      </div>

      {currentPage === 'neuron' ? (
        <SingleNeuronPage />
      ) : (
        <>
          <header className="app-header">
            <h1>🧠 Neural Network Visualization</h1>
            <p>Interactive demonstration of neural network training and testing</p>
          </header>

          <div className="app-content">
        <div className="left-panel">
          <NetworkVisualizer network={network} />
          
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
        </div>

        <div className="right-panel">
          <TrainingDashboard
            network={network}
            trainingData={trainingData}
            onTrainingComplete={handleTrainingComplete}
            onTestComplete={handleTestComplete}
          />

          <ResultsDisplay results={testResults} />
        </div>
      </div>
        </>
      )}
    </div>
  );
}

export default App;
