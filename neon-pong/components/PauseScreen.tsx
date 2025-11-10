
import React from 'react';

interface PauseScreenProps {
  onResume: () => void;
}

const PauseScreen: React.FC<PauseScreenProps> = ({ onResume }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20">
      <h2 className="text-5xl neon-text mb-8">Paused</h2>
      <button
        onClick={onResume}
        className="px-8 py-4 bg-cyan-400 text-black font-bold text-2xl border-2 border-cyan-400 neon-box hover:bg-black hover:text-cyan-400 transition-all duration-300"
      >
        Resume
      </button>
    </div>
  );
};

export default PauseScreen;
