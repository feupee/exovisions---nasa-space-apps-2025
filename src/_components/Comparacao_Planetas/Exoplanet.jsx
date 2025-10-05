// src/components/Exoplanet.jsx
"use client";

import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTexturePath } from "@/utils/planetClassification";

export default function Exoplanet({ position, planetData }) {
  const surfaceRef = useRef();
  const cloudsRef = useRef();

  const { type, hasClouds, variation, radius = 1.0 } = planetData;

  // Calcular o raio baseado nos dados do planeta
  const baseRadius = 2.0; // Terra = 2.0 unidades
  const scaledRadius = baseRadius * radius; // Usar o raio do planetData!
  const cloudsRadius = scaledRadius * 1.02; // Nuvens ligeiramente maiores

  console.log("Exoplanet radius data:", {
    originalRadius: radius,
    scaledRadius,
    cloudsRadius,
  });

  // ==================================================================
  // ## USANDO AS FUNÇÕES AUXILIARES CORRETAS ##
  // ==================================================================

  // 1. Usa a função auxiliar para gerar o caminho da superfície
  const surfacePath = getTexturePath(type, variation, false);

  // 2. Usa a função auxiliar para gerar o caminho das nuvens
  let cloudsPath;
  if (hasClouds) {
    cloudsPath = getTexturePath(type, variation, true);
  } else {
    cloudsPath = "/textures/empty.png";
  }

  console.log("Texture paths:", { surfacePath, cloudsPath });
  // ==================================================================

  // Carrega as duas texturas
  const [surfaceMap, cloudsMap] = useLoader(TextureLoader, [
    surfacePath,
    cloudsPath,
  ]);

  useFrame((state, delta) => {
    if (surfaceRef.current) {
      surfaceRef.current.rotation.y += delta * 0.1;
    }
    if (hasClouds && cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Esfera da Superfície - AGORA USA O RAIO CALCULADO */}
      <mesh ref={surfaceRef} castShadow receiveShadow>
        <sphereGeometry args={[scaledRadius, 64, 64]} />
        <meshStandardMaterial
          map={surfaceMap}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Esfera das Nuvens - TAMBÉM USA O RAIO CALCULADO */}
      {hasClouds && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[cloudsRadius, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent={true}
            opacity={0.8}
            alphaMap={cloudsMap}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}
