import Image from "next/image";

const KnowMore = () => {
  return (
    <div className="w-full min-h-screen px-10">
      <div className="flex flex-row w-full mb-40">
        <div className="w-full flex items-center justify-center relative">
          <Image
            src="/exoplanet_laranja.svg"
            alt="Background glow"
            width={900}
            height={250}
            className="absolute blur-3xl opacity-50 z-0"
            style={{ transform: "translate(12px, -60px)" }}
          />
          <Image
            src="/exoplanet_laranja.svg"
            alt="Description of image"
            width={820}
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
            Nosso projeto apresenta uma plataforma baseada em inteligência
            artificial voltada para apoiar a detecção de exoplanetas. Partindo
            do zero, desenvolvemos um sistema que integra dados públicos das
            missões Kepler, K2 e TESS da NASA. Essas missões fornecem séries
            temporais fotométricas, conhecidas como curvas de luz, que registram
            pequenas variações no brilho de estrelas. Essas variações podem
            indicar o trânsito de um planeta, mas muitas vezes estão escondidas
            em ruído ou são confundidas com falsos positivos, seja por efeitos
            instrumentais ou fenômenos astrofísicos.
          </p>
          <p className="text-white text-center max-w-3xl mb-8 px-4">
            Para lidar com esse desafio, nosso pipeline de IA processa
            automaticamente milhares de curvas de luz, extraindo características
            relevantes dos trânsitos e convertendo-as em uma pontuação de
            probabilidade interpretável. Essa pontuação indica a chance de um
            sinal corresponder a um exoplaneta real em vez de uma detecção
            espúria. Em seguida, os resultados são exibidos em tempo real em um
            painel interativo, de forma acessível, clara e visual.
          </p>
          <p className="text-white text-center max-w-3xl mb-8 px-4">
            Nosso objetivo não é substituir a validação astrofísica tradicional,
            mas oferecer uma ferramenta ágil e confiável de triagem. Ao ranquear
            os candidatos de acordo com sua probabilidade de serem exoplanetas
            verdadeiros, o sistema funciona como um guia, permitindo que
            pesquisadores concentrem seus esforços nos sinais mais promissores.
            Essa combinação entre dados de missões espaciais abertas e análise
            baseada em IA demonstra o potencial do aprendizado de máquina para
            acelerar descobertas científicas em astronomia
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
            Somos estudantes da Universidade Federal de Uberlândia (UFU)
            apaixonados por Machine Learning, Webdevelopment e Design, e
            enxergamos esse desafio da NASA como uma forma de aprender mais
            sobre os assuntos que temos estudado, colocando em prática diversos
            conceitos vistos tanto na Universidade quanto em pesquisas.
          </p>
          <p className="text-white text-center max-w-3xl mt-4 mb-8 px-4">
            Estamos comprometidos em explorar novas soluções e
            contribuir para a comunidade científica. Tal como a solução desse projeto foi um trabalho em conjunto bem estruturado entre todas as partes, possibilitando assim o melhor uso de nossas habilidades. Esperamos que com esse projeto possamos auxiliar pessoas a chegar onde estamos e alcancar novos patamares na exploração espacial.
          </p>
        </div>
        <div className="w-full flex items-center justify-center relative">
          <Image
            src="/exoplanet_vermelho.svg"
            alt="Background glow"
            width={500}
            height={250}
            className="absolute blur-3xl opacity-50 z-0"
            style={{ transform: "translate(16px, -24px)" }}
          />
          <Image
            src="/exoplanet_vermelho.svg"
            alt="Description of image"
            width={500}
            height={200}
            className="relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default KnowMore;
