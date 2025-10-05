import { NextRequest, NextResponse } from 'next/server';
import { callGoogleCloudModel } from '@/_lib/googleCloudeService';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Dados recebidos para identificação:', data);
    
    // Chamar o modelo do Google Cloud
    const prediction = await callGoogleCloudModel(data);
    
    const result = {
      success: true,
      data: data,
      prediction: prediction.label,
      confidence: prediction.confidence,
      message: prediction.label === 1 
        ? "✅ Os dados indicam que este é um EXOPLANETA!" 
        : "❌ Os dados NÃO correspondem a um exoplaneta.",
      classification: prediction.label === 1 ? "Exoplaneta Confirmado" : "Falso Positivo",
      rawPrediction: prediction.raw_prediction
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro na API de identificação:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao processar dados', 
        message: "Erro na análise. Tente novamente." 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}