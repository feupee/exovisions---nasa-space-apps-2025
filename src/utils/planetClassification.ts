export interface PlanetProfile {
  type: string;
  variation: number;
  hasClouds: boolean;
  description: string;
  characteristics: string[];
}

export function classifyPlanet(data: any): PlanetProfile {
  const {
    pl_orbper, // Período orbital (dias) - determina distância à estrela
    pl_rade, // Raio planetário (raios terrestres) - usado apenas para escala visual
    pl_insol, // Insolação (fluxo estelar recebido em unidades terrestres)
    pl_eqt, // Temperatura de equilíbrio (Kelvin) - FATOR PRINCIPAL
    st_teff, // Temperatura estelar (Kelvin)
  } = data;

  // VARIÁVEIS PRINCIPAIS PARA CLASSIFICAÇÃO
  const temperature = pl_eqt ? Math.abs(pl_eqt) : 288; // Kelvin - ESSENCIAL
  const insolation = pl_insol ? Math.abs(pl_insol) : 1.0; // Múltiplos da Terra - ESSENCIAL
  const period = Math.abs(pl_orbper) || 365; // Período orbital - SECUNDÁRIO
  const radius = Math.abs(pl_rade) || 1.0; // Raio - APENAS PARA VISUALIZAÇÃO
  const stellarTemp = st_teff ? Math.abs(st_teff) : 5778; // Temperatura da estrela

  let planetType: string;
  let characteristics: string[] = [];
  let hasClouds = false;

  // ===================================================================
  // ## CLASSIFICAÇÃO BASEADA EM TEMPERATURA E INSOLAÇÃO ##
  // ===================================================================

  // 1. ZONA INFERNAL (T > 800K) - Muito próximo da estrela
  if (temperature > 800) {
    if (temperature > 1500) {
      planetType = "Volcanic";
      characteristics = [
        "Superfície derretida em lava",
        "Atividade vulcânica extrema",
        "Atmosfera de vapor de rocha",
      ];
      hasClouds = false;
    } else {
      planetType = "Venusian";
      characteristics = [
        "Efeito estufa descontrolado",
        "Atmosfera densa de CO₂",
        "Superfície rochosa superaquecida",
      ];
      hasClouds = false; // Nuvens de ácido sulfúrico
    }
  }

  // 2. ZONA QUENTE (400K < T ≤ 800K) - Interior do sistema
  else if (temperature > 400 && temperature <= 800) {
    if (insolation > 4.0) {
      planetType = "Dry";
      characteristics = [
        "Desertos extremos",
        "Pouca ou nenhuma água superficial",
        "Atmosfera árida e rarefeita",
      ];
      hasClouds = false;
    } else {
      planetType = "Martian";
      characteristics = [
        "Atmosfera fina e seca",
        "Superfície desértica avermelhada",
        "Vapor d'água residual nos pólos",
      ];
      hasClouds = false;
    }
  }

  // 3. ZONA HABITÁVEL (250K ≤ T ≤ 400K) - Água líquida possível
  else if (temperature >= 250 && temperature <= 400) {
    hasClouds = true; // Vapor d'água pode formar nuvens

    // Subzonas dentro da zona habitável baseadas em insolação
    if (insolation >= 1.8) {
      // Borda interna quente
      if (temperature >= 350) {
        planetType = "Tropical";
        characteristics = [
          "Clima tropical permanente",
          "Oceanos quentes e evaporação intensa",
          "Florestas densas e húmidas",
        ];
      } else {
        planetType = "Savannah";
        characteristics = [
          "Estações secas e úmidas marcantes",
          "Pradarias e gramíneas extensas",
          "Rios sazonais",
        ];
      }
    } else if (insolation >= 1.2 && insolation < 1.8) {
      // Zona quente-temperada
      if (temperature >= 320) {
        planetType = "Swamp";
        characteristics = [
          "Pântanos extensos e permanentes",
          "Alta umidade atmosférica",
          "Vegetação aquática abundante",
        ];
      } else {
        planetType = "Wetlands";
        characteristics = [
          "Regiões pantanosas e lagos",
          "Biodiversidade aquática elevada",
          "Clima úmido e estável",
        ];
      }
    } else if (insolation >= 0.8 && insolation < 1.2) {
      // Zona habitável ideal (como a Terra)
      if (temperature >= 300) {
        planetType = "Terrestrial";
        characteristics = [
          "Oceanos e continentes equilibrados",
          "Ciclo hidrológico ativo",
          "Atmosfera estável com oxigênio potencial",
        ];
      } else {
        planetType = "Oceanic";
        characteristics = [
          "Oceanos globais profundos",
          "Poucas ou nenhuma massa terrestre",
          "Circulação oceânica intensa",
        ];
      }
    } else if (insolation >= 0.5 && insolation < 0.8) {
      // Zona temperada-fria
      planetType = "Alpine";
      characteristics = [
        "Climas montanhosos predominantes",
        "Geleiras e neve permanente",
        "Vales temperados com lagos",
      ];
      hasClouds = false;
    } else {
      // Borda externa da zona habitável
      planetType = "Tundra";
      characteristics = [
        "Clima subártico e frio",
        "Permafrost em grande parte da superfície",
        "Verões curtos e invernos longos",
      ];
    }
  }

  // 4. ZONA FRIA (150K ≤ T < 250K) - Exterior do sistema
  else if (temperature >= 150 && temperature < 250) {
    if (insolation > 0.3) {
      planetType = "Tundra";
      characteristics = [
        "Gelo superficial permanente",
        "Atmosfera fina e fria",
        "Possíveis oceanos subterrâneos",
      ];
      hasClouds = false; 
    } else {
      planetType = "Ice";
      characteristics = [
        "Superfície completamente congelada",
        "Océanos de gelo sólido",
        "Atmosfera muito rarefeita",
      ];
      hasClouds = false;
    }
  }

  // 5. ZONA GELADA (T < 150K) - Extremo exterior
  else {
    planetType = "Ice";
    characteristics = [
      "Mundo congelado permanentemente",
      "Superfície de gelo e rocha",
      "Sem atividade atmosférica",
    ];
    hasClouds = false;
  }

  // ===================================================================
  // ## CASOS ESPECIAIS BASEADOS EM PERÍODO ORBITAL ##
  // ===================================================================

  // Planetas com período muito curto (< 1 dia) - Muito próximos da estrela
  if (period < 1) {
    planetType = "Volcanic";
    characteristics = [
      "Órbita extremamente próxima",
      "Forças de maré extremas",
      "Superfície bombardeada por radiação estelar",
    ];
    hasClouds = false;
  }

  // Planetas com período muito longo (> 1000 dias) - Muito distantes
  else if (period > 1000) {
    planetType = "Ice";
    characteristics = [
      "Órbita muito distante da estrela",
      "Recebe pouca radiação solar",
      "Temperatura próxima ao zero absoluto",
    ];
    hasClouds = false;
  }

  // ===================================================================
  // ## AJUSTES BASEADOS NA TEMPERATURA ESTELAR ##
  // ===================================================================

  // Estrelas muito quentes (> 7000K) - Radiação intensa
  if (stellarTemp > 7000 && temperature > 600) {
    planetType = "Venusian";
    characteristics = [
      "Radiação estelar intensa",
      "Efeito estufa amplificado",
      "Atmosfera ionizada",
    ];
    hasClouds = false;
  }

  // Estrelas frias (< 4000K) - Anãs vermelhas
  else if (stellarTemp < 4000) {
    if (temperature >= 250 && temperature <= 350) {
      // Zona habitável de anã vermelha
      planetType = "Primordial";
      characteristics = [
        "Radiação estelar em infravermelho",
        "Possível travamento gravitacional",
        "Atmosfera em evolução",
      ];
      hasClouds = false;
    }
  }

  // ===================================================================
  // ## VARIAÇÃO VISUAL E DESCRIÇÕES ##
  // ===================================================================

  // Determinar variação baseada no período orbital
  const variation = Math.floor(Math.abs(period) % 4) + 1;

  const descriptions: { [key: string]: string } = {
    Volcanic:
      "Um mundo infernal com superfície derretida e atividade vulcânica constante.",
    Venusian:
      "Um planeta com efeito estufa descontrolado e atmosfera corrosiva.",
    Dry: "Um mundo árido com vastos desertos e extrema escassez de água.",
    Martian: "Um planeta desértico com atmosfera fina, similar a Marte.",
    Tropical:
      "Um mundo quente e úmido com oceanos extensos e florestas tropicais.",
    Savannah:
      "Planícies douradas com estações marcantes e gramíneas adaptadas.",
    Swamp: "Pântanos densos e permanentes com vegetação aquática exuberante.",
    Wetlands: "Regiões pantanosas ricas em biodiversidade e umidade constante.",
    Terrestrial:
      "Um planeta similar à Terra com oceanos, continentes e atmosfera estável.",
    Oceanic: "Um mundo aquático com oceanos globais e poucas terras emersas.",
    Alpine: "Um mundo montanhoso com geleiras, neve e vales temperados.",
    Tundra: "Vastas planícies frias com permafrost e clima subártico.",
    Ice: "Um mundo completamente congelado com superfície de gelo permanente.",
    Primordial:
      "Um mundo jovem em evolução atmosférica ao redor de uma estrela fria.",
    // Mantidos para compatibilidade
    Gas_Giant: "Um gigante gasoso - classificação baseada apenas no raio.",
    Rock: "Um planeta rochoso pequeno sem atmosfera significativa.",
    Oasis: "Oásis esparsos em vastos desertos com água preciosa.",
    Fungal: "Ecossistemas únicos dominados por fungos e esporos.",
  };

  return {
    type: planetType,
    variation,
    hasClouds,
    description:
      descriptions[planetType] || "Um mundo misterioso aguardando exploração.",
    characteristics,
  };
}

