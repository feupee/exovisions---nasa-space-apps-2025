// ------------------ Types ------------------

export interface PlanetProfile {
  type: string;
  variation: number;
  hasClouds: boolean;
  description: string;
  characteristics: string[];
}

export interface ExoplanetData {
  // Campos obrigatórios - esperados do formulário
  pl_orbper: number; // Período orbital (dias ou normalizado)
  pl_trandurh: number; // Duração do trânsito (horas)
  pl_trandep: number; // Profundidade do trânsito (ppm)
  pl_rade: number; // Raio planetário (R⊕ ou normalizado)
  pl_insol: number; // Insolação (S⊕ ou normalizado)
  pl_eqt: number; // Temperatura de equilíbrio (K ou normalizado)

  // Opcionais
  st_teff?: number | null; // Temperatura estelar (K)
  st_logg?: number | null; // Gravidade superficial (log g)

  [key: string]: unknown;
}

// ------------------ Utilidades ------------------

/** Sanitiza um número (ou undefined/null/NaN) e aplica limites. */
function num(
  v: unknown,
  fallback: number,
  opts?: { min?: number; max?: number; abs?: boolean }
): number {
  let x = typeof v === "number" && Number.isFinite(v) ? v : fallback;
  if (opts?.abs) x = Math.abs(x);
  if (opts?.min !== undefined) x = Math.max(opts.min, x);
  if (opts?.max !== undefined) x = Math.min(opts.max, x);
  return x;
}

/** Heurística para detectar se os inputs parecem normalizados (ex.: -1..+1, 0..1). */
function looksNormalized(d: ExoplanetData): boolean {
  const a = Math.abs(d.pl_eqt ?? 0);
  const b = Math.abs(d.pl_insol ?? 0);
  const c = Math.abs(d.pl_rade ?? 0);
  const p = Math.abs(d.pl_orbper ?? 0);

  // Casos típicos de normalização que vimos: |valor| << 10, alguns até negativos
  // e período pequeno (p.ex. 0..5).
  const smallScales = a <= 10 && b <= 10 && c <= 10 && p <= 10;

  // Se qualquer um deles é negativo (o que não faz sentido físico em K, S⊕, R⊕),
  // é outro indício de normalização centrada (z-score / min-max com shift).
  const anyNegative =
    (d.pl_eqt ?? 0) < 0 ||
    (d.pl_insol ?? 0) < 0 ||
    (d.pl_rade ?? 0) < 0 ||
    (d.pl_orbper ?? 0) < 0;

  return smallScales || anyNegative;
}

/** Converte valores normalizados para faixas físicas realistas. */
function denormalizeIfNeeded(d: ExoplanetData): ExoplanetData {
  if (!looksNormalized(d)) return d;

  // Mapas simples e robustos (clampados); ajuste se quiser cenários mais agressivos.
  const pl_eqt_K = (d.pl_eqt ?? 0) * 500 + 288; // ~ 288 ± 500 K → [~ -212, ~ 788], depois clamp
  const pl_insol_S = Math.abs(d.pl_insol ?? 1) * 2; // 0..2 S⊕
  const pl_rade_Re = Math.abs(d.pl_rade ?? 1) * 1.5; // 0..1.5 R⊕
  const pl_orbper_d = Math.abs(d.pl_orbper ?? 1) * 365; // 0..365 dias

  return {
    ...d,
    pl_eqt: num(pl_eqt_K, 288, { min: 50, max: 2000 }), // clamp físico razoável
    pl_insol: num(pl_insol_S, 1.0, { min: 0.02, max: 32 }),
    pl_rade: num(pl_rade_Re, 1.0, { min: 0.1, max: 6 }),
    pl_orbper: num(pl_orbper_d, 365, { min: 0.01, max: 1e6 }),
  };
}

/**
 * Estima a temperatura média da superfície (K) a partir da temperatura de equilíbrio (K),
 * via heurística de efeito-estufa:
 *  - Ganho base ~ 33 K (Terra), escalado por retenção atmosférica (raio) e insolação.
 *  - Clamp para estabilidade visual.
 */
