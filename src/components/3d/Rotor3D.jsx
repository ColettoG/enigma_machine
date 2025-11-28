import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Rotor3D({ 
  position, 
  type, 
  rotorPosition, 
  ringSetting, 
  onChangePos 
}) {
  const groupRef = useRef();
  const targetRotation = useRef(0);

  // Calculate target rotation based on rotor position
  // 26 positions = 360 degrees (2 * PI)
  // Each step is 2 * PI / 26
  // We subtract ringSetting from the visual display logic if needed, 
  // but usually the ring setting offsets the internal wiring, not necessarily the letter ring relative to the core 
  // unless we are modeling the ring separately. 
  // For simplicity, let's assume the visual letter at the window is determined by `rotorPosition`.
  // If `rotorPosition` is 0 ('A'), rotation is 0.
  // If `rotorPosition` is 1 ('B'), rotation is -step (to bring B to top).
  
  const step = (2 * Math.PI) / 26;
  
  // Smooth rotation
  useFrame((state, delta) => {
    const target = -rotorPosition * step;
    // Simple lerp for smoothness
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        target,
        delta * 10
      );
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    // Determine if clicked top or bottom half to rotate up or down
    // For now, just rotate up (next letter)
    onChangePos(1);
  };

  return (
    <group position={position}>
      {/* Rotor Housing/Ring */}
      <group ref={groupRef} onClick={handleClick}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 1, 32]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Letters */}
        {ALPHABET.map((char, i) => {
          const angle = i * step;
          return (
            <group 
              key={char} 
              rotation={[angle, 0, 0]} 
            >
              <Text
                position={[0, 1.6, 0]} // Slightly outside the cylinder
                rotation={[-Math.PI / 2, Math.PI, 0]} // Face outward
                fontSize={0.5}
                color="#d4b483"
                anchorX="center"
                anchorY="middle"
              >
                {char}
              </Text>
            </group>
          );
        })}
        
        {/* Notch/Detail */}
        <mesh position={[0, 0, 0.55]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Static Label for Rotor Type */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        {type}
      </Text>
    </group>
  );
}
