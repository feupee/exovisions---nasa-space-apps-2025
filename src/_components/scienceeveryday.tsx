const ScienceEveryday = () => {
  return (
    <div className="w-full flex justify-center py-20 px-6">
      <div className="flex flex-col items-center space-y-15 max-w-4xl text-center">
        <p className="text-lg md:text-xl leading-relaxed text-white">
          A cada dia, a ciência e a tecnologia caminham juntas para responder
          uma das maiores perguntas da humanidade: estamos sozinhos no universo?
        </p>

        {/* Linha separadora */}
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

        <p className="text-base md:text-lg leading-relaxed text-gray-300 max-w-4xl">
          Através da inteligência artificial, estamos expandindo os horizontes
          da exploração espacial. Nosso sistema analisa milhares de dados
          astronômicos em tempo real, identificando padrões e sinais que podem
          indicar a presença de novos exoplanetas. Combinando ciência,
          tecnologia e curiosidade humana, buscamos compreender melhor os mundos
          além do nosso e desvendar os segredos do cosmos.
        </p>
      </div>
    </div>
  );
};

export default ScienceEveryday;
