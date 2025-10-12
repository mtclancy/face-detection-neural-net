import { NeuralNetwork } from '../src/NeuralNetwork';
import { Neuron } from '../src/Neuron';
import { TrainingData } from '../src/types';
import { getTrainingData, getTestData } from '../src/data-utils';

describe('Single Neuron', () => {
    it('should forward input through untrained neuron', () => {
        const trainingData: TrainingData[] = getTrainingData();
        
        const neuron = new Neuron(100, 0.1);
        const result = neuron.forward(trainingData[0]!.inputs);

        expect(result).toBeDefined();
    })

    it('should predict test data on untrained neuron', () => {
        const trainingData = getTrainingData()

        const neuron = new Neuron(100, 0.1);
        const result = neuron.test(trainingData);

        expect(result).toBeDefined();
    })

    it('should train single neuron through 1 image', () => {
        const trainingData = getTrainingData();

        const neuron = new Neuron(100, 0.1);
        const result = neuron.train(trainingData[0]!.inputs, trainingData[0]!.label);
        
        expect(result).toBeDefined();
        expect(result.output).toBeDefined();
        expect(result.error).toBeDefined();
        expect(result.output).toBeGreaterThan(0);
        expect(result.output).toBeLessThan(1);
        expect(Math.abs(result.error)).toBeGreaterThan(0);
        expect(result.error).toBeLessThan(1);
    });

    it('should test single neuron through 10 epochs', () => {
        const trainingData = getTrainingData()
        const neuron = new Neuron(100, 0.1);
        const epochs = 10;
        
        for (let i = 0; i < epochs; i++) {
            for (const sample of trainingData) {    
                neuron.train(sample.inputs, sample.label);
            }
        }
        
        const testResult = neuron.test(trainingData);
        
        expect(testResult.correctPredictions).toBeDefined();
        expect(testResult.accuracy).toBeDefined();
        expect(testResult.accuracy).toBeGreaterThan(0);
        expect(testResult.accuracy).toBeLessThan(100);
        expect(testResult.avgTestError).toBeDefined();
        expect(testResult.avgTestError).toBeGreaterThan(0);
        expect(testResult.avgTestError).toBeLessThan(1);
    });

    it('should run test data through neuron with results greater than 75%', () => {
        const trainingData = getTrainingData();
        const testData = getTestData();
        const neuron = new Neuron(100, 0.1);
        const epochs = 10;
        
        for (let i = 0; i < epochs; i++) {
            for (const sample of trainingData) {    
                neuron.train(sample.inputs, sample.label);
            }
        }
        
        const testResult = neuron.test(testData);
        
        expect(testResult.accuracy).toBeGreaterThan(75)
    })
});

describe('NeuralNet', () => {
  it('should be defined', () => {
    const trainingData = getTrainingData();
    const neuralNet = new NeuralNetwork([10, 3, 1], 100, 0.1);
    const result = neuralNet.trainOnDataset(trainingData, 10);
    expect(result).toBeDefined();
    expect(result.length).toBe(10);
    expect(neuralNet).toBeDefined();

    const testData = getTestData();
    const testResults = neuralNet.test(testData);
    expect(testResults).toBeDefined();
    expect(testResults.accuracy).toBeGreaterThan(0);
  });
});
