import React, { useEffect, useState } from 'react';
import { GitCommit, RefreshCcw, Settings, X, Sparkles, History } from 'lucide-react';
import useEnigmaMachine from '../hooks/useEnigmaMachine';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const toChar = (i) => String.fromCharCode((i + 26) % 26 + 65);

const Key = ({ char, active, variant = 'keyboard', onClick, onMouseDown, onMouseUp, mode = 'old' }) => {
  const isLamp = variant === 'lamp';
  const isNewMode = mode === 'new';
  
  if (isNewMode) {
    const baseStyle = 'w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-semibold text-base transition-all duration-200 select-none cursor-pointer border shadow-md';
    let styleClass = '';
    
    if (isLamp) {
      if (active) {
        styleClass = 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)] z-10 scale-110';
      } else {
        styleClass = 'bg-slate-800/50 text-slate-500 border-slate-700/50 backdrop-blur-sm';
      }
    } else if (active) {
      styleClass = 'bg-gradient-to-br from-slate-600 to-slate-700 text-white border-slate-500 translate-y-0.5 shadow-inner';
    } else {
      styleClass = 'bg-slate-900/80 text-slate-300 border-slate-600/50 hover:bg-slate-800/80 hover:border-slate-500 active:scale-95 backdrop-blur-sm';
    }
    
    return (
      <div
        className={`${baseStyle} ${styleClass}`}
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
  }
  
  // Old mode (original)
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

const KeyboardRow = ({ chars, activeKey, onDown, onUp, variant, mode = 'old' }) => (
  <div className="flex justify-center gap-2 md:gap-4 mb-2 md:mb-4">
    {chars.map((char) => (
      <Key
        key={char}
        char={char}
        variant={variant}
        active={activeKey === char}
        onMouseDown={() => onDown && onDown(char)}
        onMouseUp={() => onUp && onUp()}
        mode={mode}
      />
    ))}
  </div>
);

