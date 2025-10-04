import Image from "next/image";

const KnowMore = () => {
  return (
    <div className="w-full min-h-screen px-10 py-20">
      <div className="flex flex-row w-full mb-20">
        <div className="flex flex-col items-center justify-center w-full">
          <h2
            className="
                      text-center 
          font-nunito 
          text-[48px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent
                      "
          >
            SAIBA MAIS
          </h2>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="w-full flex items-center justify-center relative">
          <Image
            src="/exoplanet_azul.svg"
            alt="Background glow"
            width={450}
            height={450}
            className="absolute blur-3xl opacity-50 z-0"
            style={{ transform: "translate(-20px, 10px)" }}
          />
          <Image
            src="/exoplanet_azul.svg"
            alt="Description of image"
            width={400}
            height={400}
            className="relative z-10"
          />
        </div>
      </div>

      <div className="flex flex-row w-full mb-20">
        <div className="w-full flex items-center justify-center relative">
          <Image
            src="/exoplanet_laranja.svg"
            alt="Background glow"
            width={15000}
            height={250}
            className="absolute blur-3xl opacity-50 z-0"
            style={{ transform: "translate(12px, -60px)" }}
          />
          <Image
            src="/exoplanet_laranja.svg"
            alt="Description of image"
            width={900}
            height={200}
            className="relative z-10"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <h2
            className="
                      text-center 
          font-nunito 
          text-[48px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent
                      "
          >
            PROJETO
          </h2>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>

      <div className="flex flex-row w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <h2
            className="
                      text-center 
          font-nunito 
          text-[48px] 
          font-bold 
          leading-[150%] 
          bg-gradient-to-b from-[#525252] to-[#FFFFFF] 
          bg-clip-text 
          text-transparent
                      "
          >
            SOBRE NÓS
          </h2>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="w-full flex items-center justify-center relative">
          <Image
            src="/exoplanet_vermelho.svg"
            alt="Background glow"
            width={2}
            height={250}
            className="absolute blur-3xl opacity-50 z-0"
            style={{ transform: "translate(16px, -24px)" }}
          />
          <Image
            src="/exoplanet_vermelho.svg"
            alt="Description of image"
            width={200}
            height={200}
            className="relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default KnowMore;
