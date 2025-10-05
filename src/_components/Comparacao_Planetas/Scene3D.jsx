"use client";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import Exoplanet from "./Exoplanet";

function StaticEarth({ position }) {
  const ref = useRef();
  const earthTexture = useTexture("/textures/earth.jpg");
  useFrame((_, delta) => (ref.current.rotation.y += delta * 0.1));
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

export default function Scene3D({ exoplanetData }) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />{" "}
        <hemisphereLight intensity={0.3} groundColor="blue" />{" "}
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <Suspense fallback={null}>
          <StaticEarth position={[-3.5, 0, 0]} />
          <Exoplanet position={[3.5, 0, 0]} planetData={exoplanetData} />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={true} />
      </Canvas>
    </div>
  );
}
