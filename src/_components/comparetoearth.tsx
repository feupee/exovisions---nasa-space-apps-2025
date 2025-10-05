// src/_components/comparetoearth.tsx
import {
  Card,
  CardContent,
} from "@/_components/ui/card";
import Comparacao_Planetas from "./Comparacao_Planetas/Comparacao_Planetas";
import Image from "next/image";

// 1. Defina os dados estáticos do planeta de vitrine aqui dentro.
const vitrineExoplanetData = {
  pl_eqt: 295,    // Temperatura ideal para água líquida
  pl_rade: 1.6,   // Uma "Super-Terra"
  st_teff: 4500,  // Estrela Anã Laranja (luz alaranjada)
  // --- Outros dados para completar o objeto ---
  pl_orbper: 210,
  pl_trandurh: 4.5,
  pl_trandep: 2100,
  pl_insol: 1.2,
  st_logg: 4.5,
};

const CompareToEarth = () => {
  return (
    <div className="w-full flex flex-col items-center pt-20 md:pt-60">
      <Card className="w-full max-w-7xl h-[600px] md:h-[700px] bg-black/80 backdrop-blur-">
        <CardContent className="flex flex-col md:flex-row items-center justify-center h-full w-full p-4">
          <div className="flex w-full h-full gap-6">
            
            {/* Componente 3D - Lado Esquerdo */}
            <div className="w-full md:w-1/2 h-full">
              {/* 2. Passe os dados estáticos E a prop planetTexture (null para vitrine) */}
              <Comparacao_Planetas 
                exoplanetData={vitrineExoplanetData} 
                planetTexture={null}
              />
            </div>

            {/* Título - Lado Direito */}
            <div className="w-full md:w-1/2 h-full flex items-center justify-center">
              <h1 className="text-center font-nunito text-4xl md:text-5xl font-bold leading-[150%] bg-gradient-to-b from-[#b7b7b7] to-[#FFFFFF] bg-clip-text text-transparent">
                COMPARE COM A TERRA
              </h1>
            </div>
            
          </div>
        </CardContent>
      </Card>
      <div className="pt-20">
        <Image src="./planet_purple.svg" alt="Comparison Image" width={100} height={100} className="mt-10"/>
      </div>
    </div>
  );
};

export default CompareToEarth;