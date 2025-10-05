import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import Image from "next/image";

const SearchNewWorlds = () => {
  return (
    <div className="w-full h-[1200px] flex flex-col items-center px-6 space-y-14 pt-40">
      <h1
        className="text-center 
          font-nunito 
          text-[40px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent"
      >
        IDENTIFIQUE NOVOS MUNDOS ALÉM DO NOSSO SISTEMA SOLAR
      </h1>

      <Card className="w-full h-[900px] border-none shadow-none">
        <CardContent className="relative w-full h-full p-4">
          <Image
            src="/Model.svg"
            alt="Description of image"
            fill
            className="object-contain"
          />
        </CardContent>
      </Card>
      <div className="flex flex-1 flex-col space-y-6 mt-4 items-center justify-center w-[80%]">
        <p className="text-white text-[20px] text-center">
          Desenvolvemos do zero um sistema de inteligência artificial capaz de
          identificar potenciais exoplanetas. Utilizando dados públicos das
          missões Kepler, K2 e TESS da NASA, nosso modelo processa curvas de luz
          e as transforma em uma pontuação clara de probabilidade: a chance de
          um sinal ser de fato um exoplaneta ou um falso positivo.
        </p>
        <p className="text-white text-[20px] text-center">
          O sistema analisa automaticamente grandes volumes de observações e
          apresenta os resultados em tempo real em um painel simples e visual,
          servindo como guia para indicar onde vale a pena olhar primeiro.
        </p>
      </div>
    </div>
  );
};

export default SearchNewWorlds;
