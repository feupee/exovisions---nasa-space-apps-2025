import { NextRequest, NextResponse } from "next/server";
import { callGoogleCloudModel } from "@/_lib/googleCloudeService";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Dados recebidos para identificação:", data);

    // Chamar o modelo do Google Cloud
    const prediction = await callGoogleCloudModel(data) as {
      label: number;
      confidence: number;
      domain?: string;
      raw_prediction?: any;
    };

    console.log("Predição recebida do modelo:", prediction);

    const result = {
      success: true,
      prediction: prediction.label, // 0 ou 1
      confidence: prediction.confidence,
      message:
        prediction.label === 1
          ? "✅ Os dados indicam que este é um EXOPLANETA!"
          : "❌ Os dados NÃO correspondem a um exoplaneta.",
      classification:
        prediction.label === 1 ? "Exoplaneta Confirmado" : "Falso Positivo",
      domain: prediction.domain || "koi",
      rawPrediction: prediction.raw_prediction || prediction,
    };

    console.log("Resultado final:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro na API de identificação:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar dados",
        message: "Erro na análise. Tente novamente.",
        prediction: 0,
        confidence: 0,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
