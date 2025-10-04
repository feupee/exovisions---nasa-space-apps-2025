"use client";

import { useState } from "react";
import Particles from "../../_components/Particles";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";

interface ExoplanetData {
  pl_orbper: number;
  pl_trandurh: number;
  pl_trandep: number;
  pl_rade: number;
  pl_insol?: number;
  pl_eqt?: number;
  st_teff?: number;
  st_logg?: number;
}

const IdentifyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Capturar dados do formulário
      const formData = new FormData(e.target as HTMLFormElement);

      const data: ExoplanetData = {
        pl_orbper: parseFloat(formData.get("pl_orbper") as string),
        pl_trandurh: parseFloat(formData.get("pl_trandurh") as string),
        pl_trandep: parseFloat(formData.get("pl_trandep") as string),
        pl_rade: parseFloat(formData.get("pl_rade") as string),
      };

      // Adicionar campos opcionais se preenchidos
      const optionalFields = ["pl_insol", "pl_eqt", "st_teff", "st_logg"];
      optionalFields.forEach((field) => {
        const value = formData.get(field) as string;
        if (value && value.trim() !== "") {
          (data as any)[field] = parseFloat(value);
        }
      });

      console.log("Dados coletados:", data);

      // Enviar para API do Google Cloud
      const response = await fetch("/api/identify-exoplanet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      setResult(result);
      console.log("Resultado:", result);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao processar dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-black w-full min-h-screen overflow-hidden">
      {/* Particles como background absoluto */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleSpread={10}
          speed={0.3}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={true}
        />
      </div>

      {/* Formulário sobreposto */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-white text-center mb-8 font-nunito">
            Identificação de Exoplanetas
          </h1>

          {/* Resultado da análise */}
          {result && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
              <h2 className="text-green-400 font-semibold mb-2">
                Resultado da Análise:
              </h2>
              <pre className="text-white text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid para organizar os inputs */}
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
                  placeholder="Ex: 365.25"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  required
                  disabled={isLoading}
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
                  placeholder="Ex: 3.5"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Profundidade */}
              <div className="space-y-2">
                <Label
                  htmlFor="transitDepth"
                  className="text-white font-medium text-sm"
                >
                  Profundidade (ppm) *
                </Label>
                <Input
                  id="transitDepth"
                  name="pl_trandep"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1000"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  required
                  disabled={isLoading}
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
                  placeholder="Ex: 1.0"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Insolação */}
              <div className="space-y-2">
                <Label
                  htmlFor="insolation"
                  className="text-white font-medium text-sm"
                >
                  Insolação (S⊕)
                </Label>
                <Input
                  id="insolation"
                  name="pl_insol"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1.0"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>

              {/* Temperatura de equilíbrio */}
              <div className="space-y-2">
                <Label
                  htmlFor="equilibriumTemp"
                  className="text-white font-medium text-sm"
                >
                  Temperatura de equilíbrio (K)
                </Label>
                <Input
                  id="equilibriumTemp"
                  name="pl_eqt"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 288"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  disabled={isLoading}
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
                  placeholder="Ex: 5778"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  disabled={isLoading}
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
                  placeholder="Ex: 4.44"
                  className="bg-black/50 border-white/30 text-white placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Botão de enviar */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold focus-visible:ring-blue-500/20"
                disabled={isLoading}
              >
                {isLoading ? "Analisando..." : "Identificar Exoplaneta"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IdentifyPage;
