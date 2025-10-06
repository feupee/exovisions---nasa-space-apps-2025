// src/app/identify/page.tsx
"use client";

import { useState } from "react";
import Particles from "../../_components/Particles";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Card, CardContent, CardTitle } from "@/_components/ui/card";
import Comparacao_Planetas from "@/_components/Comparacao_Planetas/Comparacao_Planetas";
import { classifyPlanet, ExoplanetData } from "@/utils/planetClassification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";

const IdentifyPage = () => {
  const [submittedData, setSubmittedData] = useState<ExoplanetData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(null);
    setError(null);
    setIdentificationResult(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      console.log("=== FORMDATA BRUTO ===");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value} (tipo: ${typeof value})`);
      }

      // Função helper para converter valores obrigatórios - não pode retornar null
      const parseRequiredValue = (value: string | null): number => {
        if (!value || value.trim() === "") {
          throw new Error("Campo obrigatório não pode estar vazio");
        }
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
          throw new Error("Valor deve ser um número válido");
        }
        return parsed;
      };

      // Função helper para valores opcionais - pode retornar null
      const parseOptionalValue = (value: string | null): number | null => {
        if (!value || value.trim() === "") {
          return null;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      };

      // Campos obrigatórios - NUNCA podem ser null
      const data: ExoplanetData = {
        pl_orbper: parseRequiredValue(formData.get("pl_orbper") as string),
        pl_trandurh: parseRequiredValue(formData.get("pl_trandurh") as string),
        pl_trandep: parseRequiredValue(formData.get("pl_trandep") as string),
        pl_rade: parseRequiredValue(formData.get("pl_rade") as string),
        pl_insol: parseRequiredValue(formData.get("pl_insol") as string),
        pl_eqt: parseRequiredValue(formData.get("pl_eqt") as string),
        // Campos opcionais - PODEM ser null
        st_teff: parseOptionalValue(formData.get("st_teff") as string),
        st_logg: parseOptionalValue(formData.get("st_logg") as string),
      };

      console.log("=== DADOS FINAIS PROCESSADOS ===");
      console.log("Data objeto:", data);
      console.log("Data JSON:", JSON.stringify(data, null, 2));

      // Verificar especificamente os campos opcionais
      console.log("=== VERIFICAÇÃO ESPECÍFICA ===");
      console.log(
        `st_teff (Temperatura estelar): ${data.st_teff} (é null: ${
          data.st_teff === null
        })`
      );
      console.log(
        `st_logg (Gravidade superficial): ${data.st_logg} (é null: ${
          data.st_logg === null
        })`
      );

      // Chamar API via route.ts -> predict.py
      try {
        const baseFeatures = {
          pl_orbper: data.pl_orbper,
          pl_trandurh: data.pl_trandurh,
          pl_trandep: data.pl_trandep,
          pl_rade: data.pl_rade,
          pl_insol: data.pl_insol,
          pl_eqt: data.pl_eqt,
        };

        const apiData: any = { ...baseFeatures };
        if (data.st_teff !== null && data.st_teff !== undefined)
          apiData.st_teff = data.st_teff;
        if (data.st_logg !== null && data.st_logg !== undefined)
          apiData.st_logg = data.st_logg;

        const fieldCount = Object.keys(apiData).length;
        const has_st_teff = "st_teff" in apiData;
        const has_st_logg = "st_logg" in apiData;

        let modelType = "";
        if (!has_st_teff && !has_st_logg) modelType = "6 campos básicos";
        else if (has_st_teff && !has_st_logg)
          modelType = "7 campos (com st_teff)";
        else if (!has_st_teff && has_st_logg)
          modelType = "7 campos (com st_logg)";
        else modelType = "8 campos completos";

        console.log(
          `=== ENVIANDO ${fieldCount} CAMPOS (${modelType}) PARA API ===`
        );
        console.log("Dados para API:", apiData);

        const response = await fetch("/api/identify-exoplanet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("=== RESULTADO DA API ===", result);

          // Simplificar resultado
          const simplifiedResult = {
            prediction: result.prediction, // 0 ou 1
            message:
              result.prediction === 1
                ? "✅ Este é um EXOPLANETA!"
                : "❌ NÃO é um exoplaneta.",
            classification:
              result.prediction === 1 ? "Exoplaneta" : "Não Exoplaneta",
          };

          setIdentificationResult(simplifiedResult);
        } else {
          console.log("API não disponível");
        }
      } catch (apiError) {
        console.log("Erro na API (continuando):", apiError);
        setError("Erro na comunicação com a API de identificação");
      }

      // Processar dados para visualização
      console.log("=== INICIANDO PROCESSAMENTO ===");
      setSubmittedData(data);
    } catch (error) {
      console.error("=== ERRO NO HANDLESUBMIT ===", error);
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao processar dados. Verifique os valores inseridos."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Função para determinar o tipo de terreno baseado nos dados
  const determineTerrainType = (data: ExoplanetData): string => {
    const planetProfile = classifyPlanet(data);
    return planetProfile.type;
  };

  // Função para obter descrição detalhada
  const getPlanetDescription = (data: ExoplanetData) => {
    return classifyPlanet(data);
  };

  return (
    <div className="relative bg-black w-full min-h-screen overflow-hidden">
      {/* Partículas de fundo */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={500}
          particleSpread={10}
          speed={0.3}
          disableRotation={true}
          particleColors={["#ffffff", "#ffffff", "#ffffff"]}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-black border border-white/15 rounded-lg p-4 max-w-6xl w-full">
          {/* Header com título e card de modelos */}
          <div className="flex flex-row items-center justify-between mb-4">
            <div className="flex-1"></div>

            <div className="flex-1 flex justify-center">
              <h1 className="text-2xl font-bold text-white text-center font-nunito">
                Identificação de Exoplanetas
              </h1>
            </div>

            <div className="flex-1 flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white cursor-pointer"
                  >
                    Precisões
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black/90 border border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Modelo e suas precisões</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <div className="text-white font-semibold mb-2">
                        Random Forest:
                      </div>
                      <div className="text-white text-sm space-y-1">
                        <div>KOI - 83% de precisão</div>
                        <div>TOI - 78% de precisão</div>
                        <div>K2 - 98% de precisão</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-semibold mb-2">
                        XGBoost:
                      </div>
                      <div className="text-white text-sm space-y-1">
                        <div>KOI - 82% de precisão</div>
                        <div>TOI - 77% de precisão</div>
                        <div>K2 - 98% de precisão</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-white font-semibold mb-2">
                        Stacking:
                      </div>
                      <div className="text-white text-sm space-y-1">
                        <div>KOI - 83,43% de precisão</div>
                        <div>TOI - 79% de precisão</div>
                        <div>K2 - 99% de precisão</div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6 px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Período orbital */}
              <div className="space-y-2">
                <Label
                  htmlFor="orbitalPeriod"
                  className="text-white font-medium text-sm"
                >
                  Período orbital (dias) *
                </Label>
                <Input
                  id="orbitalPeriod"
                  name="pl_orbper"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Duração do trânsito */}
              <div className="space-y-2">
                <Label
                  htmlFor="transitDuration"
                  className="text-white font-medium text-sm"
                >
                  Duração do trânsito (horas) *
                </Label>
                <Input
                  id="transitDuration"
                  name="pl_trandurh"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Profundidade do trânsito */}
              <div className="space-y-2">
                <Label
                  htmlFor="transitDepth"
                  className="text-white font-medium text-sm"
                >
                  Profundidade do trânsito (ppm) *
                </Label>
                <Input
                  id="transitDepth"
                  name="pl_trandep"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Raio planetário */}
              <div className="space-y-2">
                <Label
                  htmlFor="planetRadius"
                  className="text-white font-medium text-sm"
                >
                  Raio planetário (R⊕) *
                </Label>
                <Input
                  id="planetRadius"
                  name="pl_rade"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Insolação */}
              <div className="space-y-2">
                <Label
                  htmlFor="insolation"
                  className="text-white font-medium text-sm"
                >
                  Insolação (S⊕) *
                </Label>
                <Input
                  id="insolation"
                  name="pl_insol"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Temperatura de equilíbrio */}
              <div className="space-y-2">
                <Label
                  htmlFor="equilibriumTemp"
                  className="text-white font-medium text-sm"
                >
                  Temperatura de equilíbrio (K) *
                </Label>
                <Input
                  id="equilibriumTemp"
                  name="pl_eqt"
                  type="number"
                  step="any"
                  placeholder=""
                  required
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Temperatura estelar */}
              <div className="space-y-2">
                <Label
                  htmlFor="stellarTemp"
                  className="text-white font-medium text-sm"
                >
                  Temperatura estelar (K) - Opcional
                </Label>
                <Input
                  id="stellarTemp"
                  name="st_teff"
                  type="number"
                  step="any"
                  placeholder=""
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Gravidade superficial */}
              <div className="space-y-2">
                <Label
                  htmlFor="surfaceGravity"
                  className="text-white font-medium text-sm"
                >
                  Gravidade superficial (log10(cm/s²)) - Opcional
                </Label>
                <Input
                  id="surfaceGravity"
                  name="st_logg"
                  type="number"
                  step="any"
                  placeholder=""
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            {/* Botão de submit */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8"
                disabled={isLoading}
              >
                {isLoading ? "Analisando..." : "Identificar e Visualizar"}
              </Button>
            </div>
          </form>

          {/* Resultado da identificação AI - SIMPLIFICADO */}
          {identificationResult && (
            <div
              className={`mt-8 p-6 rounded-lg border ${
                identificationResult.prediction === 1
                  ? "bg-green-500/20 border-green-500/30"
                  : "bg-red-500/20 border-red-500/30"
              }`}
            >
              <div className="space-y-3">
                <p
                  className={`text-lg font-semibold ${
                    identificationResult.prediction === 1
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {identificationResult.message}
                </p>

                <p className="text-white/80">
                  <span className="font-medium">Classificação:</span>{" "}
                  {identificationResult.classification}
                </p>
              </div>
            </div>
          )}

          {/* Exibir erro se houver */}
          {error && (
            <div className="mt-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-400"></div>
                <h3 className="text-red-400 font-semibold">Erro na Análise</h3>
              </div>
              <p className="text-white mt-2">{error}</p>
            </div>
          )}

          {/* Visualização 3D com a Terra */}
          {submittedData && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6 font-nunito">
                Comparação com a Terra
              </h2>

              <div className="h-[500px] w-full bg-black border border-white/10 rounded-lg overflow-hidden">
                <Comparacao_Planetas
                  exoplanetData={submittedData}
                  planetTexture={undefined} // Mudando de null para undefined
                />
              </div>

              {/* Informações comparativas melhoradas */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-3 text-lg">
                    Terra
                  </h3>
                  <ul className="text-white text-sm space-y-2">
                    <li>
                      <span className="font-medium">Raio:</span> 1.0 R⊕
                    </li>
                    <li>
                      <span className="font-medium">Período orbital:</span>{" "}
                      365.25 dias
                    </li>
                    <li>
                      <span className="font-medium">Temperatura:</span> 15°C
                    </li>
                    <li>
                      <span className="font-medium">Atmosfera:</span> Sim
                    </li>
                    <li>
                      <span className="font-medium">Água líquida:</span> Sim
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                  <h3 className="text-purple-400 font-semibold mb-3 text-lg">
                    Seu Exoplaneta
                  </h3>
                  <ul className="text-white text-sm space-y-2">
                    <li>
                      <span className="font-medium">Raio:</span>{" "}
                      {Math.abs(submittedData.pl_rade).toFixed(2)} R⊕
                    </li>
                    <li>
                      <span className="font-medium">Período orbital:</span>{" "}
                      {Math.abs(submittedData.pl_orbper).toFixed(2)} dias
                    </li>
                    <li>
                      <span className="font-medium">Temperatura:</span>{" "}
                      {Math.abs(submittedData.pl_eqt).toFixed(1)}K
                    </li>
                    <li>
                      <span className="font-medium">Insolação:</span>{" "}
                      {Math.abs(submittedData.pl_insol).toFixed(2)} S⊕
                    </li>
                    <li>
                      <span className="font-medium">Temp. Estelar:</span>{" "}
                      {submittedData.st_teff !== null &&
                      submittedData.st_teff !== undefined
                        ? `${Math.abs(submittedData.st_teff).toFixed(0)}K`
                        : "NULL"}
                    </li>
                    <li>
                      <span className="font-medium">Gravidade:</span>{" "}
                      {submittedData.st_logg !== null &&
                      submittedData.st_logg !== undefined
                        ? `${Math.abs(submittedData.st_logg).toFixed(2)}`
                        : "NULL"}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Nova seção: Características do planeta */}
              {(() => {
                const planetInfo = getPlanetDescription(submittedData);
                return (
                  <div className="mt-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
                    <h3 className="text-purple-300 font-semibold mb-3 text-xl">
                      Características do Planeta
                    </h3>
                    <p className="text-white/90 mb-4 leading-relaxed">
                      {planetInfo.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {planetInfo.characteristics.map((char, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-lg p-3 text-center"
                        >
                          <span className="text-white/80 text-sm">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentifyPage;
