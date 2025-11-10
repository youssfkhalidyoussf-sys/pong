
import React from 'react';
import { GameState } from '../types';
import { GAME_WIDTH, GAME_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE } from '../constants';
import Particles from './Particles';
import { GameStatus } from '../types';

interface GameCanvasProps {
  state: GameState;
  onPause: () => void;
  onRestart: () => void;
}

const PauseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
    </svg>
);

const RestartIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
    </svg>
);

const GameCanvas: React.FC<GameCanvasProps> = ({ state, onPause, onRestart }) => {
  const { ball, paddle1, paddle2, score } = state;

  return (
    <>
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-4 z-10">
        <div className="flex items-center space-x-2">
            {state.status === GameStatus.PLAYING && <button onClick={onPause} className="text-cyan-400 hover:text-white transition-colors"><PauseIcon /></button>}
            <button onClick={onRestart} className="text-cyan-400 hover:text-white transition-colors"><RestartIcon /></button>
        </div>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center space-x-16 text-4xl">
        <span className="neon-text text-magenta-500">{score.player1}</span>
        <span className="neon-text text-yellow-300">{score.player2}</span>
      </div>

      {/* Dotted center line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="bg-cyan-400/30 w-full h-10" style={{ marginBottom: '15px' }} />
        ))}
      </div>

      {/* Paddles */}
      <div
        className="absolute bg-fuchsia-500 neon-paddle"
        style={{
          left: 0,
          top: paddle1.y,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT,
        }}
      />
      <div
        className="absolute bg-fuchsia-500 neon-paddle"
        style={{
          right: 0,
          top: paddle2.y,
          width: PADDLE_WIDTH,
          height: PADDLE_HEIGHT,
        }}
      />

      {/* Ball */}
      <div
        className="absolute bg-yellow-300 neon-ball rounded-full"
        style={{
          left: ball.x,
          top: ball.y,
          width: BALL_SIZE,
          height: BALL_SIZE,
        }}
      />

      {/* Particle Effects */}
      {state.isPlayer1Scoring && <Particles count={30} targetX={GAME_WIDTH} />}
      {state.isPlayer2Scoring && <Particles count={30} targetX={0} />}
    </>
  );
};

export default GameCanvas;
