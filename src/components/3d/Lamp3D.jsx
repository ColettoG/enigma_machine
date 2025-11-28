import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function Lamp3D({ char, position, active }) {
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (materialRef.current) {
      const targetEmissive = active ? new THREE.Color('#ffdb4d') : new THREE.Color('#000000');
      const targetIntensity = active ? 2 : 0;
      
      materialRef.current.emissive.lerp(targetEmissive, delta * 10);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        delta * 10
      );
    }
  });

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {/* Glass/Lens */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial
          ref={materialRef}
          color="#333"
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      <Text
        position={[0, 0.4, 0]} // Float above slightly
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color={active ? "#000" : "#555"}
        anchorX="center"
        anchorY="middle"
      >
        {char}
      </Text>
      
      {active && (
        <pointLight position={[0, 0.5, 0]} distance={3} intensity={2} color="#ffdb4d" />
      )}
    </group>
  );
}
