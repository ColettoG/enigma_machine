import { useState } from 'react';
import EnigmaMachine from './components/EnigmaMachine.jsx';
import Enigma3D from './components/Enigma3D.jsx';
import { Box } from 'lucide-react';

export default function App() {
  const [is3D, setIs3D] = useState(false);

  if (is3D) {
    return <Enigma3D onClose={() => setIs3D(false)} />;
  }

  return (
    <>
      <EnigmaMachine />
      <button
        onClick={() => setIs3D(true)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-xl hover:bg-indigo-700 transition-all hover:scale-110 border-2 border-indigo-400"
        title="Switch to 3D View"
      >
        <Box size={24} />
        <span className="sr-only">3D View</span>
      </button>
    </>
  );
}