function estimateSurfaceTempK(
  T_eq: number,
  radiusRE: number | null | undefined,
  insolationTE: number | null | undefined
): number {
  const T_eq_safe = num(T_eq, 288, { abs: true });
  const r = num(radiusRE, 1.0, { abs: true, min: 0.1, max: 6.0 });
  const s = num(insolationTE, 1.0, { abs: true, min: 0.02, max: 32.0 });

  // Retenção atmosférica aproximada por raio (rochoso/super-Terra)
  let f_atm = 0.2;
  if (r < 0.5) f_atm = 0.2;
  else if (r < 1.0) f_atm = 0.7;
  else if (r < 1.8) f_atm = 1.0;
  else if (r < 2.5) f_atm = 1.2;
  else f_atm = 1.5;

  // Feedback com insolação ~ s^(1/4)
  const f_insol = Math.min(2.0, Math.max(0.5, Math.pow(s, 0.25)));

  const greenhouseDelta = 33 * f_atm * f_insol;
  const deltaClamped = Math.min(120, Math.max(0, greenhouseDelta));

  return T_eq_safe + deltaClamped;
}

// ------------------ Classificação ------------------

export function classifyPlanet(rawData: ExoplanetData): PlanetProfile {
  // 1) Se vier normalizado, converte; caso contrário, usa como está
  const data = denormalizeIfNeeded(rawData);

  // 2) Valores físicos + defaults
  const temperatureEq = num(data.pl_eqt, 288, { abs: true }); // K
  const insolation = num(data.pl_insol, 1.0, { abs: true, min: 0.02, max: 32 }); // S⊕
  const period = num(data.pl_orbper, 365, { abs: true, min: 0.01, max: 1e6 }); // dias
  const radius = num(data.pl_rade, 1.0, { abs: true, min: 0.1, max: 6.0 }); // R⊕
  const stellarTemp = num(data.st_teff ?? null, 5778, {
    abs: true,
    min: 2400,
    max: 20000,
  }); // K

  // 3) Temperatura de superfície estimada
  const surfaceTemp = estimateSurfaceTempK(temperatureEq, radius, insolation);

  let planetType = "Rock";
  let characteristics: string[] = [];
  let hasClouds = false;

  // ------------- Regiões por temperatura de superfície -------------
  if (surfaceTemp > 1500) {
    planetType = "Volcanic";
    characteristics = [
      "Superfície parcialmente derretida",
      "Atividade vulcânica extrema",
      "Atmosfera de vapor mineral",
    ];
    hasClouds = false;
  } else if (surfaceTemp > 800) {
    planetType = "Venusian";
    characteristics = [
      "Efeito estufa descontrolado",
      "Atmosfera densa e corrosiva",
      "Pressão e temperatura muito elevadas",
    ];
    hasClouds = false;
  } else if (surfaceTemp > 400) {
    if (insolation > 4.0) {
      planetType = "Dry";
      characteristics = [
        "Desertos extremos",
        "Água superficial escassa",
        "Atmosfera árida",
      ];
      hasClouds = false;
    } else {
      planetType = "Martian";
      characteristics = [
        "Atmosfera fina e seca",
        "Superfície desértica",
        "Gelo sazonal nos polos",
      ];
      hasClouds = false;
    }
  } else if (surfaceTemp >= 250) {
    // Zona habitável ampliada
    hasClouds = true;

    if (insolation >= 1.8) {
      if (surfaceTemp >= 350) {
        planetType = "Tropical";
        characteristics = [
          "Oceanos quentes",
          "Evaporação intensa",
          "Florestas úmidas",
        ];
      } else {
        planetType = "Savannah";
        characteristics = [
          "Estações secas/úmidas",
          "Gramíneas extensas",
          "Rios sazonais",
        ];
      }
    } else if (insolation >= 1.2) {
      if (surfaceTemp >= 320) {
        planetType = "Swamp";
        characteristics = [
          "Pântanos extensos",
          "Alta umidade",
          "Vegetação aquática",
        ];
      } else {
        planetType = "Wetlands";
        characteristics = [
          "Lagos e brejos",
          "Biodiversidade aquática",
          "Clima úmido",
        ];
      }
    } else if (insolation >= 0.8) {
      if (surfaceTemp >= 300) {
        planetType = "Terrestrial";
        characteristics = [
          "Oceanos e continentes",
          "Ciclo hidrológico ativo",
          "Clima estável",
        ];
      } else {
        planetType = "Oceanic";
        characteristics = [
          "Oceanos globais",
          "Pouca terra emersa",
          "Correntes intensas",
        ];
      }
    } else if (insolation >= 0.5) {
      planetType = "Alpine";
      characteristics = ["Regiões montanhosas", "Geleiras", "Vales frios"];
      hasClouds = false;
    } else {
      planetType = "Tundra";
      characteristics = ["Permafrost", "Verões curtos", "Vegetação baixa"];
    }
  } else if (surfaceTemp >= 150) {
    if (insolation > 0.3) {
      planetType = "Tundra";
      characteristics = [
        "Gelo superficial",
        "Atmosfera fria e fina",
        "Água líquida rara",
      ];
      hasClouds = false;
    } else {
      planetType = "Ice";
      characteristics = [
        "Superfície congelada",
        "Atividade atmosférica mínima",
        "Gelo permanente",
      ];
      hasClouds = false;
    }
  } else {
    planetType = "Ice";
    characteristics = [
      "Mundo congelado",
      "Gelo e rocha",
      "Sem atividade atmosférica",
    ];
    hasClouds = false;
  }

  // ------------- Guard-rails por período (suaves) -------------
  if (period < 0.5 && surfaceTemp > 700) {
    planetType = "Volcanic";
    hasClouds = false;
  } else if (period > 5000 && surfaceTemp < 260) {
    planetType = "Ice";
    hasClouds = false;
  }

  // ------------- Ajustes por tipo de estrela (leves) -------------
  if (stellarTemp > 7000 && surfaceTemp > 600) {
    planetType = "Venusian";
    hasClouds = false;
  } else if (stellarTemp < 4000 && surfaceTemp >= 250 && surfaceTemp <= 350) {
    planetType = "Primordial";
    hasClouds = false;
    characteristics = [
      "Radiação predominante em infravermelho",
      "Possível travamento de maré",
      "Atmosfera em evolução",
    ];
  }

  // Variação visual estável baseada no período
  const variation = Math.floor(period % 4) + 1;

  const descriptions: Record<string, string> = {
    Volcanic:
      "Um mundo infernal com mares de lava e atividade geológica intensa.",
    Venusian:
      "Efeito estufa descontrolado sob uma atmosfera densa e corrosiva.",
    Dry: "Planeta árido com vastos desertos e pouca água superficial.",
    Martian: "Desértico e frio, com atmosfera fina e poeira abundante.",
    Tropical: "Quente e úmido, com florestas densas e oceanos quentes.",
    Savannah: "Planícies extensas com estações marcadas e rios sazonais.",
    Swamp: "Pântanos permanentes com alta umidade e vegetação aquática.",
    Wetlands: "Regiões alagadiças, lagos e clima persistentemente úmido.",
    Terrestrial: "Similar à Terra, com oceanos, continentes e clima estável.",
    Oceanic: "Coberto por oceanos profundos com pouca terra emersa.",
    Alpine: "Montanhoso e frio, com geleiras e neve frequente.",
    Tundra: "Frio subártico com permafrost e verões curtos.",
    Ice: "Mundo permanentemente congelado de gelo e rocha.",
    Primordial: "Mundo jovem em torno de estrela fria, atmosfera em evolução.",
    Gas_Giant: "Gigante gasoso.",
    Rock: "Pequeno e rochoso, atmosfera mínima.",
    Oasis: "Desertos com raros oásis de água.",
    Fungal: "Ecossistemas dominados por fungos e esporos.",
  };

  return {
    type: planetType,
    variation,
    hasClouds,
    description:
      descriptions[planetType] ?? "Um mundo misterioso aguardando exploração.",
    characteristics,
  };
}

// ------------------ Texturas ------------------

export function getTextureFolder(planetType: string): string {
  const folderMapping: Record<string, string> = {
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
  if (planetType === "Gas_Giant") return `Gas_${variation}.png`;

  const typesWithClouds = new Set([
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
  ]);

  if (hasClouds && typesWithClouds.has(planetType)) {
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
