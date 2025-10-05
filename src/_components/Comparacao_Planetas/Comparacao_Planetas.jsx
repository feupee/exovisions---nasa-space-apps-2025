import Scene3D from "./Scene3D";
import { classifyPlanet } from "@/utils/planetClassification";

export default function Comparacao_Planetas({ exoplanetData, planetTexture }) {
  console.log("Comparacao_Planetas recebeu:", { exoplanetData, planetTexture });

  // Se temos dados reais do exoplaneta, usar o sistema de classificação
  let finalExoplanetData;

  if (exoplanetData && typeof exoplanetData === "object") {
    // Usar o sistema inteligente de classificação
    const planetProfile = classifyPlanet(exoplanetData);

    // Calcular o raio real baseado nos dados
    const radiusInEarthRadii = Math.abs(exoplanetData.pl_rade) || 1.0;

    // Escalar o raio para visualização (limitando entre 0.5 e 6.0 para não ficar muito extremo)
    const visualRadius = Math.max(0.5, Math.min(6.0, radiusInEarthRadii));

    finalExoplanetData = {
      type: planetProfile.type,
      variation: planetProfile.variation,
      hasClouds: planetProfile.hasClouds,
      description: planetProfile.description,
      characteristics: planetProfile.characteristics,
      radius: visualRadius, // Adicionar o raio calculado
      actualRadius: radiusInEarthRadii, // Raio real para exibição
      // Manter os dados originais para referência
      originalData: exoplanetData,
    };

    console.log("Planeta classificado como:", planetProfile);
    console.log("Raio visual:", visualRadius, "Raio real:", radiusInEarthRadii);
  } else {
    // Dados padrão para visualização de vitrine
    finalExoplanetData = {
      type: "Terrestrial",
      variation: 1,
      hasClouds: true,
      radius: 1.0, // Tamanho padrão da Terra
      actualRadius: 1.0,
      description: "Um planeta similar à Terra para demonstração.",
      characteristics: [
        "Oceanos e continentes",
        "Atmosfera respirável",
        "Vida possível",
      ],
    };
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full rounded-lg overflow-hidden">
        <Scene3D exoplanetData={finalExoplanetData} />
      </div>
    </div>
  );
}
