"use client"

// src/_components/Comparacao_Planetas/Comparacao_Planetas.jsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Componente da Terra
function Earth() {
  const meshRef = useRef();

  useFrame((delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[-3, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#4169E1"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Terra
      </Text>
    </group>
  );
}

// Componente do Exoplaneta
function Exoplanet({ exoplanetData, planetTexture }) {
  const meshRef = useRef();
  const textureRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  // Determinar cor/material baseado nos dados
  const getPlanetMaterial = () => {
    const temp = exoplanetData?.pl_eqt || 288;
    const radius = exoplanetData?.pl_rade || 1;

    // Se temos textura personalizada, usar ela
    if (planetTexture) {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(planetTexture);
      return (
        <meshStandardMaterial 
          map={texture}
          roughness={0.8}
          metalness={0.2}
        />
      );
    }

    // Caso contrário, usar cores baseadas na temperatura
    let color = "#888888"; // Padrão cinza
    
    if (temp < 200) {
      color = "#E0F6FF"; // Azul claro para planetas gelados
    } else if (temp > 400) {
      color = "#FF4500"; // Laranja para planetas quentes
    } else if (temp > 273 && temp < 373) {
      color = "#228B22"; // Verde para zona habitável
    } else if (radius < 0.5) {
      color = "#8B4513"; // Marrom para planetas rochosos pequenos
    }

    return (
      <meshStandardMaterial 
        color={color}
        roughness={0.7}
        metalness={0.1}
      />
    );
  };

  // Determinar tamanho baseado no raio
  const getSize = () => {
    if (!exoplanetData?.pl_rade) return 1;
    
    // Normalizar o tamanho (Terra = 1, então usar o raio relativo)
    // Mas limitar para não ficar muito grande ou pequeno na visualização
    let size = Math.abs(exoplanetData.pl_rade);
    
    // Se o valor é normalizado (geralmente entre -3 e 3), converter para escala visual
    if (size < 5) {
      size = Math.max(0.3, Math.min(2.5, 1 + (size * 0.3)));
    } else {
      // Se é um valor real, usar diretamente mas limitar
      size = Math.max(0.3, Math.min(2.5, size));
    }
    
    return size;
  };

  const planetSize = getSize();

  return (
    <group position={[3, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[planetSize, 32, 32]} />
        {getPlanetMaterial()}
      </mesh>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Exoplaneta
      </Text>
    </group>
  );
}

// Componente principal
const Comparacao_Planetas = ({ exoplanetData, planetTexture }) => {
  console.log('Dados recebidos no componente 3D:', { exoplanetData, planetTexture });

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        {/* Iluminação */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Planetas */}
        <Earth />
        <Exoplanet 
          exoplanetData={exoplanetData} 
          planetTexture={planetTexture} 
        />

        {/* Controles de câmera */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
        />

        {/* Título */}
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Comparação de Tamanhos
        </Text>

        {/* Grid de referência */}
        <gridHelper args={[10, 10, 0x444444, 0x444444]} position={[0, -3, 0]} />
      </Canvas>
    </div>
  );
};

export default Comparacao_Planetas;