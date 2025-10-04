import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
} from "@/_components/ui/card";
import Comparacao_Planetas from "./Comparacao_Planetas/Comparacao_Planetas";
import Image from "next/image";

const CompareToEarth = () => {
  return (
    <div className="w-full flex flex-col items-center pt-60">
      <Card className="w-full h-[900px] bg-black ">
        <CardContent className="flex items-center justify-center h-[calc(100%-160px)] w-full p-4">
          <div className="flex w-full h-full gap-6">
            {/* Componente 3D - Lado Esquerdo */}
            <div className="w-1/2 h-full pl-20">
              <Comparacao_Planetas />
            </div>
            {/* Título - Lado Direito */}
            <div className="w-1/2 h-full flex items-center justify-center">
              <h1
                className="text-center 
          font-nunito 
          text-[48px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent"
              >
                COMPARE COM A TERRA
              </h1>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <CardAction></CardAction>
        </CardFooter>
      </Card>

      <div className="flex justify-center">
        <div className="relative">
          <Image
            src="/planet_purple.svg"
            alt="Exoplanet"
            width={135}
            height={114}
            className=""
          />
        </div>
      </div>
    </div>
  );
};

export default CompareToEarth;
