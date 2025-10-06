import Scene3D from "./Scene3D";
import {
  classifyPlanet,
  ExoplanetData,
  getTexturePath,   // <— ADICIONE
} from "@/utils/planetClassification";

interface ComparacaoPlanetasProps {
  exoplanetData?: ExoplanetData | null;
  planetTexture?: string; // opcional (continua aceitando override manual)
}

export default function Comparacao_Planetas({
  exoplanetData,
  planetTexture,
}: ComparacaoPlanetasProps) {
  console.log("Comparacao_Planetas recebeu:", { exoplanetData, planetTexture });

  let finalExoplanetData;
  let finalTexturePath: string | undefined;

  if (exoplanetData && typeof exoplanetData === "object") {
    try {
      // 1) Classificar (usa defaults lógicos internamente: st_teff=5778 K, etc.)
      const planetProfile = classifyPlanet(exoplanetData);

      // 2) Escolher textura automaticamente (a menos que o prop planetTexture force)
      const autoTexture = getTexturePath(
        planetProfile.type,
        planetProfile.variation,
        planetProfile.hasClouds
      );

      finalTexturePath = planetTexture || autoTexture;

      // 3) Raio para visual (com clamp) — se não vier, usa 1.0 (Terra)
      const radiusInEarthRadii = Math.abs(exoplanetData.pl_rade ?? 1.0);
      const visualRadius = Math.max(0.5, Math.min(6.0, radiusInEarthRadii));

      finalExoplanetData = {
        type: planetProfile.type,
        variation: planetProfile.variation,
        hasClouds: planetProfile.hasClouds,
        description: planetProfile.description,
        characteristics: planetProfile.characteristics,
        radius: visualRadius,
        actualRadius: radiusInEarthRadii,
        texturePath: finalTexturePath,          // <— passa a textura junto
        originalData: exoplanetData,
      };
    } catch (error) {
      console.error("Erro ao classificar planeta:", error);
      finalTexturePath = planetTexture || "/textures/Rock/Rock_1.png";
      finalExoplanetData = {
        type: "Rock",
        variation: 1,
        hasClouds: false,
        radius: 1.0,
        actualRadius: 1.0,
        texturePath: finalTexturePath,
        description: "Erro na classificação - usando dados padrão.",
        characteristics: ["Dados insuficientes para classificação"],
        originalData: exoplanetData,
      };
    }
  } else {
    // Vitrine: defaults plausíveis (Terra-like)
    finalTexturePath = planetTexture || "/textures/Terrestrial/Terrestrial_1_clouds.png";
    finalExoplanetData = {
      type: "Terrestrial",
      variation: 1,
      hasClouds: true,
      radius: 1.0,
      actualRadius: 1.0,
      texturePath: finalTexturePath,
      description: "Um planeta similar à Terra para demonstração.",
      characteristics: ["Oceanos e continentes", "Atmosfera respirável", "Vida possível"],
    };
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full rounded-lg overflow-hidden">
        {/* Scene3D pode ler finalExoplanetData.texturePath para aplicar a textura */}
        <Scene3D exoplanetData={finalExoplanetData} />
      </div>
    </div>
  );
}
