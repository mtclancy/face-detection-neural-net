import { TestResults, TrainingData } from "./types";

export class Neuron {
    weights: number[];
    bias: number;
    learningRate: number;
  
    constructor(numInputs: number, learningRate = 0.1) {
      // Initialize weights randomly between -1 and 1
      this.weights = Array.from({ length: numInputs }, () => Math.random() * 2 - 1);
      this.bias = Math.random() * 2 - 1; // random bias
      this.learningRate = learningRate;
    }
  
    // Sigmoid activation function
    private sigmoid(z: number): number {
      return 1 / (1 + Math.exp(-z));
    }
  
    // Derivative of sigmoid (needed for backprop)
    private sigmoidDerivative(output: number): number {
      return output * (1 - output);
    }
  
    // Forward pass: compute output given inputs
    forward(inputs: number[]): number {
      if (inputs.length !== this.weights.length) {
        throw new Error("Input size must match weight size");
      }
      let output = this.bias;
      for (let i = 0; i < inputs.length; i++) {
        output += inputs[i]! * this.weights[i]!;
      }
      return this.sigmoid(output); // apply activation
    }
  
    // Update weights & bias given error and inputs
    // error = (target - output)
    train(inputs: number[], label: number): {output: number, error: number} {
      // Forward pass
      const output = this.forward(inputs);
  
      // Error term (delta)
      const error = label - output;
      const delta = error * this.sigmoidDerivative(output);
  
      // Update weights
      for (let i = 0; i < this.weights.length; i++) {
        this.weights[i]! += this.learningRate * delta * inputs[i]!;
      }
  
      // Update bias
      this.bias += this.learningRate * delta;
  
      return {output, error}; // return error for monitoring
    }
    predict(inputs: number[]): number {
      return this.forward(inputs);
    }
    
    test(testData: TrainingData[]): TestResults {
      let correctPredictions = 0;
      let totalTestError = 0;
      
      for (let i = 0; i < testData.length; i++) {
        const sample = testData[i]!;
        const prediction = this.forward(sample.inputs);
        const error = Math.abs(sample.label - prediction);
        totalTestError += error;
        
        // Consider prediction correct if it's within 0.5 of the target
        const isCorrect = error < 0.5;
        if (isCorrect) correctPredictions++;
        
        // Show first 5 predictions for debugging
        if (i < 5) {
          console.log(`Test Sample ${i + 1}: Target=${sample.label}, Prediction=${prediction.toFixed(4)}, Error=${error.toFixed(4)}`);
        }
      }
      
      const accuracy = (correctPredictions / testData.length) * 100;
      const avgTestError = totalTestError / testData.length;
      
      return {
        correctPredictions,
        totalTestError,
        accuracy,
        avgTestError
      };
    }
}
