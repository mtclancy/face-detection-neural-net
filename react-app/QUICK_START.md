# Quick Start Guide

## Running the React Visualization App

1. **Navigate to the react-app directory:**
   ```bash
   cd react-app
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   The app will be available at `http://localhost:5173`

## What You'll See

- **Network Architecture**: Visual representation of the 100 → 10 → 3 → 1 network
- **Input Visualizer**: 10x10 pixel grid showing face patterns
- **Training Dashboard**: Controls to train the network and view progress
- **Results Display**: Test accuracy and performance metrics

## Using the App

1. **Load Data**: The app automatically loads training and test CSV files from `public/training-data/`

2. **Browse Samples**: 
   - Use Previous/Next buttons to navigate through training samples
   - See the pixel pattern and current prediction

3. **Train the Network**:
   - Set number of epochs (default: 10)
   - Click "Train Network"
   - Watch the error decrease in real-time on the chart

4. **Test the Network**:
   - After training, click "Run Test"
   - View accuracy percentage and other metrics
   - See performance indicators (Excellent/Good/Needs Improvement)

## For Presentations

- Start training and pause to explain concepts
- Show before/after predictions by navigating samples
- Demonstrate error reduction over epochs
- Compare training vs. test accuracy
- Use the visual network diagram to explain architecture

## Troubleshooting

- **Data not loading**: Ensure CSV files are in `public/training-data/`
- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **Type errors**: Make sure you're using a compatible TypeScript version

