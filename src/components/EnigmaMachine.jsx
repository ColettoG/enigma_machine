import React, { useEffect, useState } from 'react';
import { GitCommit, RefreshCcw, Settings, X } from 'lucide-react';
import useEnigmaMachine from '../hooks/useEnigmaMachine';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const toChar = (i) => String.fromCharCode((i + 26) % 26 + 65);

const Key = ({ char, active, variant = 'keyboard', onClick, onMouseDown, onMouseUp }) => {
  const isLamp = variant === 'lamp';
  const baseStyle = 'w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-100 select-none cursor-pointer border-2 shadow-lg';
  let styleClass = '';
  let glowStyle = {};

  if (isLamp) {
    if (active) {
      styleClass = 'bg-[#ffdb4d] text-black border-[#cfb53b] shadow-[0_0_15px_5px_rgba(255,219,77,0.8)] z-10 scale-105';
      glowStyle = { textShadow: '0 0 5px #fff' };
    } else {
      styleClass = 'bg-neutral-800 text-neutral-600 border-neutral-700 opacity-80';
    }
  } else if (active) {
    styleClass = 'bg-neutral-400 text-black border-neutral-500 translate-y-1 shadow-inner';
  } else {
    styleClass = 'bg-neutral-900 text-gray-200 border-neutral-500 hover:bg-neutral-800 hover:border-gray-400 active:scale-95';
  }

  return (
    <div
      className={`${baseStyle} ${styleClass}`}
      style={glowStyle}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onMouseDown}
      onTouchEnd={onMouseUp}
      onClick={onClick}
    >
      {char}
    </div>
  );
};

const ROW_1 = 'QWERTZUIO'.split('');
const ROW_2 = 'ASDFGHJK'.split('');
const ROW_3 = 'PYXCVBNML'.split('');

const KeyboardRow = ({ chars, activeKey, onDown, onUp, variant }) => (
  <div className="flex justify-center gap-2 md:gap-4 mb-2 md:mb-4">
    {chars.map((char) => (
      <Key
        key={char}
        char={char}
        variant={variant}
        active={activeKey === char}
        onMouseDown={() => onDown && onDown(char)}
        onMouseUp={() => onUp && onUp()}
      />
    ))}
  </div>
);

const RotorUnit = ({ index, type, position, ring, onChangePos }) => {
  const char = toChar(position);
  const nextChar = toChar((position + 1) % 26);
  const prevChar = toChar((position - 1 + 26) % 26);

  return (
    <div className="flex flex-col items-center mx-1 md:mx-2 bg-[#2a2a2a] p-2 rounded-lg border-2 border-[#1a1a1a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
      <button
        onClick={() => onChangePos(index, 1)}
        className="text-neutral-500 hover:text-white mb-1 transition-colors"
      >
        ▲
      </button>

      <div className="relative w-10 h-24 md:w-12 md:h-28 bg-gradient-to-r from-neutral-800 via-neutral-200 to-neutral-800 rounded overflow-hidden flex flex-col items-center justify-center border border-black shadow-inner">
        <div className="text-neutral-400 text-sm opacity-50 blur-[0.5px] scale-75 transform -translate-y-6 absolute">{nextChar}</div>
        <div className="text-black font-mono text-2xl md:text-3xl font-bold z-10">{char}</div>
        <div className="text-neutral-400 text-sm opacity-50 blur-[0.5px] scale-75 transform translate-y-6 absolute">{prevChar}</div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20 pointer-events-none" />
      </div>

      <button
        onClick={() => onChangePos(index, -1)}
        className="text-neutral-500 hover:text-white mt-1 transition-colors"
      >
        ▼
      </button>

      <div className="mt-2 text-[10px] text-neutral-500 font-mono tracking-widest">ROTOR {type}</div>
    </div>
  );
};

const Socket = ({ char, isConnected, isSelected, color, onClick }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      onClick={() => onClick(char)}
      className={`w-8 h-8 rounded-full border-4 flex items-center justify-center cursor-pointer transition-all relative
          ${isSelected ? 'border-white bg-neutral-700 scale-110' : ''}
          ${!isSelected && !isConnected ? 'border-neutral-600 bg-black hover:border-neutral-400' : ''}
          ${isConnected ? 'bg-black' : ''}
        `}
      style={{ borderColor: isConnected ? color : undefined }}
    >
      <div className="w-2 h-2 rounded-full bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]" />
    </div>
    <span className="text-xs text-neutral-400 font-bold">{char}</span>
  </div>
);

