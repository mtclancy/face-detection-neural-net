import { Neuron } from "./Neuron";

export function buildLayer(layerSize: number, inputSize: number, learningRate: number): Neuron[] {
    const layer: Neuron[] = []
    for(let i = 0; i < layerSize; i++) {
        const neuron = new Neuron(inputSize, learningRate);
        layer.push(neuron)
    }
    return layer
}