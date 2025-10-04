import { Card } from "./ui/card";

const AlignCards = () => {
  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-black gap-5 px-10">
      
      <Card className="flex-1 h-[500px] bg-black border border-white/10"></Card>
      <Card className="flex-1 h-[500px] bg-black border border-white/10"></Card>
      <Card className="flex-1 h-[500px] bg-black border border-white/10"></Card>
      <Card className="flex-1 h-[500px] bg-black border border-white/10"></Card>
    </div>
  );
};

export default AlignCards;