export default function EnigmaMachine() {
  const {
    rotorTypes,
    ringSettings,
    positions,
    reflectorType,
    plugboardPairs,
    encipher,
    updateRotorPositions,
    updateRotorTypes,
    updateRingSettings,
    updateReflector,
    updatePlugboard,
    reset,
  } = useEnigmaMachine();

  const [litLamp, setLitLamp] = useState(null);
  const [pressedKey, setPressedKey] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [outputLog, setOutputLog] = useState('');
  const [selectedPlug, setSelectedPlug] = useState(null);
  const [plugs, setPlugs] = useState({});

  const handleKeyPress = (char) => {
    if (pressedKey) return;
    setPressedKey(char);

    const outputChar = encipher(char);
    setLitLamp(outputChar);

    setOutputLog((prev) => {
      const clean = prev.replace(/\s/g, '');
      const next = clean + outputChar;
      return next.match(/.{1,5}/g).join(' ');
    });
  };

  const handleKeyRelease = () => {
    setLitLamp(null);
    setPressedKey(null);
  };

  useEffect(() => {
    const downHandler = (e) => {
      if (e.repeat) return;
      const key = e.key.toUpperCase();
      if (ALPHABET.includes(key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleKeyPress(key);
      }
      if (e.key === 'Backspace') {
        setOutputLog((prev) => prev.slice(0, -1));
      }
    };

    const upHandler = () => handleKeyRelease();

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [positions, plugs, rotorTypes, ringSettings, reflectorType]);

  const handlePlugClick = (char) => {
    if (selectedPlug === char) {
      setSelectedPlug(null);
      return;
    }

    if (plugs[char]) {
      const partner = plugs[char];
      const newPlugs = { ...plugs };
      delete newPlugs[char];
      delete newPlugs[partner];
      setPlugs(newPlugs);

      const newPairs = Object.entries(newPlugs)
        .filter(([k, v]) => k < v)
        .map(([k, v]) => [k, v]);
      updatePlugboard(newPairs);
      return;
    }

    if (selectedPlug) {
      const newPlugs = {
        ...plugs,
        [selectedPlug]: char,
        [char]: selectedPlug,
      };
      setPlugs(newPlugs);

      const newPairs = Object.entries(newPlugs)
        .filter(([k, v]) => k < v)
        .map(([k, v]) => [k, v]);
      updatePlugboard(newPairs);
      setSelectedPlug(null);
    } else {
      setSelectedPlug(char);
    }
  };

  const WIRE_COLORS = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#84CC16',
    '#10B981',
    '#06B6D4',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
  ];

  const getWireColor = (char) => {
    const p1 = char;
    const p2 = plugs[char];
    if (!p2) return 'transparent';
    const pairId = [p1, p2].sort().join('');
    let hash = 0;
    for (let i = 0; i < pairId.length; i += 1) {
      hash = pairId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return WIRE_COLORS[Math.abs(hash) % WIRE_COLORS.length];
  };

  const adjustPosition = (idx, dir) => {
    const newPos = [...positions];
    newPos[idx] = (newPos[idx] + dir + 26) % 26;
    updateRotorPositions(newPos);
  };

  const handleReset = () => {
    reset();
    setOutputLog('');
  };

  return (
    <div className="min-h-screen bg-[#1a1510] font-display text-gray-200 flex flex-col items-center py-6 select-none overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(#4a3b2a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <div className="z-10 w-full max-w-4xl px-4 mb-6 flex justify-between items-end border-b border-[#4a3b2a] pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-widest text-[#d4b483]"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            ENIGMA <span className="text-[#8c7353] text-xl">M3</span>
          </h1>
          <p className="text-xs text-[#8c7353] mt-1">WEHRMACHT ENIGMA I SIMULATOR</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="p-2 bg-[#2a221b] rounded border border-[#4a3b2a] hover:bg-[#3a3026] text-[#d4b483]"
            title="Reset Machine"
          >
            <RefreshCcw size={18} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded border border-[#4a3b2a] text-[#d4b483] transition-colors ${showSettings ? 'bg-[#d4b483] text-[#1a1510]' : 'bg-[#2a221b] hover:bg-[#3a3026]'}`}
            title="Machine Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
        <div className="bg-[#111] p-4 md:p-6 rounded-xl border-4 border-[#3a2e23] shadow-2xl flex justify-center gap-2 md:gap-4 relative bg-opacity-90">
          <div className="absolute top-2 left-4 hidden md:block">
            <div className="w-12 h-12 rounded-full border border-[#444] flex items-center justify-center opacity-30">
              <GitCommit size={24} />
            </div>
          </div>

          <RotorUnit index={0} type={rotorTypes[0]} position={positions[0]} ring={ringSettings[0]} onChangePos={adjustPosition} />
          <RotorUnit index={1} type={rotorTypes[1]} position={positions[1]} ring={ringSettings[1]} onChangePos={adjustPosition} />
          <RotorUnit index={2} type={rotorTypes[2]} position={positions[2]} ring={ringSettings[2]} onChangePos={adjustPosition} />
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-xl shadow-2xl border border-[#333] relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1510] px-4 text-xs tracking-widest text-[#666]">LAMPBOARD</div>
          <KeyboardRow chars={ROW_1} activeKey={litLamp} variant="lamp" />
          <KeyboardRow chars={ROW_2} activeKey={litLamp} variant="lamp" />
          <KeyboardRow chars={ROW_3} activeKey={litLamp} variant="lamp" />
        </div>

        <div className="bg-[#1a1a1a] p-6 pb-8 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-t-4 border-[#333] relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1510] px-4 text-xs tracking-widest text-[#666]">KEYBOARD</div>
          <KeyboardRow chars={ROW_1} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" />
          <KeyboardRow chars={ROW_2} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" />
          <KeyboardRow chars={ROW_3} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" />
        </div>

        <div className="bg-[#161616] p-4 rounded-xl border border-[#333] relative mb-20">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1510] px-4 text-xs tracking-widest text-[#666]">STECKERBRETT (PLUGBOARD)</div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 mt-2">
            {[...ROW_1, ...ROW_2, ...ROW_3].map((char) => (
              <Socket
                key={char}
                char={char}
                isSelected={selectedPlug === char}
                isConnected={!!plugs[char]}
                color={getWireColor(char)}
                onClick={handlePlugClick}
              />
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-visible z-20">
          </svg>

          <div className="text-center mt-4 text-xs text-neutral-500">
            {Object.keys(plugs).length / 2} / 10 Cables Used. Click two letters to connect. Click connected letter to remove.
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-[#eee] text-[#333] font-mono p-3 text-lg border-t-4 border-[#999] shadow-lg z-30 flex items-center gap-4">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex-shrink-0 ml-4">Output Tape:</span>
        <div className="overflow-x-auto whitespace-nowrap w-full px-2 font-bold tracking-widest">
          {outputLog || <span className="opacity-30">TYPE TO BEGIN...</span>}
        </div>
        <button onClick={() => setOutputLog('')} className="mr-4 text-xs text-red-500 hover:text-red-700 font-bold uppercase">
          Clear
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#2a221b] w-full max-w-lg rounded-lg border border-[#4a3b2a] shadow-2xl p-6 text-[#d4b483]">
            <div className="flex justify-between items-center mb-6 border-b border-[#4a3b2a] pb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings size={20} /> Machine Configuration
              </h2>
              <button onClick={() => setShowSettings(false)} className="hover:text-white">
                <X />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider mb-2 opacity-70">Reflector (Umkehrwalze)</label>
              <select
                value={reflectorType}
                onChange={(e) => updateReflector(e.target.value)}
                className="w-full bg-[#1a1510] border border-[#4a3b2a] rounded p-2 text-white outline-none focus:border-[#d4b483]"
              >
                <option value="B">Reflector B (Standard)</option>
                <option value="C">Reflector C</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {['Left', 'Middle', 'Right'].map((label, idx) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="text-center text-xs uppercase opacity-70">{label} Rotor</label>

                  <select
                    value={rotorTypes[idx]}
                    onChange={(e) => {
                      const newTypes = [...rotorTypes];
                      newTypes[idx] = e.target.value;
                      updateRotorTypes(newTypes);
                    }}
                    className="bg-[#1a1510] border border-[#4a3b2a] rounded p-1 text-center text-white text-sm outline-none"
                  >
                    {['I', 'II', 'III', 'IV', 'V'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center justify-between bg-[#1a1510] border border-[#4a3b2a] rounded px-2">
                    <span className="text-xs text-[#8c7353]">Ring</span>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={ringSettings[idx]}
                      onChange={(e) => {
                        const newRings = [...ringSettings];
                        newRings[idx] = parseInt(e.target.value, 10) || 0;
                        updateRingSettings(newRings);
                      }}
                      className="w-8 bg-transparent text-right text-sm py-1 outline-none"
                    />
                    <span className="text-xs ml-1 opacity-50">{toChar(ringSettings[idx])}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-2 bg-[#d4b483] text-[#1a1510] font-bold rounded hover:bg-[#c0a070]"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
