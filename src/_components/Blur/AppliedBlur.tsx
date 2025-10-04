import Blur from "./Blur";

const AppliedBlur = () => {
    return ( 
        <>
        {/* Blur para o descubra novos mundos */}
      <Blur
        className="absolute top-[15%] right-[32%]"
        size="w-[700px] h-[700px]"
        color="bg-blue-600"
        opacity="opacity-20"
      />
      {/* Blur para a seção SearchNewWorlds/CompareToEarth */}
      <Blur
        className="absolute top-[17%] left-[28%]"
        size="w-[700px] h-[800px]"
        color="bg-blue-600"
        opacity="opacity-15"
      />
      {/* Blur para knowmore1 */}
      <Blur
        className="absolute top-[73%] left-[40%]"
        size="w-[500px] h-[700px]"
        color="bg-white"
        opacity="opacity-10"
      />
      {/* Blur para knowmore2 */}
      <Blur
        className="absolute top-[75%] left-[26%]"
        size="w-[500px] h-[500px]"
        color="bg-blue-600"
        opacity="opacity-15"
      />

      {/* Blur para knowmore3 */}
      <Blur
        className="absolute top-[80%] left-[35%]"
        size="w-[700px] h-[700px]"
        color="bg-blue-600"
        opacity="opacity-20"
      />
      
        </>
     );
}
 
export default AppliedBlur;