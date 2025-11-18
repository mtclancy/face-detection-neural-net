import { getTestData, getTrainingData } from "./data-utils";
import { buildLayer } from "./network-builder";
import { NeuralNetwork } from "./NeuralNetwork";

function main() {
    const trainingData = getTrainingData();

    const layerOne = buildLayer(10, 100, 0.1);
    const layerTwo = buildLayer(3, 10, 0.1);
    const layerThree = buildLayer(1, 3, 0.1);

    const neuralNet = new NeuralNetwork([layerOne, layerTwo, layerThree]);
    neuralNet.trainOnDataset(trainingData, 10);
    
    const testData = getTestData();
    const testResults = neuralNet.test(testData);
    
    console.log(testResults);
    return testResults;
}

main()