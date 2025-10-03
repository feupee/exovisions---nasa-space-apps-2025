// src/components/Scene3D.jsx
"use client";

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import Exoplanet from './Exoplanet';

// ==================================================================
// ## 1. REINTRODUZINDO O COMPONENTE DA TERRA ##
// ==================================================================
function StaticEarth({ position }) {
  const ref = useRef();
  // Certifique-se que este arquivo existe: /public/textures/earth.jpg
  const earthTexture = useTexture('/textures/earth.jpg'); 
  useFrame((_, delta) => {
    if(ref.current) ref.current.rotation.y += delta * 0.1;
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}
// ==================================================================

export default function Scene3D({ exoplanetData }) {
  return (
    // 2. Câmera ajustada para enquadrar os dois planetas
    <Canvas camera={{ position: [0, 0, 12], fov: 60 }} shadows>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={3} castShadow />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      <Suspense fallback={null}>
        {/* 3. Renderizando os dois planetas lado a lado */}
        <StaticEarth position={[-3.5, 0, 0]} />
        <Exoplanet position={[3.5, 0, 0]} planetData={exoplanetData} />
      </Suspense>

      <OrbitControls autoRotate autoRotateSpeed={0.2} enableZoom={true} />
    </Canvas>
  );
}