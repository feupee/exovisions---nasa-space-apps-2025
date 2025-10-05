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
  const [planetTexture, setPlanetTexture] = useState<string | null>(null);
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

  const generateTexture = async (data: ExoplanetData) => {
    try {
      setError(null);
      const textureData = {
        mainTerrain: determineTerrainType(data),
        averageTemp: calculateAverageTemp(data),
        pl_rade: data.pl_rade,
        pl_insol: data.pl_insol || 1.0,
        pl_eqt: data.pl_eqt || 288,
        hasAtmosphere: data.pl_rade > 0.5,
        hasWater: data.pl_eqt ? data.pl_eqt > 273 && data.pl_eqt < 373 : false,
      };

      const response = await fetch("http://localhost:5000/generate_texture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(textureData),
      });

      if (!response.ok) {
        throw new Error(`Erro na API de textura: ${response.status}`);
      }

      const result = await response.json();
      const textureBase64 = `data:image/png;base64,${result.texture}`;
      setPlanetTexture(textureBase64);
      return textureBase64;
    } catch (err) {
      console.warn("Erro na geração de textura:", err);
      // Não propagamos o erro de textura, pois é opcional
      return null;
    }
  };

  const processExoplanet = async (data: ExoplanetData) => {
    setIsLoading(true);
    try {
      // Executar ambas as chamadas em paralelo
      const [identification, texture] = await Promise.allSettled([
        identifyExoplanet(data),
        generateTexture(data),
      ]);

      return {
        identification:
          identification.status === "fulfilled" ? identification.value : null,
        texture: texture.status === "fulfilled" ? texture.value : null,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const determineTerrainType = (data: ExoplanetData): string => {
    const temp = data.pl_eqt || 288;
    const radius = data.pl_rade;

    if (temp < 200) return "ice";
    if (temp > 400) return "desert";
    if (radius < 0.5) return "rocky";
    if (temp > 273 && temp < 373) return "vegetation";
    return "terrestrial";
  };

  const calculateAverageTemp = (data: ExoplanetData): number => {
    if (data.pl_eqt) return data.pl_eqt - 273.15;
    if (data.pl_insol) return data.pl_insol * 15 - 15;
    return 15;
  };

  return {
    isLoading,
    identificationResult,
    planetTexture,
    error,
    identifyExoplanet,
    generateTexture,
    processExoplanet,
  };
};
