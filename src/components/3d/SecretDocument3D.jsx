import React from 'react';
import { Text } from '@react-three/drei';

export default function SecretDocument3D({ position, rotation, text = "TOP SECRET" }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Paper */}
      <mesh receiveShadow>
        <boxGeometry args={[3, 0.01, 4]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>
      
      {/* Text */}
      <Text
        position={[0, 0.02, -1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.3}
        color="#8b0000"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
      
      {/* Fake text lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0.02, -1 + i * 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.05]} />
          <meshBasicMaterial color="#333" opacity={0.5} transparent />
        </mesh>
      ))}
      
      {/* Stamp */}
      <mesh position={[1, 0.03, 1.5]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#8b0000" opacity={0.3} transparent />
      </mesh>
       <Text
        position={[1, 0.04, 1.5]}
        rotation={[-Math.PI / 2, 0, -0.2]}
        fontSize={0.15}
        color="#8b0000"
        anchorX="center"
        anchorY="middle"
      >
        CONFIDENTIAL
      </Text>
    </group>
  );
}
