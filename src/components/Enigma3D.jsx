import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import Rotor3D from './3d/Rotor3D';
import Key3D from './3d/Key3D';
import Lamp3D from './3d/Lamp3D';
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

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={45} />
        <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2} />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />

        <group position={[0, 0, -2]}>
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
                  const x = (charIndex - (row.length - 1) / 2) * KEY_SPACING + getRowOffset(rowIndex) - (rowIndex === 2 ? 1 : 0); // Adjust centering
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
            <meshStandardMaterial color="#2a221b" roughness={0.8} />
          </mesh>
        </group>
        
        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
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

      <div className="absolute bottom-4 left-4 text-white/50 text-sm pointer-events-none select-none">
        <p>Click keys to type. Click rotors to rotate.</p>
        <p>Drag to rotate view. Scroll to zoom.</p>
      </div>
    </div>
  );
}
