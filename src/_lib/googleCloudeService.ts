// src/lib/googleCloudService.ts
import { spawn } from "child_process";
import path from "path";

// Definir interfaces para os tipos
interface BaseFeatures {
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol: number;
  pl_eqt: number;
}

interface ExtendedFeatures extends BaseFeatures {
  st_teff?: number;
  st_logg?: number;
}

interface ModelConfig {
  name: string;
  features: BaseFeatures | ExtendedFeatures;
  fieldCount: number;
}

export async function callGoogleCloudModel(data: any) {
  try {
    console.log("=== CHAMANDO 4 MODELOS ===");
    console.log("Dados enviados:", JSON.stringify(data, null, 2));

    // Determinar quantos campos temos
    const fieldCount = Object.keys(data).length;
    console.log(`Número de campos: ${fieldCount}`);

    // Preparar dados para os 4 modelos
    const baseFeatures: BaseFeatures = {
      pl_orbper: data.pl_orbper || 0,
      pl_trandurh: data.pl_trandurh || 0,
      pl_trandep: data.pl_trandep || 0,
      pl_rade: data.pl_rade || 0,
      pl_insol: data.pl_insol || 0,
      pl_eqt: data.pl_eqt || 0,
    };

    // Preparar features para cada cenário
    const features6: BaseFeatures = { ...baseFeatures };

    const features7: ExtendedFeatures = {
      ...baseFeatures,
      ...(data.st_teff !== undefined && { st_teff: data.st_teff }),
    };

    const features8: ExtendedFeatures = {
      ...baseFeatures,
      ...(data.st_teff !== undefined && { st_teff: data.st_teff }),
      ...(data.st_logg !== undefined && { st_logg: data.st_logg }),
    };

    const modelsToRun: ModelConfig[] = [];

    // Modelo 1: Sempre com 6 campos
    modelsToRun.push({
      name: "model_6_fields",
      features: features6,
      fieldCount: 6,
    });

    // Modelo 2: Com 7 campos se st_teff disponível
    if (data.st_teff !== undefined) {
      modelsToRun.push({
        name: "model_7_fields",
        features: features7,
        fieldCount: 7,
      });
    }

    // Modelo 3: Com 8 campos se ambos disponíveis
    if (data.st_teff !== undefined && data.st_logg !== undefined) {
      modelsToRun.push({
        name: "model_8_fields",
        features: features8,
        fieldCount: 8,
      });
    }

    // Modelo 4: Sempre executar (pode ser uma variação ou ensemble)
    let ensembleFeatures: BaseFeatures | ExtendedFeatures;
    if (fieldCount === 8) {
      ensembleFeatures = features8;
    } else if (fieldCount === 7) {
      ensembleFeatures = features7;
    } else {
      ensembleFeatures = features6;
    }

    modelsToRun.push({
      name: "model_ensemble",
      features: ensembleFeatures,
      fieldCount: fieldCount,
    });

    console.log(
      `Executando ${modelsToRun.length} modelos:`,
      modelsToRun.map((m) => `${m.name} (${m.fieldCount} campos)`)
    );

    const { spawn } = require("child_process");
    const path = require("path");

    const scriptPath = path.join(process.cwd(), "backend_modelo", "predict.py");

    return new Promise((resolve, reject) => {
      const python = spawn("python", [
        scriptPath,
        JSON.stringify({
          models: modelsToRun,
          originalData: data,
        }),
      ]);

      let output = "";
      let errorOutput = "";

      python.stdout.on("data", (data: Buffer) => {
        output += data.toString();
      });

      python.stderr.on("data", (data: Buffer) => {
        errorOutput += data.toString();
        // Logs Python vão para console do Node
        console.log("Python log:", data.toString().trim());
      });

      python.on("close", (code: number) => {
        console.log("Python script finished with code:", code);
        console.log("Python stdout (JSON):", output.trim());
        console.log("Python stderr (logs):", errorOutput.trim());

        if (code !== 0) {
          reject(
            new Error(`Python script failed with code ${code}: ${errorOutput}`)
          );
          return;
        }

        try {
          // Limpar output para garantir que é só JSON
          const cleanOutput = output.trim();

          if (!cleanOutput) {
            reject(new Error("Python script returned empty output"));
            return;
          }

          // Verificar se começa com { (JSON válido)
          if (!cleanOutput.startsWith("{")) {
            console.error("Output não é JSON válido:", cleanOutput);
            reject(
              new Error(
                `Output is not valid JSON: ${cleanOutput.substring(0, 100)}...`
              )
            );
            return;
          }

          const result = JSON.parse(cleanOutput);
          console.log("Resultado dos 4 modelos:", result);
          resolve(result);
        } catch (parseError) {
          console.error("Erro ao fazer parse do JSON:", parseError);
          console.error("Raw output:", output);
          reject(new Error(`Failed to parse JSON: ${parseError}`));
        }
      });

      python.on("error", (error: Error) => {
        console.error("Python process error:", error);
        reject(error);
      });
    });
  } catch (error) {
    console.error("Erro ao chamar modelos:", error);
    throw error;
  }
}

export interface PredictionResult {
  label: number;
  confidence: number;
  best_model?: string;
  field_count_used?: number;
  ensemble_prediction?: {
    label: number;
    confidence: number;
    vote_ratio: number;
  };
  all_results?: Array<{
    label: number;
    confidence: number;
    model: string;
    field_count: number;
    error?: string;
  }>;
  [key: string]: any;
}
