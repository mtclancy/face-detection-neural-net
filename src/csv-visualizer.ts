import * as fs from 'fs';
import * as path from 'path';

interface GridData {
  rowIndex: number;
  grid: number[][];
  label: number;
}

export class CSVGridVisualizer {
  private csvPath: string;
  private outputDir: string;

  constructor(csvPath: string, outputDir: string = './visualizations') {
    this.csvPath = csvPath;
    this.outputDir = outputDir;
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Parse CSV data and extract grid information
   */
  private parseCSV(): GridData[] {
    const csvContent = fs.readFileSync(this.csvPath, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map((line, index) => {
      const values = line.split(',').map(v => parseInt(v.trim()));
      
      // Last value is the label, first 100 values are the grid
      const label = values[values.length - 1];
      if (label === undefined) {
        throw new Error(`Invalid data in row ${index + 1}: missing label`);
      }
      
      const gridValues = values.slice(0, 100);
      
      // Convert 1D array to 2D 10x10 grid
      const grid: number[][] = [];
      for (let i = 0; i < 10; i++) {
        grid[i] = gridValues.slice(i * 10, (i + 1) * 10);
      }
      
      return {
        rowIndex: index + 1,
        grid,
        label
      };
    });
  }

  /**
   * Convert grid to ASCII art representation
   */
  private gridToASCII(grid: number[][]): string {
    let ascii = '';
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        ascii += (grid[row]?.[col] ?? 0) === 1 ? '█' : '·';
      }
      ascii += '\n';
    }
    return ascii;
  }

