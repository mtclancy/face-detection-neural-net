import { Neuron } from './Neuron';

interface TrainingData {
  inputs: number[];
  label: number;
}

interface TestResults {
  correctPredictions: number;
  totalTestError: number;
  accuracy: number;
  avgTestError: number;
}

export class NeuralNetwork {
  private layers: Neuron[][];
  
  constructor(_layers: Neuron[][]) {
    this.layers = _layers
  }

  // Forward pass through the entire network.  Output [[layer1_output], [layer2_output], ...]
  private forward(inputFeatures: number[]): number[][] {
    const allLayerOutputs: number[][] = [];
    let currentLayerInputs = inputFeatures;

    for (const currentLayer of this.layers) {
      const currentLayerOutputs: number[] = [];
      for (const currentNeuron of currentLayer) {
        const neuronOutput = currentNeuron.forward(currentLayerInputs);
        currentLayerOutputs.push(neuronOutput);
      }
      allLayerOutputs.push(currentLayerOutputs);
      currentLayerInputs = currentLayerOutputs;
    }

    return allLayerOutputs;
  }

  // Backpropagation training
  train(inputFeatures: number[], targetOutput: number): number {
    // Forward pass - get outputs from all layers
    const allLayerOutputs = this.forward(inputFeatures);
    const networkPrediction = allLayerOutputs[allLayerOutputs.length - 1]![0]!; // Assuming single output neuron
    
    // Calculate prediction error (target - prediction)
    const predictionError = targetOutput - networkPrediction;
    
    // Backpropagate errors through layers
    const neuronErrors: number[][] = [];
    
    // Initialize error array for each layer
    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      const neuronsInThisLayer = this.layers[layerIndex]!.length;
      neuronErrors.push(new Array(neuronsInThisLayer).fill(0));
    }
    
    // Set error for output layer (this is our starting point for backpropagation)
    neuronErrors[neuronErrors.length - 1]![0] = predictionError;
    
    // Backpropagate through hidden layers (working backwards from output to input)
    for (let currentLayerIndex = this.layers.length - 2; currentLayerIndex >= 0; currentLayerIndex--) {
      const currentHiddenLayer = this.layers[currentLayerIndex]!;
      const nextLayerTowardsOutput = this.layers[currentLayerIndex + 1]!;
      
      // Calculate error for each neuron in the current hidden layer
      for (let currentNeuronIndex = 0; currentNeuronIndex < currentHiddenLayer.length; currentNeuronIndex++) {
        let accumulatedError = 0;
        
        // Backpropagate error from the next layer to this neuron
        // Each neuron's error is the sum of errors from neurons it connects to,
        // weighted by the strength of those connections
        for (let nextLayerNeuronIndex = 0; nextLayerNeuronIndex < nextLayerTowardsOutput.length; nextLayerNeuronIndex++) {
          const nextLayerNeuron = nextLayerTowardsOutput[nextLayerNeuronIndex]!;
          // Get the weight connecting current neuron to the next layer neuron
          const connectionWeight = nextLayerNeuron.weights[currentNeuronIndex]!;
          // Add the next layer's error multiplied by the connection weight
          // This distributes the error proportionally based on connection strength
          accumulatedError += neuronErrors[currentLayerIndex + 1]![nextLayerNeuronIndex]! * connectionWeight;
        }
        
        // Store the calculated error for this neuron
        neuronErrors[currentLayerIndex]![currentNeuronIndex] = accumulatedError;
      }
    }
    
    // Update weights for all layers (working forwards from input to output)
    let currentLayerInputs = inputFeatures;
    
    for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
      const currentLayer = this.layers[layerIndex]!;
      const currentLayerOutputs = allLayerOutputs[layerIndex]!;
      
      for (let neuronIndex = 0; neuronIndex < currentLayer.length; neuronIndex++) {
        const currentNeuron = currentLayer[neuronIndex]!;
        const neuronOutput = currentLayerOutputs[neuronIndex]!;
        const neuronError = neuronErrors[layerIndex]![neuronIndex]!;
        
        // Calculate weight adjustment (delta) using sigmoid derivative
        // Delta = error * sigmoid_derivative(output) = error * output * (1 - output)
        const weightAdjustment = neuronError * neuronOutput * (1 - neuronOutput);
        
        // Update each weight connecting to this neuron
        for (let inputIndex = 0; inputIndex < currentNeuron.weights.length; inputIndex++) {
          const inputValue = currentLayerInputs[inputIndex]!;
          const weightUpdate = currentNeuron.learningRate * weightAdjustment * inputValue;
          currentNeuron.weights[inputIndex]! += weightUpdate;
        }
        
        // Update bias (bias is like a weight with input always = 1)
        const biasUpdate = currentNeuron.learningRate * weightAdjustment;
        currentNeuron.bias += biasUpdate;
      }
      
      // For next layer, the inputs are the outputs of this layer
      currentLayerInputs = currentLayerOutputs;
    }
    
    return Math.abs(predictionError);
  }

  // Predict output for given inputs
  predict(inputs: number[]): number {
    const outputs = this.forward(inputs);
    return outputs[outputs.length - 1]![0]!; // Return final output
  }

  // Train the network on a dataset
  trainOnDataset(trainingData: TrainingData[], epochs: number): number[] {
    const errors: number[] = [];
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let epochError = 0;
      
      for (const sample of trainingData) {
        const error = this.train(sample.inputs, sample.label);
        epochError += error;
      }
      
      const avgError = epochError / trainingData.length;
      errors.push(avgError);
      console.log(`Epoch ${epoch + 1}: Average Error = ${avgError.toFixed(4)}`);
    }
    
    return errors;
  }

  // Test the network on test data
  test(testData: TrainingData[]): TestResults {
    let correctPredictions = 0;
    let totalTestError = 0;
    
    for (let i = 0; i < testData.length; i++) {
      const sample = testData[i]!;
      const prediction = this.predict(sample.inputs);
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
