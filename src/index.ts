import { getTestData, getTrainingData } from "./data-utils";
import { NeuralNetwork } from "./NeuralNetwork";

function main() {
    const trainingData = getTrainingData();
    const neuralNet = new NeuralNetwork([10, 3, 1], 100, 0.1);
    neuralNet.trainOnDataset(trainingData, 10);
    const testData = getTestData();
    const testResults = neuralNet.test(testData);
    console.log(testResults);
    return testResults;
}

main()