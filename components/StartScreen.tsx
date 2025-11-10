
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20">
      <h2 className="text-5xl neon-text mb-8">Ready?</h2>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-cyan-400 text-black font-bold text-2xl border-2 border-cyan-400 neon-box hover:bg-black hover:text-cyan-400 transition-all duration-300"
      >
        Start Game
      </button>
      <p className="mt-8 text-sm text-gray-400">Move your paddle with mouse or touch</p>
    </div>
  );
};

export default StartScreen;
