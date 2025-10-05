// src/hooks/useExoplanetAPI.ts
import { useState } from "react";

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

export interface IdentificationResult {
  success: boolean;
  prediction: number;
  confidence: number;
  message: string;
  classification: string;
  data: ExoplanetData;
}

export interface TextureResult {
  texture: string;
}

export const useExoplanetAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [identificationResult, setIdentificationResult] =
    useState<IdentificationResult | null>(null);
  const [planetTexture] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const identifyExoplanet = async (data: ExoplanetData) => {
    try {
      setError(null);

      console.log("=== HOOK: ENVIANDO PARA API ===");
      console.log("Data recebida no hook:", data);
      console.log("Data stringificada:", JSON.stringify(data));

      const response = await fetch("/api/identify-exoplanet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("=== HOOK: RESPOSTA RECEBIDA ===");
      console.log("Status:", response.status);
      console.log("Headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta:", errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("=== HOOK: RESULTADO PARSEADO ===", result);

      setIdentificationResult(result);
      return result;
    } catch (err) {
      console.error("=== HOOK: ERRO ===", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    }
  };

  const processExoplanet = async (data: ExoplanetData) => {
    setIsLoading(true);
    try {
      // Executar ambas as chamadas em paralelo
      const [identification] = await Promise.allSettled([
        identifyExoplanet(data),
      ]);

      return {
        identification:
          identification.status === "fulfilled" ? identification.value : null,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    identificationResult,
    planetTexture,
    error,
    identifyExoplanet,
    processExoplanet,
  };
};
