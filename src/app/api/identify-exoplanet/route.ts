// src/app/api/identify-exoplanet/route.ts
import { NextRequest, NextResponse } from "next/server";

async function getGoogleCloudToken() {
  try {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!credentialsJson) {
      throw new Error("Credenciais não encontradas");
    }

    const credentials = JSON.parse(credentialsJson);
    
    // Criar JWT para autenticação
    const jwt = require('jsonwebtoken');
    const now = Math.floor(Date.now() / 1000);
    
    const payload = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    };

    const token = jwt.sign(payload, credentials.private_key, { algorithm: 'RS256' });

    // Trocar JWT por access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

    const tokenData = await response.json();
    return tokenData.access_token;
  } catch (error) {
    console.error("Erro ao obter token:", error);
    throw error;
  }
}

async function callVertexAI(features: any) {
  try {
    const token = await getGoogleCloudToken();
    const projectId = process.env.PROJECT_ID;
    const region = process.env.REGION;
    const endpointId = process.env.ENDPOINT_ID;

    // Determinar tipo de modelo baseado nos campos presentes
    const has_st_teff = "st_teff" in features && features.st_teff !== null;
    const has_st_logg = "st_logg" in features && features.st_logg !== null;

    let model_type, domain;
    if (!has_st_teff && !has_st_logg) {
      model_type = "6_fields";
      domain = "koi";
    } else if (has_st_teff && !has_st_logg) {
      model_type = "7_fields_teff";
      domain = "toi";
    } else if (!has_st_teff && has_st_logg) {
      model_type = "7_fields_logg";
      domain = "k2";
    } else {
      model_type = "8_fields";
      domain = "toi";
    }

    // Criar payload para Vertex AI
    const payload = {
      domains: {
        koi: "gs://nasa-exoplanets/koi",
        toi: "gs://nasa-exoplanets/toi",
        k2: "gs://nasa-exoplanets/k2"
      },
      final_dir: "gs://nasa-exoplanets/final_vote3",
      instances: [{
        domain: domain,
        features: features
      }]
    };

    console.log("Chamando Vertex AI com payload:", payload);

    const url = `https://${region}-prediction-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/endpoints/${endpointId}:rawPredict`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Vertex AI error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // Adicionar metadados
    result.model_type = model_type;
    result.domain_used = domain;
    result.field_count = Object.keys(features).length;

    return result;
  } catch (error) {
    console.error("Erro ao chamar Vertex AI:", error);
    throw error;
  }
}

function processVertexResponse(rawResponse: any): { label: number; confidence: number } {
  let label = 0;
  let confidence = 0.5;

  if (rawResponse.predictions && Array.isArray(rawResponse.predictions) && rawResponse.predictions.length > 0) {
    const pred = rawResponse.predictions[0];

    if (typeof pred === "object" && pred !== null) {
      label = pred.label || pred.prediction || 0;
      confidence = pred.confidence || pred.score || 0.5;
      
      if (pred.scores && Array.isArray(pred.scores)) {
        confidence = Math.max(...pred.scores);
        label = pred.scores.indexOf(confidence);
      }
    } else if (Array.isArray(pred)) {
      confidence = Math.max(...pred);
      label = pred.indexOf(confidence);
    } else {
      label = Number(pred) >= 0.5 ? 1 : 0;
      confidence = Math.abs(Number(pred));
    }
  }

  label = label === 1 ? 1 : 0;
  confidence = Math.max(0, Math.min(1, confidence));

  return { label, confidence };
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("=== DADOS RECEBIDOS ===");
    console.log("Data:", data);

    // Chamar Vertex AI diretamente
    const rawResponse = await callVertexAI(data);
    console.log("=== RESPOSTA VERTEX AI ===");
    console.log("Raw response:", rawResponse);

    // Processar resposta
    const { label, confidence } = processVertexResponse(rawResponse);

    const result = {
      success: true,
      prediction: label,
      confidence: confidence,
      message: label === 1 
        ? "✅ Os dados indicam que este é um EXOPLANETA!" 
        : "❌ Os dados NÃO correspondem a um exoplaneta.",
      classification: label === 1 ? "Exoplaneta Confirmado" : "Não Exoplaneta",
      model_type: rawResponse.model_type || "unknown",
      domain_used: rawResponse.domain_used || "unknown",
      field_count: rawResponse.field_count || 0,
      rawPrediction: rawResponse,
    };

    console.log("=== RESULTADO FINAL ===");
    console.log("Result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("=== ERRO NA API ===");
    console.error("Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar dados",
        message: error instanceof Error ? error.message : "Erro na análise. Tente novamente.",
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