  /**
   * Generate HTML visualization
   */
  private generateHTML(grids: GridData[]): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Face Dataset Visualization</title>
    <style>
        body {
            font-family: 'Courier New', monospace;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .grid-item {
            background: white;
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .grid-item.face {
            border-color: #4CAF50;
            background-color: #f8fff8;
        }
        .grid-item.non-face {
            border-color: #f44336;
            background-color: #fff8f8;
        }
        .grid-title {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .grid-display {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1;
            letter-spacing: 1px;
            margin: 10px 0;
        }
        .stats {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stats h2 {
            margin-top: 0;
            color: #333;
        }
        .stat-item {
            display: inline-block;
            margin-right: 20px;
            font-size: 16px;
        }
        .face-count {
            color: #4CAF50;
            font-weight: bold;
        }
        .non-face-count {
            color: #f44336;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Face Dataset Visualization</h1>
        
        <div class="stats">
            <h2>Dataset Statistics</h2>
            <div class="stat-item">Total Images: <strong>${grids.length}</strong></div>
            <div class="stat-item">Faces: <span class="face-count">${grids.filter(g => g.label === 1).length}</span></div>
            <div class="stat-item">Non-Faces: <span class="non-face-count">${grids.filter(g => g.label === 0).length}</span></div>
        </div>
        
        <div class="grid-container">
            ${grids.map(grid => `
                <div class="grid-item ${grid.label === 1 ? 'face' : 'non-face'}">
                    <div class="grid-title">
                        Row ${grid.rowIndex} - ${grid.label === 1 ? 'Face' : 'Non-Face'}
                    </div>
                    <div class="grid-display">
                        ${this.gridToHTML(grid.grid)}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    return html;
  }

  /**
   * Convert grid to HTML representation
   */
  private gridToHTML(grid: number[][]): string {
    let html = '';
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const pixel = grid[row]?.[col] ?? 0;
        const color = pixel === 1 ? '#000' : '#fff';
        html += `<span style="color: ${color};">█</span>`;
      }
      html += '<br>';
    }
    return html;
  }

  /**
   * Generate text file with ASCII representations
   */
  private generateTextFile(grids: GridData[]): string {
    let text = 'Face Dataset Visualization\n';
    text += '========================\n\n';
    
    const faceCount = grids.filter(g => g.label === 1).length;
    const nonFaceCount = grids.filter(g => g.label === 0).length;
    
    text += `Total Images: ${grids.length}\n`;
    text += `Faces: ${faceCount}\n`;
    text += `Non-Faces: ${nonFaceCount}\n\n`;
    
    text += 'Legend: █ = Black (1), · = White (0)\n\n';
    text += '='.repeat(50) + '\n\n';
    
    grids.forEach((grid) => {
      text += `Row ${grid.rowIndex} - ${grid.label === 1 ? 'FACE' : 'NON-FACE'}\n`;
      text += '-'.repeat(20) + '\n';
      text += this.gridToASCII(grid.grid);
      text += '\n';
    });
    
    return text;
  }

  /**
   * Main method to generate all visualizations
   */
  public generateVisualizations(): void {
    console.log('Parsing CSV data...');
    const grids = this.parseCSV();
    
    console.log(`Found ${grids.length} images`);
    console.log(`Faces: ${grids.filter(g => g.label === 1).length}`);
    console.log(`Non-Faces: ${grids.filter(g => g.label === 0).length}`);
    
    // Generate HTML visualization
    console.log('Generating HTML visualization...');
    const html = this.generateHTML(grids);
    const htmlPath = path.join(this.outputDir, 'face_dataset_visualization.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`HTML visualization saved to: ${htmlPath}`);
    
    // Generate text file
    console.log('Generating text visualization...');
    const text = this.generateTextFile(grids);
    const textPath = path.join(this.outputDir, 'face_dataset_visualization.txt');
    fs.writeFileSync(textPath, text);
    console.log(`Text visualization saved to: ${textPath}`);
    
    // Generate individual grid files for first few examples
    console.log('Generating individual grid examples...');
    const examplesDir = path.join(this.outputDir, 'examples');
    if (!fs.existsSync(examplesDir)) {
      fs.mkdirSync(examplesDir, { recursive: true });
    }
    
    // Save first 10 examples as individual files
    grids.slice(0, 10).forEach(grid => {
      const filename = `grid_${grid.rowIndex}_${grid.label === 1 ? 'face' : 'nonface'}.txt`;
      const filepath = path.join(examplesDir, filename);
      const content = `Row ${grid.rowIndex} - ${grid.label === 1 ? 'FACE' : 'NON-FACE'}\n\n${this.gridToASCII(grid.grid)}`;
      fs.writeFileSync(filepath, content);
    });
    
    console.log(`Individual examples saved to: ${examplesDir}`);
    console.log('Visualization complete!');
  }

  /**
   * Display a specific grid by row index
   */
  public displayGrid(rowIndex: number): void {
    const grids = this.parseCSV();
    const grid = grids.find(g => g.rowIndex === rowIndex);
    
    if (!grid) {
      console.log(`Grid with row index ${rowIndex} not found.`);
      return;
    }
    
    console.log(`\nRow ${grid.rowIndex} - ${grid.label === 1 ? 'FACE' : 'NON-FACE'}`);
    console.log('-'.repeat(20));
    console.log(this.gridToASCII(grid.grid));
  }

  /**
   * Display statistics about the dataset
   */
  public displayStats(): void {
    const grids = this.parseCSV();
    const faceCount = grids.filter(g => g.label === 1).length;
    const nonFaceCount = grids.filter(g => g.label === 0).length;
    
    console.log('\nDataset Statistics:');
    console.log('==================');
    console.log(`Total Images: ${grids.length}`);
    console.log(`Faces: ${faceCount} (${(faceCount/grids.length*100).toFixed(1)}%)`);
    console.log(`Non-Faces: ${nonFaceCount} (${(nonFaceCount/grids.length*100).toFixed(1)}%)`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  let csvPath = './training-data/faces_dataset_10x10_varied_TEST.csv';
  let command = 'generate';
  let rowIndex = 1;
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'generate' || arg === 'stats' || arg === 'display') {
      command = arg;
      if (command === 'display' && i + 1 < args.length) {
        const nextArg = args[i + 1];
        if (nextArg) {
          rowIndex = parseInt(nextArg) || 1;
        }
      }
      break;
    } else if (arg && !arg.startsWith('-') && i === 0) {
      csvPath = arg;
    }
  }
  
  const visualizer = new CSVGridVisualizer(csvPath);
  
  switch (command) {
    case 'generate':
      visualizer.generateVisualizations();
      break;
    case 'stats':
      visualizer.displayStats();
      break;
    case 'display':
      visualizer.displayGrid(rowIndex);
      break;
    default:
      console.log('Usage:');
      console.log('  node csv-visualizer.js [csv-path] generate  - Generate all visualizations');
      console.log('  node csv-visualizer.js [csv-path] stats     - Display dataset statistics');
      console.log('  node csv-visualizer.js [csv-path] display [row] - Display specific grid');
  }
}
