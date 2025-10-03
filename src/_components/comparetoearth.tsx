import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import Comparacao_Planetas from "./Comparacao_Planetas/Comparacao_Planetas";

const CompareToEarth = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="pb-8 flex items-center justify-center font-nunito text-[48px] leading-normal text-center bg-gradient-to-t from-neutral-600 to-white bg-clip-text text-transparent">
        COMPARE COM A TERRA
      </h1>
      <Card className="w-full h-[900px] bg-black ">
        <CardContent className="flex items-center justify-center h-[calc(100%-160px)] w-full">
          <div className="w-[85%] h-[100%]">
            <Comparacao_Planetas />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <CardAction></CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompareToEarth;
