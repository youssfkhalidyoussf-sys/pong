
import React from 'react';

interface GameOverScreenProps {
  winner: string | null;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ winner, onRestart, onMenu }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-20">
      <h2 className="text-4xl neon-text mb-4">Game Over</h2>
      <p className="text-2xl text-yellow-300 neon-text mb-8">{winner} wins!</p>
      <div className="flex flex-col space-y-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-cyan-400 text-black font-bold text-xl border-2 border-cyan-400 neon-box hover:bg-black hover:text-cyan-400 transition-all duration-300"
        >
          Play Again
        </button>
        <button
          onClick={onMenu}
          className="px-6 py-3 bg-fuchsia-500 text-black font-bold text-xl border-2 border-fuchsia-500 neon-box hover:bg-black hover:text-fuchsia-500 transition-all duration-300"
        >
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
