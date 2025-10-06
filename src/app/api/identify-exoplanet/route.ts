import { NextRequest } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

type DebugInfo = {
  cwd: string;
  pythonTried: string[];
  scriptCandidates: string[];
  scriptPicked?: string;
  envHints: Record<string, string | undefined>;
};

function getPythonCandidates(): string[] {
  const fromEnv = process.env.PYTHON_BIN ? [process.env.PYTHON_BIN] : [];
  return [...fromEnv, "python3", "python"];
}

function resolvePredictScript(debug: DebugInfo): string {
  const fromEnv = process.env.PREDICT_SCRIPT;
  const cwd = process.cwd();

  const candidates = [
    fromEnv,
    path.join(cwd, "predict.py"),
    path.join(cwd, "backend_modelo", "predict.py"),
    path.join(cwd, "server", "predict.py"),
    path.join(cwd, "api", "predict.py"),
  ].filter(Boolean) as string[];

  debug.scriptCandidates = candidates;
  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        debug.scriptPicked = c;
        return c;
      }
    } catch {}
  }
  debug.scriptPicked = candidates[0];
  return candidates[0];
}

// Função para processar a resposta do Vertex AI - SIMPLIFICADA
function processVertexResponse(rawResponse: any): number {
  // Se houve erro, retornar 0 (não é exoplaneta)
  if (rawResponse.error) {
    return 0;
  }

  // Processar resposta para extrair apenas o label
  if (
    rawResponse.predictions &&
    Array.isArray(rawResponse.predictions) &&
    rawResponse.predictions.length > 0
  ) {
    const pred = rawResponse.predictions[0];

    if (typeof pred === "object" && pred !== null) {
      // Formato: { label: 1 } ou { prediction: 1 }
      return pred.label || pred.prediction || 0;
    } else if (Array.isArray(pred)) {
      // Formato: [0.15, 0.85] - retorna índice do maior valor
      const maxValue = Math.max(...pred);
      return pred.indexOf(maxValue);
    } else {
      // Formato: valor direto - converte para 0 ou 1
      return Number(pred) >= 0.5 ? 1 : 0;
    }
  }

  // Default: não é exoplaneta
  return 0;
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const debug: DebugInfo = {
    cwd: process.cwd(),
    pythonTried: [],
    scriptCandidates: [],
    envHints: {
      NODE_ENV: process.env.NODE_ENV,
      PREDICT_SCRIPT: process.env.PREDICT_SCRIPT,
      PYTHON_BIN: process.env.PYTHON_BIN,
      GOOGLE_APPLICATION_CREDENTIALS:
        process.env.GOOGLE_APPLICATION_CREDENTIALS,
    },
  };

  try {
    const body = await req.json().catch(() => ({} as any));
    const features = body && body.features ? body.features : body;

    if (!features || typeof features !== "object") {
      return Response.json({ prediction: 0 }, { status: 400 });
    }

    console.log("Dados recebidos no route.ts:", features);

    const scriptPath = resolvePredictScript(debug);
    const pythonBins = getPythonCandidates();

    for (const bin of pythonBins) {
      debug.pythonTried.push(bin);

      try {
        const { stdout, stderr, exitCode } = await run(bin, [
          scriptPath,
          JSON.stringify(features),
        ]);

        console.log(`Python ${bin} exit code:`, exitCode);
        console.log("Python stdout:", stdout);

        if (exitCode === 0) {
          let rawResponse: any;
          try {
            rawResponse = JSON.parse(stdout || "{}");
            console.log("Resposta parseada do predict.py:", rawResponse);
          } catch (parseError) {
            console.error("Erro ao parsear JSON:", parseError);
            return Response.json({ prediction: 0 }, { status: 500 });
          }

          // Se houve erro no predict.py, retornar 0
          if (rawResponse.error) {
            console.error("Erro no predict.py:", rawResponse.error);
            return Response.json({ prediction: 0 }, { status: 500 });
          }

          // Processar resposta do Vertex AI - APENAS O LABEL
          const prediction = processVertexResponse(rawResponse);

          console.log("Resultado final - Label:", prediction);

          // RESPOSTA SIMPLIFICADA - APENAS O LABEL
          return Response.json(
            {
              prediction: prediction, // 0 = não é exoplaneta, 1 = é exoplaneta
            },
            { status: 200 }
          );
        }
      } catch (e: any) {
        console.error(`Erro com Python ${bin}:`, e);
        continue;
      }
    }

    // Se chegou aqui, falhou para todos os interpreters Python
    return Response.json({ prediction: 0 }, { status: 500 });
  } catch (e: any) {
    console.error("Erro geral no route.ts:", e);
    return Response.json({ prediction: 0 }, { status: 500 });
  }
}

function run(
  cmd: string,
  args: string[]
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { env: process.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => reject(err));
    child.on("close", (code) =>
      resolve({ stdout, stderr, exitCode: code ?? -1 })
    );
  });
}
