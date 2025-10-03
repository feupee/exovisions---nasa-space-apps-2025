import Scene3D from "./Scene3D";

export default function Comparacao_Planetas() {
  const mockApiData = {
    averageTemp: -20,
    waterPresence: "ice",
    mainTerrain: "vegetation",
  };

  const determinedType = "Terrestrial";

  const planetsWithClouds = [
    "Wetlands",
    "Tundra",
    "Tropical",
    "Terrestrial",
    "Swamp",
    "Savannah",
    "Oceanic",
  ];

  const hasClouds = planetsWithClouds.includes(determinedType);

  const exoplanetData = {
    type: determinedType,
    hasClouds: hasClouds,
    variation: Math.floor(Math.random() * 4) + 1,
  };

  return (
    <div className="h-full w-full">
      <Scene3D exoplanetData={exoplanetData} />
    </div>
  );
}
