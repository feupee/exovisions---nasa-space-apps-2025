import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";

const SearchNewWorlds = () => {
  return (
    <div className="w-full h-[1100px] flex flex-col items-center px-6 space-y-14 pt-40">
      <h1 className="text-center 
          font-nunito 
          text-[48px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent">
        DESCUBRA NOVOS MUNDOS <br /> ALÉM DO NOSSO SISTEMA SOLAR
      </h1>
      

      <Card className="w-full h-[900] bg-black border border-white/10">
        <CardHeader>
          <CardTitle ></CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
          </CardDescription>
        </CardContent>
        <CardFooter>
          <CardAction></CardAction>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SearchNewWorlds;
