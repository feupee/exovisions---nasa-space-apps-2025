// src/app/identify/page.tsx
"use client";

import { useState } from "react";
import Particles from "../../_components/Particles";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Card, CardContent, CardTitle } from "@/_components/ui/card";
import Comparacao_Planetas from "@/_components/Comparacao_Planetas/Comparacao_Planetas";
import { useExoplanetAPI, ExoplanetData } from "@/hooks/useExoplanetAPI";

const IdentifyPage = () => {
  const [submittedData, setSubmittedData] = useState<ExoplanetData | null>(
    null
  );
  const {
    isLoading,
    identificationResult,
    planetTexture,
    error,
    processExoplanet,
  } = useExoplanetAPI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);

      // 🔍 LOG 1: Verificar FormData bruto
      console.log("=== FORMDATA BRUTO ===");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value} (tipo: ${typeof value})`);
      }

      const data: ExoplanetData = {
        pl_orbper: parseFloat(formData.get("pl_orbper") as string),
        pl_trandurh: parseFloat(formData.get("pl_trandurh") as string),
        pl_trandep: parseFloat(formData.get("pl_trandep") as string),
        pl_rade: parseFloat(formData.get("pl_rade") as string),
      };

      // Adicionar campos opcionais
      const optionalFields: (keyof ExoplanetData)[] = [
        "pl_insol",
        "pl_eqt",
        "st_teff",
        "st_logg",
      ];

      // 🔍 LOG 2: Verificar cada campo opcional
      console.log("=== CAMPOS OPCIONAIS ===");
      optionalFields.forEach((field) => {
        const value = formData.get(field as string) as string;
        console.log(
          `${field}: "${value}" (vazio: ${!value || value.trim() === ""})`
        );
        if (value && value.trim() !== "") {
          data[field] = parseFloat(value);
          console.log(`${field} adicionado: ${data[field]}`);
        }
      });

      // 🔍 LOG 3: Dados finais
      console.log("=== DADOS FINAIS PROCESSADOS ===");
      console.log("Data objeto:", data);
      console.log("Data JSON:", JSON.stringify(data, null, 2));

      // 🔍 LOG 4: Verificar cada valor
      console.log("=== VERIFICAÇÃO DE VALORES ===");
      Object.entries(data).forEach(([key, value]) => {
        console.log(
          `${key}: ${value} (tipo: ${typeof value}, isNaN: ${isNaN(
            value as number
          )})`
        );
      });

      // Processar com ambas as APIs
      console.log("=== INICIANDO PROCESSAMENTO ===");
      const result = await processExoplanet(data);
      console.log("=== RESULTADO DO PROCESSAMENTO ===", result);

      setSubmittedData(data);
    } catch (error) {
      console.error("=== ERRO NO HANDLESUBMIT ===", error);
      alert("Erro ao processar dados. Tente novamente.");
    }
  };

  // Função para determinar o tipo de terreno baseado nos dados
  const determineTerrainType = (data: ExoplanetData): string => {
    const temp = data.pl_eqt || 288;
    const radius = data.pl_rade;

    if (temp < 200) return "ice";
    if (temp > 400) return "desert";
    if (radius < 0.5) return "rocky";
    if (temp > 273 && temp < 373) return "vegetation";
    return "terrestrial";
  };

  // Função para calcular temperatura média
  const calculateAverageTemp = (data: ExoplanetData): number => {
    if (data.pl_eqt) return data.pl_eqt - 273.15;
    if (data.pl_insol) return data.pl_insol * 15 - 15;
    return 15;
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
              <Card className="bg-black/50 border-white/20">
                <CardTitle className="text-white text-center p-2">
                  Modelos
                </CardTitle>
                <CardContent className="space-y-1 p-2">
                  <div className="text-center">
                    <p className="text-white text-xs">KOI</p>
                    <p className="text-white text-xs">
                      RandomForest - % acurácia
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-xs">TOI</p>
                    <p className="text-white text-xs">Stacking - % acurácia</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-xs">K2</p>
                    <p className="text-white text-xs">XGBoost - % acurácia</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  step="0.01"
                  placeholder="Ex: -0.2188 (valor normalizado)"
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
                  step="0.01"
                  placeholder="Ex: -1.3523 (valor normalizado)"
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
                  step="0.01"
                  placeholder="Ex: -0.1709 (valor normalizado)"
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
                  step="0.01"
                  placeholder="Ex: -1.0207 (valor normalizado)"
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
                  Insolação (S⊕) - Opcional
                </Label>
                <Input
                  id="insolation"
                  name="pl_insol"
                  type="number"
                  step="0.01"
                  placeholder="Ex: -0.2652 (valor normalizado)"
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
                  Temperatura de equilíbrio (K) - Opcional
                </Label>
                <Input
                  id="equilibriumTemp"
                  name="pl_eqt"
                  type="number"
                  step="0.01"
                  placeholder="Ex: -0.8377 (valor normalizado)"
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
                  step="0.01"
                  placeholder="Ex: -1.8462 (valor normalizado)"
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
                  step="0.01"
                  placeholder="Ex: 2.4446 (valor normalizado)"
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

          {/* Resultado da identificação AI */}
          {identificationResult && (
            <div
              className={`mt-8 p-6 rounded-lg border ${
                identificationResult.prediction === 1
                  ? "bg-green-500/20 border-green-500/30"
                  : "bg-red-500/20 border-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    identificationResult.prediction === 1
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                ></div>
                <h3 className="text-xl font-bold text-white">
                  Resultado da Análise AI
                </h3>
              </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/80">
                      <span className="font-medium">Classificação:</span>{" "}
                      {identificationResult.classification}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80">
                      <span className="font-medium">Confiança:</span>{" "}
                      {(identificationResult.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Barra de confiança visual */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      identificationResult.prediction === 1
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                    style={{
                      width: `${identificationResult.confidence * 100}%`,
                    }}
                  ></div>
                </div>
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
                  planetTexture={planetTexture}
                />
              </div>

              {/* Informações comparativas */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h3 className="text-blue-400 font-semibold mb-3 text-lg">
                    🌍 Terra
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
                    🪐 Seu Exoplaneta
                  </h3>
                  <ul className="text-white text-sm space-y-2">
                    <li>
                      <span className="font-medium">Raio:</span>{" "}
                      {submittedData.pl_rade.toFixed(2)} R⊕
                    </li>
                    <li>
                      <span className="font-medium">Período orbital:</span>{" "}
                      {submittedData.pl_orbper.toFixed(2)} dias
                    </li>
                    <li>
                      <span className="font-medium">Temperatura:</span>{" "}
                      {submittedData.pl_eqt
                        ? `${(submittedData.pl_eqt - 273.15).toFixed(1)}°C`
                        : "N/A"}
                    </li>
                    <li>
                      <span className="font-medium">Tipo:</span>{" "}
                      {determineTerrainType(submittedData)}
                    </li>
                    <li>
                      <span className="font-medium">Insolação:</span>{" "}
                      {submittedData.pl_insol?.toFixed(2) || "N/A"} S⊕
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentifyPage;
