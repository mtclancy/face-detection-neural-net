import type { TrainingData } from "./types";

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
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
    }
    return shuffled;
}

export async function getTestData(): Promise<TrainingData[]> {
    const response = await fetch('/training-data/faces_dataset_10x10_varied_TEST.csv');
    const csvContent = await response.text();
    const testData: TrainingData[] = parseCSV(csvContent);
    return shuffleArray(testData);
}

export async function getTrainingData(): Promise<TrainingData[]> {
    const response = await fetch('/training-data/faces_dataset_10x10_varied_TRAIN.csv');
    const csvContent = await response.text();
    const trainingData: TrainingData[] = parseCSV(csvContent);
    return shuffleArray(trainingData);
}

