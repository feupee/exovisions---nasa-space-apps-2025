import Scene3D from "./Scene3D"

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
    <div className=" bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto items-center grid grid-cols-1 sm:gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl text-center pr-25">
              Compare o ExoPlaneta Com a Terra!
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {/*Dados recebidos: Temperatura {mockApiData.averageTemp}°C.
                  Planeta renderizado: **{exoplanetData.type}**{" "}
                  {exoplanetData.hasClouds ? "(Com Nuvens)" : "(Sem Nuvens)"}.*/}
            </p>
          </div>

          <div className="">
            <div className=" h-[700px] w-full rounded-lg overflow-hidden">
              <Scene3D exoplanetData={exoplanetData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
