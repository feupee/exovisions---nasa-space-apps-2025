import Blur from "./Blur";

const AppliedBlur = () => {
    return ( 
        <>
        {/* Blur para o descubra novos mundos */}
      <Blur
        className="absolute top-[18%] right-[32%]"
        size="w-[700px] h-[700px]"
        color="bg-blue-600"
        opacity="opacity-20"
      />
      {/* Blur para a seção SearchNewWorlds/CompareToEarth */}
      <Blur
        className="absolute top-[20%] left-[28%]"
        size="w-[700px] h-[800px]"
        color="bg-blue-600"
        opacity="opacity-15"
      />
        </>
     );
}
 
export default AppliedBlur;