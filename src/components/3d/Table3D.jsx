import React from 'react';

export default function Table3D(props) {
  return (
    <group {...props}>
      {/* Table Top */}
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[30, 1, 20]} />
        <meshStandardMaterial color="#3e2723" roughness={0.8} />
      </mesh>
      
      {/* Legs */}
      <mesh receiveShadow position={[-14, -5.5, -9]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2d1b18" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[14, -5.5, -9]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2d1b18" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[-14, -5.5, 9]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2d1b18" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[14, -5.5, 9]}>
        <boxGeometry args={[1, 10, 1]} />
        <meshStandardMaterial color="#2d1b18" roughness={0.9} />
      </mesh>
    </group>
  );
}