// ===================================================================
// ## FUNÇÕES AUXILIARES (INALTERADAS) ##
// ===================================================================

export function getTextureFolder(planetType: string): string {
  const folderMapping: { [key: string]: string } = {
    Gas_Giant: "Gas_Giant",
    Volcanic: "Volcanic",
    Venusian: "Venusian",
    Dry: "Dry",
    Ice: "Ice",
    Tundra: "Tundra",
    Rock: "Rock",
    Tropical: "Tropical",
    Alpine: "Alpine",
    Terrestrial: "Terrestrial",
    Oceanic: "Oceanic",
    Savannah: "Savannah",
    Wetlands: "Wetlands",
    Primordial: "Primordial",
    Martian: "Martian",
    Swamp: "Swamp",
    Oasis: "Oasis",
    Fungal: "Fungal",
  };

  return folderMapping[planetType] || "Rock";
}

export function getTextureFileName(
  planetType: string,
  variation: number,
  hasClouds: boolean
): string {
  if (planetType === "Gas_Giant") {
    return `Gas_${variation}.png`;
  }

  const typesWithClouds = [
    "Oceanic",
    "Savannah",
    "Swamp",
    "Terrestrial",
    "Tropical",
    "Tundra",
    "Wetlands",
    "Alpine",
    "Venusian",
    "Fungal",
  ];

  if (hasClouds && typesWithClouds.includes(planetType)) {
    return `${planetType}_${variation}_clouds.png`;
  }

  return `${planetType}_${variation}.png`;
}

export function getTexturePath(
  planetType: string,
  variation: number,
  hasClouds: boolean
): string {
  const folderName = getTextureFolder(planetType);
  const fileName = getTextureFileName(planetType, variation, hasClouds);

  return `/textures/${folderName}/${fileName}`;
}
