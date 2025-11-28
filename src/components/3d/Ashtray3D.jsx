import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function SmokeParticle({ position }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (!mesh.current) return;
    // Simple rise and fade animation
    mesh.current.position.y += 0.005;
    mesh.current.position.x += Math.sin(state.clock.elapsedTime + position[1] * 10) * 0.002;
    // Reset if too high
    if (mesh.current.position.y > 1.5) {
      mesh.current.position.y = 0;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color="#aaaaaa" 
        transparent 
        opacity={0.3} 
        depthWrite={false}
      />
    </mesh>
  );
}

export default function Ashtray3D({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Ashtray Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#3e2723" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Ashtray Inner (Hollow part simulation) */}
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Cigar */}
      <group position={[0, 0.25, 0]} rotation={[0, 0, 0.1]}>
        <mesh castShadow position={[0.4, 0, 0]} rotation={[0, 0, 1.57]}>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        {/* Cigar Ash/Tip */}
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, 1.57]}>
            <cylinderGeometry args={[0.08, 0.07, 0.1, 16]} />
            <meshStandardMaterial color="#9e9e9e" />
        </mesh>
        {/* Burning Embers */}
        <mesh position={[1.0, 0, 0]} rotation={[0, 0, 1.57]}>
             <cylinderGeometry args={[0.07, 0.01, 0.05, 16]} />
             <meshStandardMaterial color="#ff5722" emissive="#ff5722" emissiveIntensity={5} />
        </mesh>
        
        {/* Light from Cigar Tip */}
        <pointLight position={[1.1, 0, 0]} intensity={1} distance={3} color="#ff5722" />

        {/* Smoke */}
        <group position={[1.0, 0.1, 0]}>
            <SmokeParticle position={[0, 0, 0]} />
            <SmokeParticle position={[0.02, 0.2, 0]} />
            <SmokeParticle position={[-0.02, 0.4, 0]} />
        </group>
      </group>
    </group>
  );
}
