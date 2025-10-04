import CompareToEarth from "@/_components/comparetoearth";
import SearchNewWorlds from "@/_components/searchneworlds";
import ApppliedBlur from "@/_components/Blur/AppliedBlur";
import ScienceEveryday from "@/_components/scienceeveryday";
import DarkVeil from "@/_components/welcomepage";
import AlignCards from "@/_components/aligncards";
import AjudaCircle from "@/_components/ajudacircle";
import KnowMore from "@/_components/KnowMore";
import Footer from "@/_components/Footer";

export default function Home() {
  return (
    <main className="relative bg-black overflow-x-hidden scrollbar-hide">
      <div className="w-full h-screen">
        <DarkVeil />
      </div>

      <ApppliedBlur />
      <div className="relative">
        <SearchNewWorlds />
        <CompareToEarth />
        <ScienceEveryday />
        <AlignCards />
        <AjudaCircle />
        <KnowMore />
        <Footer />
      </div>

      
    </main>
  );
}
