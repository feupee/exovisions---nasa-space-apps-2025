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
    <div className="w-full h-[1100px] flex flex-col items-center px-6 space-y-14">
      <h1 className="flex items-center justify-center font-nunito text-[48px] leading-normal text-center bg-gradient-to-t from-neutral-600 to-white bg-clip-text text-transparent">
        COMPARE COM A TERRA
      </h1>

      <Card className="w-full h-[900] bg-black border border-white/10">
        <CardHeader>
          <CardTitle ></CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
          </CardDescription>
          <Comparacao_Planetas />
        </CardContent>
        <CardFooter>
          <CardAction></CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompareToEarth;
