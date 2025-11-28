import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Key3D({ char, position, active, onDown, onUp }) {
  const meshRef = useRef();
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    setIsPressed(active);
  }, [active]);

  useFrame((state, delta) => {
    const targetY = isPressed ? position[1] - 0.2 : position[1];
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        targetY,
        delta * 20
      );
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsPressed(true);
    if (onDown) onDown(char);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    setIsPressed(false);
    if (onUp) onUp();
  };

  const handlePointerOut = (e) => {
    if (isPressed) {
      setIsPressed(false);
      if (onUp) onUp();
    }
  };

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh
        ref={meshRef}
        position={[0, position[1], 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.4, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        
        {/* Key Ring */}
        <mesh position={[0, -0.1, 0]}>
           <cylinderGeometry args={[0.45, 0.45, 0.05, 32]} />
           <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>

        <Text
          position={[0, 0.11, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="#white"
          anchorX="center"
          anchorY="middle"
        >
          {char}
        </Text>
      </mesh>
    </group>
  );
}
