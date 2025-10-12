# NeuralNetwork Class: Detailed Explanation

## Overview

The `NeuralNetwork` class implements a multi-layer perceptron (MLP) neural network with backpropagation for training. This document provides a comprehensive walkthrough of how the `trainOnDataset` method orchestrates the entire training process.

## Architecture

The network consists of:
- **Input layer**: 100 neurons (for 10x10 face images)
- **Hidden layer**: 3 neurons  
- **Output layer**: 1 neuron (binary classification)

## Step-by-Step Flow of `trainOnDataset`

### 1. Method Entry Point

```typescript
trainOnDataset(trainingData: TrainingData[], epochs: number): number[]
```

**Input**: 
- `trainingData`: Array of `{inputs: number[], label: number}` objects
- `epochs`: Number of complete passes through the dataset

**Process**:
- Initializes an `errors` array to track average error per epoch
- Loops through each epoch (complete dataset pass)

### 2. Epoch Loop

For each epoch:
- Resets `epochError` to 0
- Iterates through every training sample
- Calls `this.train()` for each sample
- Accumulates errors and calculates average
- Logs progress to console

### 3. Individual Sample Training - The `train()` Method

This is where the core neural network training happens:

#### 3a. Forward Pass

```typescript
const outputs = this.forward(inputs);
const finalOutput = outputs[outputs.length - 1]![0]!;
```

- Calls `forward()` method to propagate inputs through all layers
- Extracts the final output from the last layer (single neuron)

#### 3b. Forward Propagation Details

The `forward()` method:
1. **Input Layer**: Takes raw input values (100 features for face images)
2. **Hidden Layer**: Each of 3 neurons:
   - Calculates weighted sum: `z = bias + Σ(input[i] × weight[i])`
   - Applies sigmoid activation: `output = 1/(1 + e^(-z))`
3. **Output Layer**: Single neuron does the same calculation
4. **Returns**: Array of layer outputs for backpropagation

#### 3c. Error Calculation

```typescript
const finalError = target - finalOutput;
```
Simple difference between expected and actual output.

#### 3d. Backpropagation Setup

- Creates `errors` array to store error for each neuron in each layer
- Initializes with zeros
- Sets output layer error to `finalError`

#### 3e. Error Backpropagation

**Critical Algorithm**: Propagates errors backward through layers:

```typescript
for (let layerIndex = this.layers.length - 2; layerIndex >= 0; layerIndex--) {
  // For each neuron in current layer
  for (let neuronIndex = 0; neuronIndex < currentLayer.length; neuronIndex++) {
    let error = 0;
    
    // Sum errors from next layer weighted by connection weights
    for (let nextNeuronIndex = 0; nextNeuronIndex < nextLayer.length; nextNeuronIndex++) {
      const weight = nextNeuron.weights[neuronIndex]!;
      error += errors[layerIndex + 1]![nextNeuronIndex]! * weight;
    }
    
    errors[layerIndex]![neuronIndex] = error;
  }
}
```

**What this does**:
- Starts from the layer before output (hidden layer)
- For each neuron, calculates its error by:
  - Taking errors from the next layer
  - Weighting them by the connection weights
  - Summing them up
- This distributes the final error back through the network

#### 3f. Weight Updates

**Gradient Descent Implementation**:

```typescript
for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
  for (let neuronIndex = 0; neuronIndex < layer.length; neuronIndex++) {
    const neuron = layer[neuronIndex]!;
    const output = layerOutputs[neuronIndex]!;
    const error = errors[layerIndex]![neuronIndex]!;
    
    // Calculate delta using sigmoid derivative
    const delta = error * output * (1 - output);
    
    // Update weights
    for (let weightIndex = 0; weightIndex < neuron.weights.length; weightIndex++) {
      neuron.weights[weightIndex]! += this.learningRate * delta * currentInputs[weightIndex]!;
    }
    
    // Update bias
    neuron.bias += this.learningRate * delta;
  }
}
```

**Key Components**:
- **Delta Calculation**: `error × output × (1 - output)` (sigmoid derivative)
- **Weight Update**: `weight += learningRate × delta × input`
- **Bias Update**: `bias += learningRate × delta`

### 4. Error Tracking and Return

- Returns absolute final error for the sample
- Accumulates all sample errors in the epoch
- Calculates average error per epoch
- Logs progress: `"Epoch X: Average Error = Y"`

## Mathematical Foundation

### Sigmoid Activation Function
```
σ(z) = 1/(1 + e^(-z))
σ'(z) = σ(z) × (1 - σ(z))
```

### Gradient Descent Update Rule
```
Δw = learningRate × δ × input
δ = error × σ'(output)
```

### Backpropagation Chain Rule
The error propagates backward using the chain rule of calculus, where each neuron's error is the weighted sum of errors from neurons it connects to in the next layer.

## Example Flow with Face Recognition

Given a 10×10 face image (100 pixels) and target label (0 or 1):

1. **Input**: 100 pixel values → Input layer
2. **Hidden**: 3 neurons process → 3 hidden outputs  
3. **Output**: 1 neuron → Final prediction (0-1)
4. **Error**: `target - prediction`
5. **Backprop**: Error flows back, updating all weights
6. **Repeat**: For all training samples, for all epochs

## Key Design Decisions

- **Single Output Neuron**: Binary classification (face/no-face)
- **Sigmoid Activation**: Smooth, differentiable, outputs 0-1 range
- **Learning Rate**: Controls step size in gradient descent (0.1 default)
- **Error Threshold**: Predictions within 0.5 of target considered "correct"

## Data Flow Summary

```
Training Data → Forward Pass → Error Calculation → Backpropagation → Weight Updates → Repeat
     ↓              ↓              ↓                    ↓                ↓
[100 inputs]   [Layer outputs]  [target - output]  [Error flow]   [Gradient descent]
```

## Performance Considerations

- **Epochs**: More epochs generally improve accuracy but risk overfitting
- **Learning Rate**: Higher values learn faster but may overshoot optimal weights
- **Network Size**: 3 hidden neurons provide good balance of capacity vs. overfitting
- **Batch Processing**: Currently processes one sample at a time (online learning)

This implementation provides a solid foundation for binary classification tasks, with the face recognition dataset serving as a practical example of how the network learns to distinguish between different patterns in the input data.
