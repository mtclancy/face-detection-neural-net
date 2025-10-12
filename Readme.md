# Neural Network Playground

A TypeScript implementation of neural networks designed to illustrate how individual neurons and multi-layer neural networks operate. This project includes progressive Jest tests that increase in complexity, making it an excellent learning resource for understanding neural network fundamentals.

## 🧠 What This Project Demonstrates

- **Single Neuron Implementation**: Basic perceptron with sigmoid activation
- **Multi-Layer Neural Network**: Feedforward network with backpropagation
- **Face Recognition Task**: Binary classification on 10x10 pixel face images
- **Progressive Learning**: Tests that build from simple to complex scenarios

## 📁 Project Structure

```
src/
├── Neuron.ts              # Single neuron implementation
├── NeuralNetwork.ts       # Multi-layer neural network
├── types.ts              # TypeScript interfaces
├── data-utils.ts         # CSV parsing and data utilities
└── index.ts              # Main entry point

tests/
├── neural-net.test.ts    # Progressive test suite
└── setup.ts             # Test configuration

training-data/
├── faces_dataset_10x10_varied_TRAIN.csv  # Training data
└── faces_dataset_10x10_varied_TEST.csv   # Test data

visualizations/
├── face_dataset_visualization.html       # Interactive data viewer
└── examples/                            # Sample face patterns
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Build the Project
```bash
npm run build
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Development
```bash
npm run dev
```

## 🧪 Test Structure (Progressive Complexity)

**Important Note**: These tests should not be thought of in a traditional TDD (Test-Driven Development) manner. Instead, they are designed as **learning scenarios** that progressively demonstrate neural network concepts. Each test sets up a different learning scenario to help you understand how neurons and networks behave under various conditions.

The test suite is designed to progressively build understanding:

### Single Neuron Tests
1. **Basic Forward Pass** - Test untrained neuron output
2. **Prediction Testing** - Test neuron on dataset without training
3. **Single Training Step** - Train on one image and verify output/error
4. **Multi-Epoch Training** - Train for 10 epochs and check accuracy
5. **Performance Validation** - Ensure >75% accuracy on test data

### Neural Network Tests
1. **Network Creation** - Test multi-layer network initialization
2. **Training & Testing** - Full training pipeline with performance metrics

## 🎯 The Face Recognition Task

The neural network learns to classify 10x10 pixel face images as either:
- **Label 0**: Non-face patterns
- **Label 1**: Face patterns

### Dataset Details
- **Input**: 100 features (10x10 pixel grid)
- **Training Data**: 100 samples
- **Test Data**: 100 samples
- **Features**: Binary values (0 or 1)

## 🔧 Key Components

### Neuron Class
- **Sigmoid Activation**: `1 / (1 + e^(-z))`
- **Gradient Descent**: Weight updates using sigmoid derivative
- **Learning Rate**: Configurable learning rate (default: 0.1)

### NeuralNetwork Class
- **Architecture**: Configurable layer sizes
- **Backpropagation**: Full backpropagation algorithm
- **Training**: Batch training with error tracking
- **Testing**: Accuracy and error metrics

### Data Utilities
- **CSV Parsing**: Load training/test data from CSV files
- **Data Shuffling**: Randomize data order for better training
- **Type Safety**: Full TypeScript support

## 📊 Performance Expectations

- **Single Neuron**: >75% accuracy on face recognition
- **Multi-Layer Network**: Improved performance with hidden layers
- **Training Time**: Fast convergence due to simple binary classification

## 🎓 Learning Objectives

After exploring this codebase, you'll understand:

1. **How neurons compute outputs** using weighted inputs and activation functions
2. **The training process** including forward pass, error calculation, and backpropagation
3. **Multi-layer networks** and how information flows through layers
4. **Gradient descent** and how weights are updated to minimize error
5. **Real-world application** of neural networks to image classification

## 📚 Additional Resources

- `training_example.md` - Detailed walkthrough of a single training step
- `visualizations/` - Interactive data visualization tools
- `NeuralNetwork.md` - In-depth technical documentation

## 📄 License

MIT License - feel free to use this code for learning and educational purposes.
