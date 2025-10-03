// src/components/Exoplanet.jsx
"use client";

import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function Exoplanet({ position, planetData }) {
  const surfaceRef = useRef();
  const cloudsRef = useRef();

  const { type, hasClouds, variation } = planetData;

  // ==================================================================
  // ## LÓGICA CORRIGIDA PARA O NOVO PADRÃO DE NOMES ##
  // ==================================================================
  
  // 1. Monta o nome do arquivo da superfície no novo padrão
  const surfaceFileName = `${type}_${variation}.png`;
  const surfacePath = `/textures/${type}/${surfaceFileName}`;

  // 2. Monta o nome do arquivo de nuvens (se aplicável) no novo padrão
  let cloudsPath;
  if (hasClouds) {
    const cloudsFileName = `${type}_${variation}_clouds.png`;
    cloudsPath = `/textures/${type}/${cloudsFileName}`;
  } else {
    // Se não tiver nuvens, aponta para uma imagem vazia/transparente
    cloudsPath = '/textures/empty.png'; 
  }
  // ==================================================================

  // Carrega as duas texturas. Se não houver nuvens, ele carregará a imagem vazia.
  // Certifique-se de ter um arquivo 'empty.png' (1x1 pixel transparente) em /public/textures/
  const [surfaceMap, cloudsMap] = useLoader(TextureLoader, [surfacePath, cloudsPath]);

  useFrame((state, delta) => {
    surfaceRef.current.rotation.y += delta * 0.1;
    if (hasClouds) {
      cloudsRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group position={position}>
      {/* Esfera da Superfície */}
      <mesh ref={surfaceRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={surfaceMap} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Esfera das Nuvens */}
      {hasClouds && (
        <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
          <sphereGeometry args={[2, 64, 64]} />
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