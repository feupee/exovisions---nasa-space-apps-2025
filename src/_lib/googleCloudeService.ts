// src/lib/googleCloudService.ts
import { spawn } from 'child_process';
import path from 'path';

export interface ExoplanetData {
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol?: number;
  pl_eqt?: number;
  st_teff?: number;
  st_logg?: number;
}

export interface PredictionResult {
  label: number;
  confidence: number;
  raw_prediction?: any;
  error?: string;
}

export async function callGoogleCloudModel(inputData: ExoplanetData): Promise<PredictionResult> {
  console.log("=== CHAMANDO MODELO (baseado no teste.py) ===");
  console.log("Input data:", inputData);
  
  return new Promise((resolve) => {
    const scriptPath = path.join(process.cwd(), 'backend_modelo', 'predict.py');
    const inputJson = JSON.stringify(inputData);
    
    console.log("Script path:", scriptPath);
    console.log("Input JSON:", inputJson);
    
    const python = spawn('python', [scriptPath, inputJson]);
    
    let result = '';
    let error = '';
    
    python.stdout.on('data', (data: Buffer) => {
      result += data.toString();
    });
    
    python.stderr.on('data', (data: Buffer) => {
      const errorOutput = data.toString();
      console.log("Python stderr:", errorOutput); // Para ver os logs do modelo
      error += errorOutput;
    });
    
    python.on('close', (code: number) => {
      console.log("=== RESULTADO DO PYTHON ===");
      console.log("Exit code:", code);
      console.log("Result:", result);
      
      if (code === 0) {
        try {
          const prediction = JSON.parse(result.trim());
          console.log("Prediction parseada:", prediction);
          resolve(prediction);
        } catch (parseError) {
          console.error('Erro ao fazer parse:', parseError);
          resolve({
            label: 0,
            confidence: 0.0,
            error: 'Erro ao processar resposta'
          });
        }
      } else {
        console.error('Python falhou:', error);
        resolve({
          label: 0,
          confidence: 0.0,
          error: `Erro no modelo: ${error}`
        });
      }
    });
    
    python.on('error', (err) => {
      console.error('Erro ao executar Python:', err);
      resolve({
        label: 0,
        confidence: 0.0,
        error: 'Erro ao executar Python'
      });
    });
  });
}