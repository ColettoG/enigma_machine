import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, SpotLight } from '@react-three/drei';
import Rotor3D from './3d/Rotor3D';
import Key3D from './3d/Key3D';
import Lamp3D from './3d/Lamp3D';
import Table3D from './3d/Table3D';
import SecretDocument3D from './3d/SecretDocument3D';
import Ashtray3D from './3d/Ashtray3D';
import useEnigmaMachine from '../hooks/useEnigmaMachine';

const ROW_1 = 'QWERTZUIO'.split('');
const ROW_2 = 'ASDFGHJK'.split('');
const ROW_3 = 'PYXCVBNML'.split('');

const KEY_SPACING = 1.2;
const ROW_SPACING = 1.5;

const getRowOffset = (rowIndex) => {
  if (rowIndex === 1) return 0.5 * KEY_SPACING; // Offset for middle row
  if (rowIndex === 2) return 1.5 * KEY_SPACING; // Offset for bottom row
  return 0;
};

export default function Enigma3D({ onClose }) {
  const {
    rotorTypes,
    ringSettings,
    positions,
    reflectorType,
    plugboardPairs,
    encipher,
    updateRotorPositions,
  } = useEnigmaMachine();

  const [litLamp, setLitLamp] = useState(null);
  const [isLampOn, setIsLampOn] = useState(true);
  const [pressedKey, setPressedKey] = useState(null);
  const [inputText, setInputText] = useState('');
  const [decipheredText, setDecipheredText] = useState('');

  const handleKeyPress = (char) => {
    if (pressedKey) return;
    setPressedKey(char);

    const outputChar = encipher(char);
    setLitLamp(outputChar);
    
    setInputText((prev) => prev + outputChar);
    setDecipheredText((prev) => prev + char);
  };

  const handleKeyRelease = () => {
    setLitLamp(null);
    setPressedKey(null);
  };
  
  useEffect(() => {
    const downHandler = (e) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      
      if (ALPHABET.includes(key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleKeyPress(key);
      }
      
      if (e.key === 'Backspace') {
        setInputText((prev) => prev.slice(0, -1));
        setDecipheredText((prev) => prev.slice(0, -1));
      }
    };

    const upHandler = () => handleKeyRelease();

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [encipher]);

  const adjustPosition = (idx, dir) => {
    const newPos = [...positions];
    newPos[idx] = (newPos[idx] + dir + 26) % 26;
    updateRotorPositions(newPos);
  };

  return (
    <div className="w-full h-screen bg-slate-950 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700"
      >
        Close 3D View
      </button>

      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 18, 18]} fov={45} />
        <OrbitControls 
          target={[0, 0, 0]} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={10}
          maxDistance={40}
        />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={isLampOn ? 0.5 : 0.2} color="#b3e5fc" />
        
        {/* Desk Lamp Model and Light */}
        <group 
          position={[-8, 0, -2]} 
          rotation={[0, Math.PI / 4, 0]}
          onClick={(e) => {
            e.stopPropagation();
            setIsLampOn(!isLampOn);
          }}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          {/* Base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
            <meshStandardMaterial color="#2c3e50" roughness={0.5} metalness={0.5} />
          </mesh>
          {/* Switch */}
          <mesh 
            position={[0.8, 0.5, 0]} 
            rotation={[0, 0, 0.2]} 
            onClick={(e) => {
              e.stopPropagation();
              setIsLampOn(!isLampOn);
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
          >
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={isLampOn ? "#4caf50" : "#f44336"} />
          </mesh>
          {/* Stem */}
          <mesh position={[0, 3, 0]} rotation={[0.2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 6, 16]} />
            <meshStandardMaterial color="#bdc3c7" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Head/Shade */}
          <group position={[0, 6, 1.5]} rotation={[0.5, 0, 0]}>
             <mesh castShadow>
               <coneGeometry args={[1.5, 2.5, 32, 1, true]} />
               <meshStandardMaterial color="#2c3e50" side={2} roughness={0.5} metalness={0.5} />
             </mesh>
             {/* Bulb */}
             <mesh position={[0, -0.5, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial 
                  emissive="#ffeb3b" 
                  emissiveIntensity={isLampOn ? 2 : 0} 
                  color={isLampOn ? "#fff" : "#555"} 
                />
             </mesh>
             {/* The actual light source */}
             <SpotLight
                position={[0, 0, 0]}
                target-position={[0, -10, 0]}
                angle={0.8}
                penumbra={0.5}
                intensity={isLampOn ? 20 : 0}
                castShadow
                shadow-bias={-0.0001}
                color="#ffeb3b"
                distance={50}
              />
              {/* Omni-directional light for area coverage */}
              <pointLight
                position={[0, -2, 0]}
                intensity={isLampOn ? 5 : 0}
                distance={20}
                color="#ffeb3b"
              />
          </group>
        </group>

        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#ff9800" />

        <group position={[0, 0.5, -2]}>
          {/* Enigma Machine Case */}
          <group>
             {/* Rotors */}
            <group position={[0, 2, -4]}>
              {[-1, 0, 1].map((offset, i) => (
                <Rotor3D
                  key={i}
                  position={[offset * 2.5, 0, 0]}
                  type={rotorTypes[i]}
                  rotorPosition={positions[i]}
                  ringSetting={ringSettings[i]}
                  onChangePos={(dir) => adjustPosition(i, dir)}
                />
              ))}
            </group>

            {/* Lampboard */}
            <group position={[0, 0, 0]}>
              {[ROW_1, ROW_2, ROW_3].map((row, rowIndex) => (
                <group key={rowIndex} position={[0, 0, rowIndex * ROW_SPACING]}>
                  {row.map((char, charIndex) => {
                    const x = (charIndex - (row.length - 1) / 2) * KEY_SPACING + getRowOffset(rowIndex) - (rowIndex === 2 ? 1 : 0);
                    return (
                      <Lamp3D
                        key={char}
                        char={char}
                        position={[x, 0, 0]}
                        active={litLamp === char}
                      />
                    );
                  })}
                </group>
              ))}
            </group>

            {/* Keyboard */}
            <group position={[0, 0, 6]}>
               {[ROW_1, ROW_2, ROW_3].map((row, rowIndex) => (
                <group key={rowIndex} position={[0, 0, rowIndex * ROW_SPACING]}>
                  {row.map((char, charIndex) => {
                    const x = (charIndex - (row.length - 1) / 2) * KEY_SPACING + getRowOffset(rowIndex) - (rowIndex === 2 ? 1 : 0);
                    return (
                      <Key3D
                        key={char}
                        char={char}
                        position={[x, 0, 0]}
                        active={pressedKey === char}
                        onDown={handleKeyPress}
                        onUp={handleKeyRelease}
                      />
                    );
                  })}
                </group>
              ))}
            </group>
            
            {/* Base/Case */}
            <mesh position={[0, -0.5, 2]} receiveShadow>
              <boxGeometry args={[14, 1, 16]} />
              <meshStandardMaterial color="#2a221b" roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* Environment Objects */}
        <Table3D position={[0, -1, 0]} />
        <SecretDocument3D position={[-8, -0.48, 2]} rotation={[0, 0.5, 0]} text="CONFIDENTIAL" />
        <SecretDocument3D position={[9, -0.48, -2]} rotation={[0, -0.3, 0]} text="OPERATION ULTRA" />
        <SecretDocument3D position={[7, -0.48, 5]} rotation={[0, 0.2, 0]} text="TOP SECRET" />
        <Ashtray3D position={[10, -0.85, 4]} rotation={[0, 0.5, 0]} />
        
        <ContactShadows position={[0, -0.49, 0]} opacity={0.6} scale={40} blur={2} far={4.5} />

        {/* Post Processing - Temporarily Disabled for Debugging */}
        {/* <EffectComposer>
          <Noise opacity={0.15} blendFunction={BlendFunction.OVERLAY} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Bloom luminanceThreshold={1} intensity={0.5} levels={9} mipmapBlur />
        </EffectComposer> */}
      </Canvas>
      
      <div className="absolute top-4 left-4 z-40">
        <div className="bg-slate-900/80 p-6 rounded-xl backdrop-blur-md border border-slate-700 shadow-2xl min-w-[300px]">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 tracking-widest border-b border-slate-700 pb-2">ENIGMA OUTPUT</h2>
          <div className="mb-4">
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Encrypted (Ciphertext)</label>
            <div className="font-mono text-lg text-yellow-400 break-all bg-slate-950/50 p-2 rounded border border-slate-700/50 min-h-[2rem]">
              {inputText || <span className="opacity-30">---</span>}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Original (Plaintext)</label>
            <div className="font-mono text-lg text-green-400 break-all bg-slate-950/50 p-2 rounded border border-slate-700/50 min-h-[2rem]">
              {decipheredText || <span className="opacity-30">---</span>}
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 italic">
            * Use physical keyboard or click 3D keys
          </div>
        </div>
      </div>

      {/* CSS Post-Processing Overlays REMOVED */}

      <div className="absolute bottom-4 left-4 text-white/50 text-sm pointer-events-none select-none">
        <p>Click keys to type. Click rotors to rotate.</p>
        <p>Drag to rotate view. Scroll to zoom.</p>
      </div>
    </div>
  );
}