const RotorUnit = ({ index, type, position, ring, onChangePos, mode = 'old' }) => {
  const char = toChar(position);
  const nextChar = toChar((position + 1) % 26);
  const prevChar = toChar((position - 1 + 26) % 26);
  const isNewMode = mode === 'new';

  if (isNewMode) {
    return (
      <div className="flex flex-col items-center mx-1 md:mx-2 bg-slate-800/40 backdrop-blur-md p-3 rounded-2xl border border-slate-600/30 shadow-lg">
        <button
          onClick={() => onChangePos(index, 1)}
          className="text-slate-400 hover:text-cyan-400 mb-2 transition-colors text-lg font-bold"
        >
          ▲
        </button>

        <div className="relative w-12 h-28 md:w-14 md:h-32 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border border-slate-600/50 shadow-inner">
          <div className="text-slate-500 text-xs opacity-60 blur-[0.5px] scale-75 transform -translate-y-7 absolute">{nextChar}</div>
          <div className="text-cyan-400 font-mono text-2xl md:text-3xl font-bold z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{char}</div>
          <div className="text-slate-500 text-xs opacity-60 blur-[0.5px] scale-75 transform translate-y-7 absolute">{prevChar}</div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
        </div>

        <button
          onClick={() => onChangePos(index, -1)}
          className="text-slate-400 hover:text-cyan-400 mt-2 transition-colors text-lg font-bold"
        >
          ▼
        </button>

        <div className="mt-2 text-[10px] text-slate-400 font-mono tracking-widest">ROTOR {type}</div>
      </div>
    );
  }

  // Old mode
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

const Socket = ({ char, isConnected, isSelected, color, onClick, mode = 'old' }) => {
  const isNewMode = mode === 'new';
  
  if (isNewMode) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          onClick={() => onClick(char)}
          className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all relative backdrop-blur-sm
              ${isSelected ? 'border-cyan-400 bg-slate-700/80 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : ''}
              ${!isSelected && !isConnected ? 'border-slate-600/50 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50' : ''}
              ${isConnected ? 'bg-slate-900/50' : ''}
            `}
          style={{ borderColor: isConnected ? color : undefined }}
        >
          <div className="w-2 h-2 rounded-full bg-slate-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]" />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{char}</span>
      </div>
    );
  }
  
  // Old mode
  return (
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
};

const DisplayPanel = ({ title, text, mode = 'old' }) => {
  const isNewMode = mode === 'new';
  
  if (isNewMode) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-slate-700/50 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-6 py-1.5 text-xs tracking-widest text-slate-400 border border-slate-700/50 rounded-full min-w-[280px] text-center whitespace-nowrap">
          {title}
        </div>
        
        <div className="mt-6 mb-2 min-h-[320px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-700/30 p-6 relative overflow-hidden">
          {/* Efeito de grid moderno */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
          
          {/* Texto do display moderno */}
          <div className="relative font-mono text-3xl md:text-4xl font-semibold tracking-wider text-cyan-400 text-center leading-relaxed break-all">
            {text ? (
              <div className="flex flex-wrap justify-center gap-2">
                {text.split('').map((char, idx) => (
                  <span key={idx} className="inline-block bg-slate-800/50 px-2 py-1 rounded-lg border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)] backdrop-blur-sm">
                    {char}
                  </span>
                ))}
              </div>
            ) : (
              <span className="opacity-20 text-2xl">---</span>
            )}
          </div>
          
          {/* Efeito de brilho moderno */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    );
  }
  
  // Old mode
  return (
    <div className="bg-[#0a0a0a] p-4 rounded-xl shadow-2xl border-2 border-[#3a2e23] relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1a1510] px-6 py-1.5 text-xs tracking-widest text-[#666] border border-[#4a3b2a] min-w-[280px] text-center whitespace-nowrap">
        {title}
      </div>
      
      <div className="mt-4 mb-2 min-h-[320px] bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] rounded-lg border-2 border-[#2a2a2a] p-4 relative overflow-hidden shadow-inner">
        {/* Efeito de fita de papel antiga */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }} />
        
        {/* Efeito de textura metálica vintage */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '8px 8px'
        }} />
        
        {/* Texto do display com estilo de máquina antiga */}
        <div className="relative font-mono text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#d4b483] text-center leading-relaxed break-all" style={{
          textShadow: '0 0 10px rgba(212, 180, 131, 0.3), 0 2px 4px rgba(0,0,0,0.8)',
          letterSpacing: '0.15em'
        }}>
          {text ? (
            <div className="flex flex-wrap justify-center gap-1">
              {text.split('').map((char, idx) => (
                <span key={idx} className="inline-block bg-[#1a1a1a] px-1 rounded border border-[#3a3a3a] shadow-inner">
                  {char}
                </span>
              ))}
            </div>
          ) : (
            <span className="opacity-30 text-lg">---</span>
          )}
        </div>
        
        {/* Efeito de brilho vintage superior */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4b483]/10 via-transparent to-black/30 pointer-events-none" />
        
        {/* Bordas internas para efeito de profundidade */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a3b2a] to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a3b2a] to-transparent opacity-50" />
      </div>
    </div>
  );
};

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
  const [inputText, setInputText] = useState(''); // Letras digitadas (criptografadas)
  const [decipheredText, setDecipheredText] = useState(''); // Letras decifradas
  const [selectedPlug, setSelectedPlug] = useState(null);
  const [plugs, setPlugs] = useState({});
  const [mode, setMode] = useState('old'); // 'old' or 'new'

  const handleKeyPress = (char) => {
    if (pressedKey) return;
    setPressedKey(char);

    const outputChar = encipher(char);
    setLitLamp(outputChar);

    // Campo 1: Mostra o resultado criptografado (output)
    setInputText((prev) => prev + outputChar);
    
    // Campo 2: Mostra a mensagem original digitada (input)
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
    setInputText('');
    setDecipheredText('');
  };

  const isNewMode = mode === 'new';
  
  return (
    <div className={`min-h-screen font-display flex flex-col items-center py-6 select-none overflow-x-hidden transition-colors duration-500 ${
      isNewMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100' 
        : 'bg-[#1a1510] text-gray-200'
    }`}>
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-500"
        style={{ 
          opacity: isNewMode ? 0.1 : 0.2,
          backgroundImage: isNewMode 
            ? 'radial-gradient(rgba(148,163,184,0.1) 1px, transparent 1px)' 
            : 'radial-gradient(#4a3b2a 1px, transparent 1px)', 
          backgroundSize: '20px 20px' 
        }}
      />

      <div className={`z-10 w-full max-w-4xl px-4 mb-6 flex justify-between items-end pb-4 transition-colors duration-500 ${
        isNewMode 
          ? 'border-b border-slate-700/50' 
          : 'border-b border-[#4a3b2a]'
      }`}>
        <div>
          <h1
            className={`text-3xl font-bold tracking-widest transition-colors duration-500 ${
              isNewMode 
                ? 'text-cyan-400' 
                : 'text-[#d4b483]'
            }`}
            style={{ textShadow: isNewMode ? '0 0 20px rgba(34,211,238,0.3)' : '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            ENIGMA <span className={`text-xl ${isNewMode ? 'text-cyan-300' : 'text-[#8c7353]'}`}>M3</span>
          </h1>
          <p className={`text-xs mt-1 transition-colors duration-500 ${isNewMode ? 'text-slate-400' : 'text-[#8c7353]'}`}>
            WEHRMACHT ENIGMA I SIMULATOR
          </p>
        </div>

        <div className="flex gap-2">
          {/* Toggle Mode Button */}
          <button
            onClick={() => setMode(mode === 'old' ? 'new' : 'old')}
            className={`p-2 rounded-lg border transition-all duration-300 flex items-center gap-1.5 ${
              isNewMode
                ? 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 text-cyan-400 hover:text-cyan-300'
                : 'bg-[#2a221b] border-[#4a3b2a] hover:bg-[#3a3026] text-[#d4b483]'
            }`}
            title={isNewMode ? 'Switch to Old Mode' : 'Switch to New Mode'}
          >
            {isNewMode ? <History size={16} /> : <Sparkles size={16} />}
            <span className="text-xs font-semibold hidden sm:inline">
              {isNewMode ? 'OLD' : 'NEW'}
            </span>
          </button>
          
          <button
            onClick={handleReset}
            className={`p-2 rounded border transition-colors duration-300 ${
              isNewMode
                ? 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 text-cyan-400'
                : 'bg-[#2a221b] border-[#4a3b2a] hover:bg-[#3a3026] text-[#d4b483]'
            }`}
            title="Reset Machine"
          >
            <RefreshCcw size={18} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded border transition-colors duration-300 ${
              showSettings 
                ? isNewMode 
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                  : 'bg-[#d4b483] text-[#1a1510] border-[#4a3b2a]'
                : isNewMode
                  ? 'bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 text-cyan-400'
                  : 'bg-[#2a221b] border-[#4a3b2a] hover:bg-[#3a3026] text-[#d4b483]'
            }`}
            title="Machine Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8 max-w-2xl lg:max-w-none">
        <div className={`p-4 md:p-6 rounded-xl shadow-2xl flex justify-center gap-2 md:gap-4 relative transition-all duration-500 ${
          isNewMode
            ? 'bg-slate-800/30 backdrop-blur-xl border-2 border-slate-700/50'
            : 'bg-[#111] border-4 border-[#3a2e23] bg-opacity-90'
        }`}>
          <div className={`absolute top-2 left-4 hidden md:block transition-opacity duration-500 ${
            isNewMode ? 'opacity-20' : 'opacity-30'
          }`}>
            <div className={`w-12 h-12 rounded-full border flex items-center justify-center ${
              isNewMode ? 'border-slate-600' : 'border-[#444]'
            }`}>
              <GitCommit size={24} />
            </div>
          </div>

          <RotorUnit index={0} type={rotorTypes[0]} position={positions[0]} ring={ringSettings[0]} onChangePos={adjustPosition} mode={mode} />
          <RotorUnit index={1} type={rotorTypes[1]} position={positions[1]} ring={ringSettings[1]} onChangePos={adjustPosition} mode={mode} />
          <RotorUnit index={2} type={rotorTypes[2]} position={positions[2]} ring={ringSettings[2]} onChangePos={adjustPosition} mode={mode} />
        </div>

        <div className={`p-6 rounded-xl shadow-2xl relative transition-all duration-500 ${
          isNewMode
            ? 'bg-slate-800/20 backdrop-blur-xl border border-slate-700/30'
            : 'bg-[#0a0a0a] border border-[#333]'
        }`}>
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-xs tracking-widest transition-colors duration-500 ${
            isNewMode
              ? 'bg-slate-950 text-slate-400 border border-slate-700/50 rounded-full py-1'
              : 'bg-[#1a1510] text-[#666]'
          }`}>LAMPBOARD</div>
          <KeyboardRow chars={ROW_1} activeKey={litLamp} variant="lamp" mode={mode} />
          <KeyboardRow chars={ROW_2} activeKey={litLamp} variant="lamp" mode={mode} />
          <KeyboardRow chars={ROW_3} activeKey={litLamp} variant="lamp" mode={mode} />
        </div>

        <div className={`p-6 pb-8 rounded-xl shadow-2xl relative transition-all duration-500 ${
          isNewMode
            ? 'bg-slate-800/20 backdrop-blur-xl border-t-2 border-slate-700/30'
            : 'bg-[#1a1a1a] border-t-4 border-[#333] shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
        }`}>
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-xs tracking-widest transition-colors duration-500 ${
            isNewMode
              ? 'bg-slate-950 text-slate-400 border border-slate-700/50 rounded-full py-1'
              : 'bg-[#1a1510] text-[#666]'
          }`}>KEYBOARD</div>
          <KeyboardRow chars={ROW_1} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" mode={mode} />
          <KeyboardRow chars={ROW_2} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" mode={mode} />
          <KeyboardRow chars={ROW_3} activeKey={pressedKey} onDown={handleKeyPress} onUp={handleKeyRelease} variant="keyboard" mode={mode} />
        </div>

        <div className={`p-4 rounded-xl relative transition-all duration-500 ${
          isNewMode
            ? 'bg-slate-800/20 backdrop-blur-xl border border-slate-700/30'
            : 'bg-[#161616] border border-[#333]'
        }`}>
          <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 text-xs tracking-widest transition-colors duration-500 ${
            isNewMode
              ? 'bg-slate-950 text-slate-400 border border-slate-700/50 rounded-full py-1'
              : 'bg-[#1a1510] text-[#666]'
          }`}>STECKERBRETT (PLUGBOARD)</div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 mt-2">
            {[...ROW_1, ...ROW_2, ...ROW_3].map((char) => (
              <Socket
                key={char}
                char={char}
                isSelected={selectedPlug === char}
                isConnected={!!plugs[char]}
                color={getWireColor(char)}
                onClick={handlePlugClick}
                mode={mode}
              />
            ))}
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-visible z-20">
          </svg>

          <div className={`text-center mt-4 text-xs transition-colors duration-500 ${
            isNewMode ? 'text-slate-500' : 'text-neutral-500'
          }`}>
            {Object.keys(plugs).length / 2} / 10 Cables Used. Click two letters to connect. Click connected letter to remove.
          </div>
        </div>
        </div>

        {/* Painéis de Display à direita */}
        <div className="flex flex-col gap-6 w-full lg:w-80 flex-shrink-0">
          <DisplayPanel
            title="PALAVRA CRIPTOGRAFADA"
            text={inputText}
            mode={mode}
          />
          <DisplayPanel
            title="PALAVRA DECIFRADA (ORIGINAL)"
            text={decipheredText}
            mode={mode}
          />
        </div>
      </div>


      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-lg border shadow-2xl p-6 transition-all duration-500 ${
            isNewMode
              ? 'bg-slate-900/95 backdrop-blur-xl border-slate-700/50 text-slate-100'
              : 'bg-[#2a221b] border-[#4a3b2a] text-[#d4b483]'
          }`}>
            <div className={`flex justify-between items-center mb-6 border-b pb-4 transition-colors duration-500 ${
              isNewMode ? 'border-slate-700/50' : 'border-[#4a3b2a]'
            }`}>
              <h2 className={`text-xl font-bold flex items-center gap-2 transition-colors duration-500 ${
                isNewMode ? 'text-cyan-400' : ''
              }`}>
                <Settings size={20} /> Machine Configuration
              </h2>
              <button onClick={() => setShowSettings(false)} className={`transition-colors duration-300 ${
                isNewMode ? 'hover:text-cyan-400 text-slate-400' : 'hover:text-white'
              }`}>
                <X />
              </button>
            </div>

            <div className="mb-6">
              <label className={`block text-xs uppercase tracking-wider mb-2 transition-colors duration-500 ${
                isNewMode ? 'text-slate-400 opacity-90' : 'opacity-70'
              }`}>Reflector (Umkehrwalze)</label>
              <select
                value={reflectorType}
                onChange={(e) => updateReflector(e.target.value)}
                className={`w-full rounded p-2 outline-none transition-all duration-300 ${
                  isNewMode
                    ? 'bg-slate-800/50 border border-slate-600/50 text-slate-100 focus:border-cyan-400'
                    : 'bg-[#1a1510] border border-[#4a3b2a] text-white focus:border-[#d4b483]'
                }`}
              >
                <option value="B">Reflector B (Standard)</option>
                <option value="C">Reflector C</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {['Left', 'Middle', 'Right'].map((label, idx) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className={`text-center text-xs uppercase transition-colors duration-500 ${
                    isNewMode ? 'text-slate-400 opacity-90' : 'opacity-70'
                  }`}>{label} Rotor</label>

                  <select
                    value={rotorTypes[idx]}
                    onChange={(e) => {
                      const newTypes = [...rotorTypes];
                      newTypes[idx] = e.target.value;
                      updateRotorTypes(newTypes);
                    }}
                    className={`rounded p-1 text-center text-sm outline-none transition-all duration-300 ${
                      isNewMode
                        ? 'bg-slate-800/50 border border-slate-600/50 text-slate-100'
                        : 'bg-[#1a1510] border border-[#4a3b2a] text-white'
                    }`}
                  >
                    {['I', 'II', 'III', 'IV', 'V'].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <div className={`flex items-center justify-between rounded px-2 transition-all duration-300 ${
                    isNewMode
                      ? 'bg-slate-800/50 border border-slate-600/50'
                      : 'bg-[#1a1510] border border-[#4a3b2a]'
                  }`}>
                    <span className={`text-xs transition-colors duration-500 ${
                      isNewMode ? 'text-slate-400' : 'text-[#8c7353]'
                    }`}>Ring</span>
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
                      className={`w-8 bg-transparent text-right text-sm py-1 outline-none transition-colors duration-500 ${
                        isNewMode ? 'text-slate-100' : ''
                      }`}
                    />
                    <span className={`text-xs ml-1 transition-colors duration-500 ${
                      isNewMode ? 'text-slate-500' : 'opacity-50'
                    }`}>{toChar(ringSettings[idx])}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className={`px-6 py-2 font-bold rounded transition-all duration-300 ${
                  isNewMode
                    ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'bg-[#d4b483] text-[#1a1510] hover:bg-[#c0a070]'
                }`}
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
