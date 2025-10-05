// src/components/Scene3D.jsx
"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import { Vector3 } from "three";
import Exoplanet from "./Exoplanet";

// ==================================================================
// ## COMPONENTE DE ANIMAÇÃO DA CÂMERA ##
// ==================================================================
function CameraAnimator({ earthPosition, targetPosition, duration = 3000 }) {
  const { camera } = useThree();
  const [isAnimating, setIsAnimating] = useState(true);
  const startTime = useRef(Date.now());

  // Iniciar na posição da Terra
  const initialPosition = useRef(
    new Vector3(earthPosition[0], earthPosition[1], earthPosition[2] + 2)
  );
  const finalPosition = useRef(new Vector3(...targetPosition));

  useFrame(() => {
    if (!isAnimating) return;

    const elapsed = Date.now() - startTime.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    // Interpolar posição da câmera
    camera.position.lerpVectors(
      initialPosition.current,
      finalPosition.current,
      easeOut
    );

    // Animar o FOV também (zoom out effect)
    const initialFOV = 20;
    const finalFOV = 60;
    camera.fov = initialFOV + (finalFOV - initialFOV) * easeOut;
    camera.updateProjectionMatrix();

    // Finalizar animação
    if (progress >= 1) {
      setIsAnimating(false);
      console.log("Camera animation completed");
    }
  });

  return null;
}

// ==================================================================
// ## 1. TERRA COM TAMANHO FIXO PARA COMPARAÇÃO ##
// ==================================================================
function StaticEarth({ position }) {
  const ref = useRef();
  const earthTexture = useTexture("/textures/earth.jpg");

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}
// ==================================================================

export default function Scene3D({ exoplanetData }) {
  const [animationKey, setAnimationKey] = useState(0);

  // CORRIGIDO: Calcular as posições PRIMEIRO, antes de usar no Canvas
  const exoRadius = exoplanetData?.radius || 1.0;
  const earthRadius = 2.0;
  const scaledExoRadius = earthRadius * exoRadius;

  // Calcular a distância entre planetas baseada nos tamanhos
  const maxPlanetRadius = Math.max(earthRadius, scaledExoRadius);
  const separation = Math.max(8, maxPlanetRadius * 2.5);

  // Posições dos planetas - DEFINIR ANTES DE USAR
  const earthPosition = [-separation / 2, 0, 0];
  const exoplanetPosition = [separation / 2, 0, 0];

  // Distância da câmera final
  const finalCameraDistance = Math.max(15, maxPlanetRadius * 4);
  const finalCameraPosition = [0, 0, finalCameraDistance];

  // Posição inicial da câmera (frente à Terra)
  const initialCameraPosition = [
    earthPosition[0],
    earthPosition[1],
    earthPosition[2] + 2,
  ];

  // Reiniciar animação quando dados do planeta mudarem
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
    console.log("Restarting camera animation for new planet data");
  }, [exoplanetData?.type, exoplanetData?.radius]);

  console.log("Rendering planets:", {
    earthRadius,
    exoRadius,
    scaledExoRadius,
    separation,
    finalCameraDistance,
    earthPosition,
    exoplanetPosition,
    initialCameraPosition,
  });

  return (
    <Canvas
      camera={{
        position: initialCameraPosition, // AGORA ESTÁ DEFINIDO
        fov: 20,
      }}
      shadows
    >
      {/* Componente que anima a câmera */}
      <CameraAnimator
        key={animationKey}
        earthPosition={earthPosition}
        targetPosition={finalCameraPosition}
        duration={3000}
      />

      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />

      {/* Luz adicional para melhor visibilidade */}
      <pointLight position={[0, 0, 10]} intensity={0.5} />

      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />

      <Suspense fallback={null}>
        {/* Terra sempre à esquerda com tamanho fixo */}
        <StaticEarth position={earthPosition} />

        {/* Exoplaneta à direita com tamanho baseado no raio real */}
        <Exoplanet position={exoplanetPosition} planetData={exoplanetData} />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.1}
        enableZoom={true}
        maxDistance={finalCameraDistance * 2}
        minDistance={Math.max(10, maxPlanetRadius * 1.5)}
        target={[0, 0, 0]}
        enablePan={true}
        enableRotate={true}
      />
    </Canvas>
  );
}
