# Neural Network Training Example

This document walks through a detailed example of how the `train` method works in our three-layered neural network using binary input data.

## Network Architecture

We'll use a simple 3-layer network:
- **Input Layer**: 3 neurons (receives input features)
- **Hidden Layer**: 2 neurons 
- **Output Layer**: 1 neuron (single output)

## Example Training Data

**Input**: `[1, 0, 1]` (binary features)
**Target Output**: `1` (what we want the network to predict)

## Initial Setup

Let's assume our network is initialized with random weights and biases:

### Layer 1 (Input → Hidden) - 2 neurons, 3 inputs each
**Neuron 1**: weights = `[0.5, -0.3, 0.8]`, bias = `0.2`
**Neuron 2**: weights = `[-0.4, 0.7, -0.1]`, bias = `-0.3`

### Layer 2 (Hidden → Output) - 1 neuron, 2 inputs
**Neuron 3**: weights = `[0.6, -0.2]`, bias = `0.1`

**Learning Rate**: `0.1`

## Step-by-Step Training Process

### 1. Forward Pass

#### Input Layer → Hidden Layer
**Input**: `[1, 0, 1]`

**Neuron 1 calculation**:
- Raw output = `(1 × 0.5) + (0 × -0.3) + (1 × 0.8) + 0.2 = 0.5 + 0 + 0.8 + 0.2 = 1.5`
- Sigmoid(1.5) = `1 / (1 + e^(-1.5)) = 1 / (1 + 0.223) = 0.818`

**Neuron 2 calculation**:
- Raw output = `(1 × -0.4) + (0 × 0.7) + (1 × -0.1) + (-0.3) = -0.4 + 0 - 0.1 - 0.3 = -0.8`
- Sigmoid(-0.8) = `1 / (1 + e^(0.8)) = 1 / (1 + 2.226) = 0.310`

**Hidden Layer Output**: `[0.818, 0.310]`

#### Hidden Layer → Output Layer
**Input**: `[0.818, 0.310]`

**Neuron 3 calculation**:
- Raw output = `(0.818 × 0.6) + (0.310 × -0.2) + 0.1 = 0.491 + (-0.062) + 0.1 = 0.529`
- Sigmoid(0.529) = `1 / (1 + e^(-0.529)) = 1 / (1 + 0.589) = 0.629`

**Final Network Output**: `0.629`

### 2. Error Calculation

**Target**: `1`
**Prediction**: `0.629`
**Prediction Error**: `1 - 0.629 = 0.371`

### 3. Backpropagation

#### Initialize Error Arrays
```
neuronErrors = [
  [0, 0],     // Hidden layer (2 neurons)
  [0.371]     // Output layer (1 neuron)
]
```

#### Backpropagate from Output to Hidden Layer

**For Hidden Neuron 1**:
- Error = `0.371 × 0.6 = 0.223` (error from output neuron × connection weight)

**For Hidden Neuron 2**:
- Error = `0.371 × (-0.2) = -0.074` (error from output neuron × connection weight)

**Updated neuronErrors**:
```
neuronErrors = [
  [0.223, -0.074],  // Hidden layer
  [0.371]           // Output layer
]
```

### 4. Weight Updates

#### Update Output Layer (Neuron 3)
**Current weights**: `[0.6, -0.2]`, bias = `0.1`
**Error**: `0.371`
**Output**: `0.629`

**Weight adjustment calculation**:
- Delta = `0.371 × 0.629 × (1 - 0.629) = 0.371 × 0.629 × 0.371 = 0.087`

**Weight updates**:
- Weight 1: `0.6 + (0.1 × 0.087 × 0.818) = 0.6 + 0.007 = 0.607`
- Weight 2: `-0.2 + (0.1 × 0.087 × 0.310) = -0.2 + 0.003 = -0.197`
- Bias: `0.1 + (0.1 × 0.087) = 0.1 + 0.009 = 0.109`

#### Update Hidden Layer (Neurons 1 & 2)

**Neuron 1**:
- **Current weights**: `[0.5, -0.3, 0.8]`, bias = `0.2`
- **Error**: `0.223`
- **Output**: `0.818`

**Weight adjustment calculation**:
- Delta = `0.223 × 0.818 × (1 - 0.818) = 0.223 × 0.818 × 0.182 = 0.033`

**Weight updates**:
- Weight 1: `0.5 + (0.1 × 0.033 × 1) = 0.5 + 0.003 = 0.503`
- Weight 2: `-0.3 + (0.1 × 0.033 × 0) = -0.3 + 0 = -0.3`
- Weight 3: `0.8 + (0.1 × 0.033 × 1) = 0.8 + 0.003 = 0.803`
- Bias: `0.2 + (0.1 × 0.033) = 0.2 + 0.003 = 0.203`

**Neuron 2**:
- **Current weights**: `[-0.4, 0.7, -0.1]`, bias = `-0.3`
- **Error**: `-0.074`
- **Output**: `0.310`

**Weight adjustment calculation**:
- Delta = `-0.074 × 0.310 × (1 - 0.310) = -0.074 × 0.310 × 0.690 = -0.016`

**Weight updates**:
- Weight 1: `-0.4 + (0.1 × (-0.016) × 1) = -0.4 - 0.002 = -0.402`
- Weight 2: `0.7 + (0.1 × (-0.016) × 0) = 0.7 + 0 = 0.7`
- Weight 3: `-0.1 + (0.1 × (-0.016) × 1) = -0.1 - 0.002 = -0.102`
- Bias: `-0.3 + (0.1 × (-0.016)) = -0.3 - 0.002 = -0.302`

## Summary of Changes

### Before Training:
- **Output**: `0.629`
- **Error**: `0.371`

### After Training:
- **New weights** (rounded to 3 decimal places):
  - Neuron 1: `[0.503, -0.300, 0.803]`, bias = `0.203`
  - Neuron 2: `[-0.402, 0.700, -0.102]`, bias = `-0.302`
  - Neuron 3: `[0.607, -0.197]`, bias = `0.109`

## What Happened?

1. **Forward Pass**: The network processed the input `[1, 0, 1]` and produced output `0.629`
2. **Error Calculation**: The difference between target `1` and prediction `0.629` was `0.371`
3. **Backpropagation**: The error was distributed backwards through the network, with each neuron's error calculated based on how much it contributed to the final error
4. **Weight Updates**: All weights and biases were adjusted slightly in the direction that would reduce the error for this specific training example

## Key Insights

- **Small Changes**: Notice how the weight changes are very small (typically 0.001-0.01). This is because we use a small learning rate (0.1) to ensure stable learning.
- **Error Distribution**: The error flows backwards, with each neuron receiving a portion of the error proportional to its connection strength.
- **Sigmoid Derivative**: The weight adjustment uses the sigmoid derivative `output × (1 - output)` to account for the non-linear activation function.
- **Gradient Descent**: The weights are updated in the direction that reduces the error, implementing gradient descent optimization.

This single training step would be repeated many times with different training examples to gradually improve the network's performance on the overall task.
