# Neural Network Visualization App

An interactive React application for visualizing neural network training and testing in real-time.

## Features

- **Network Architecture Visualization**: See the structure of your neural network (100 → 10 → 3 → 1)
- **Input Pattern Display**: Visualize 10x10 pixel face patterns with labels and predictions
- **Interactive Training**: Train the network with customizable epochs and watch error decrease in real-time
- **Test Results**: View accuracy, error metrics, and performance indicators
- **Sample Navigation**: Browse through training samples to see individual predictions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Load Data**: The app automatically loads training and test data from CSV files
2. **View Network**: See the network architecture displayed visually
3. **Browse Samples**: Use Previous/Next buttons to view different input patterns
4. **Train Network**: 
   - Set the number of epochs
   - Click "Train Network" to start training
   - Watch the error decrease in real-time
5. **Test Network**: 
   - After training, click "Run Test" to evaluate on test data
   - View accuracy and performance metrics

## Project Structure

```
src/
├── components/
│   ├── InputVisualizer.tsx      # Displays 10x10 pixel patterns
│   ├── NetworkVisualizer.tsx     # Shows network architecture
│   ├── TrainingDashboard.tsx    # Training controls and progress
│   └── ResultsDisplay.tsx        # Test results visualization
├── Neuron.ts                     # Single neuron implementation
├── NeuralNetwork.ts              # Multi-layer network
├── network-builder.ts            # Network builder utility
├── data-utils.ts                 # CSV loading utilities
├── types.ts                      # TypeScript interfaces
└── App.tsx                       # Main application component
```

## Data Files

Training data files should be placed in `public/training-data/`:
- `faces_dataset_10x10_varied_TRAIN.csv`
- `faces_dataset_10x10_varied_TEST.csv`

## Presentation Tips

This app is designed for presentations to demonstrate:
- How neural networks process information
- The training process and error reduction
- Network architecture and layer connections
- Real-time prediction visualization
- Performance metrics and accuracy

Use the interactive controls to:
- Start/stop training to explain concepts
- Navigate samples to show different patterns
- Show before/after training predictions
- Demonstrate the relationship between training and test accuracy
