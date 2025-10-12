import { TrainingData } from "./types";
import * as fs from 'fs';
import * as path from 'path';

export function parseCSV(csvContent: string): TrainingData[] {
    const lines = csvContent.trim().split('\n');
    const data: TrainingData[] = [];
    
    // Skip header row (first line)
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i]!.split(',');
        if (values.length < 2) continue; // Skip empty lines
        
        // Last value is the label, rest are inputs
        const label = parseFloat(values[values.length - 1]!);
        const inputs = values.slice(0, -1).map(val => parseFloat(val));
        
        data.push({ inputs, label });
    }
    
    return data;
}

export function shuffleArray(array: TrainingData[]): TrainingData[] {
    return array.sort(() => Math.random() - 0.5);
}

export function getTestData() {
    const csvPath = path.join(__dirname, '..', 'training-data', 'faces_dataset_10x10_varied_TEST.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const testData: TrainingData[] = parseCSV(csvContent);
    shuffleArray(testData);
    return testData;
}

export function getTrainingData() {
    const csvPath = path.join(__dirname, '..', 'training-data', 'faces_dataset_10x10_varied_TRAIN.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const trainingData: TrainingData[] = parseCSV(csvContent);
    shuffleArray(trainingData);
    return trainingData;
}