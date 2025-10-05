"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";

export default function Exoplanet({ position, planetData }) {
  const surfaceRef = useRef();
  const [textureUrl, setTextureUrl] = useState(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [surfaceMap, setSurfaceMap] = useState(null);

  // 1️⃣ Gera a textura via backend e cria um URL temporário
  useEffect(() => {
    async function fetchTexture() {
      try {
        const res = await fetch("http://localhost:5000/generate_texture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(planetData),
        });
        const data = await res.json();

        // Converte base64 para Blob (imagem real)
        const byteCharacters = atob(data.texture);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });
        const blobUrl = URL.createObjectURL(blob);

        setTextureUrl(blobUrl);
      } catch (error) {
        console.error("Erro ao gerar textura:", error);
      }
    }

    fetchTexture();
  }, [planetData]);

  // 2️⃣ Quando o URL da textura estiver pronto, carrega com TextureLoader
  useEffect(() => {
    if (!textureUrl) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      textureUrl,
      (texture) => {
        setSurfaceMap(texture);
        setTextureLoaded(true);
      },
      undefined,
      (err) => console.error("Erro ao carregar textura:", err)
    );
  }, [textureUrl]);

  // 3️⃣ Gira o planeta
  useFrame((_, delta) => {
    if (surfaceRef.current && textureLoaded) {
      surfaceRef.current.rotation.y += delta * 0.1;
    }
  });

  // 4️⃣ Renderiza só quando tiver textura
  if (!textureLoaded) return null;

  return (
    <group position={position}>
      <mesh ref={surfaceRef} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={surfaceMap}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
