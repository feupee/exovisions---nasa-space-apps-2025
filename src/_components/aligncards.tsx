import Image from "next/image";
import { Card } from "./ui/card";
import AnimatedFlipCard from "./ui/flipcards";

const AlignCards = () => {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-black gap-20 px-10">
      {/* Cards principais */}
      <AnimatedFlipCard
        frontContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src="/flipcard1.svg"
                alt="Description"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-white font-nunito text-2xl font-semibold mt-4">
              O Planeta sem Sol
            </h3>
          </Card>
        }
        backContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center p-6 shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <p className="text-white font-nunito text-center">
              Existem mundos órfãos que foram ejetados de seus sistemas
              solares. Eles vagam na escuridão do espaço interestelar.
            </p>
          </Card>
        }
      />

      <AnimatedFlipCard
        frontContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src="/flipcard1.svg"
                alt="Description"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-white font-nunito text-2xl font-semibold mt-4">
              O Planeta sem Sol
            </h3>
          </Card>
        }
        backContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center p-6 shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <p className="text-white font-nunito text-center">
              Existem mundos órfãos que foram ejetados de seus sistemas
              solares. Eles vagam na escuridão do espaço interestelar.
            </p>
          </Card>
        }
      />
      <AnimatedFlipCard
        frontContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <div className="relative w-[300px] h-[300px]">
              <Image
                src="/flipcard1.svg"
                alt="Description"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-white font-nunito text-2xl font-semibold mt-4">
              O Planeta sem Sol
            </h3>
          </Card>
        }
        backContent={
          <Card className="flex-1 h-[500px] bg-black border border-white/10 flex flex-col items-center justify-center p-6 shadow-[0px_8px_0px_0px_rgba(64,64,64,0.8)]">
            <p className="text-white font-nunito text-center">
              Existem mundos órfãos que foram ejetados de seus sistemas
              solares. Eles vagam na escuridão do espaço interestelar.
            </p>
          </Card>
        }
      />
    </div>
  );
};

export default AlignCards;
