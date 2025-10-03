import CompareToEarth from "@/_components/comparetoearth";
import SearchNewWorlds from "@/_components/searchneworlds";
import WelcomePage from "@/_components/welcomepage";

export default function Home() {
  return (
    <main className="bg-black overflow-x-auto scrollbar-hide">
      <div className="w-full h-screen">
        <WelcomePage />
      </div>
        <SearchNewWorlds />
        <CompareToEarth />
        
    </main>
  );
}
