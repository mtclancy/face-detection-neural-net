export interface TrainingData {
    inputs: number[];
    label: number;
  }
  
export interface TestResults {
    correctPredictions: number;
    totalTestError: number;
    accuracy: number;
    avgTestError: number;
}