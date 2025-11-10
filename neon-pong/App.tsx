

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStatus } from './types';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  BALL_SIZE,
  INITIAL_BALL_SPEED_X,
  INITIAL_BALL_SPEED_Y,
  WINNING_SCORE,
  AI_PADDLE_SPEED,
} from './constants';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import PauseScreen from './components/PauseScreen';
import GameOverScreen from './components/GameOverScreen';
import { playHitSound, playScoreSound } from './services/AudioService';

const App: React.FC = () => {
  const getInitialState = (): GameState => ({
    status: GameStatus.START,
    ball: {
      x: GAME_WIDTH / 2 - BALL_SIZE / 2,
      y: GAME_HEIGHT / 2 - BALL_SIZE / 2,
      dx: 0,
      dy: 0,
    },
    paddle1: {
      y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    },
    paddle2: {
      y: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    },
    score: {
      player1: 0,
      player2: 0,
    },
    winner: null,
    isPlayer1Scoring: false,
    isPlayer2Scoring: false,
  });
  
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const resetBall = useCallback((scored: 'player1' | 'player2') => {
    setGameState(prev => ({
      ...prev,
      ball: {
        ...prev.ball,
        x: GAME_WIDTH / 2 - BALL_SIZE / 2,
        y: GAME_HEIGHT / 2 - BALL_SIZE / 2,
        dx: scored === 'player1' ? -INITIAL_BALL_SPEED_X : INITIAL_BALL_SPEED_X,
        dy: Math.random() > 0.5 ? INITIAL_BALL_SPEED_Y : -INITIAL_BALL_SPEED_Y,
      }
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...getInitialState(),
      status: GameStatus.PLAYING,
      ball: {
        ...prev.ball,
        x: GAME_WIDTH / 2 - BALL_SIZE / 2,
        y: GAME_HEIGHT / 2 - BALL_SIZE / 2,
        dx: Math.random() > 0.5 ? INITIAL_BALL_SPEED_X : -INITIAL_BALL_SPEED_X,
        dy: Math.random() > 0.5 ? INITIAL_BALL_SPEED_Y : -INITIAL_BALL_SPEED_Y,
      }
    }));
  }, []);
  
  const gameLoop = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
    }
    const deltaTime = (timestamp - lastTimeRef.current) / 1000; // time in seconds
    lastTimeRef.current = timestamp;

    if (gameState.status !== GameStatus.PLAYING) return;

    setGameState(prev => {
      // Fix: Destructure properties from a cloned previous state to avoid direct mutation.
      let { ball, paddle1, paddle2, score, status, winner } = JSON.parse(JSON.stringify(prev));

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // AI paddle movement
      const paddle2Center = paddle2.y + PADDLE_HEIGHT / 2;
      const ballCenter = ball.y + BALL_SIZE / 2;
      if (paddle2Center < ballCenter - 20) {
        paddle2.y += AI_PADDLE_SPEED;
      } else if (paddle2Center > ballCenter + 20) {
        paddle2.y -= AI_PADDLE_SPEED;
      }
      paddle2.y = Math.max(0, Math.min(paddle2.y, GAME_HEIGHT - PADDLE_HEIGHT));

      // Ball collision with top/bottom walls
      if (ball.y <= 0 || ball.y >= GAME_HEIGHT - BALL_SIZE) {
        ball.dy *= -1;
        playHitSound();
      }

      // Ball collision with paddles
      const ballMidY = ball.y + BALL_SIZE / 2;
      if (
        ball.dx < 0 &&
        ball.x <= PADDLE_WIDTH &&
        ball.x > 0 &&
        ballMidY >= paddle1.y &&
        ballMidY <= paddle1.y + PADDLE_HEIGHT
      ) {
        ball.dx *= -1.05; // Reverse and increase speed
        const deltaY = ballMidY - (paddle1.y + PADDLE_HEIGHT / 2);
        ball.dy = deltaY * 0.35;
        playHitSound();
      }

      if (
        ball.dx > 0 &&
        ball.x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        ball.x < GAME_WIDTH - BALL_SIZE &&
        ballMidY >= paddle2.y &&
        ballMidY <= paddle2.y + PADDLE_HEIGHT
      ) {
        ball.dx *= -1.05; // Reverse and increase speed
        const deltaY = ballMidY - (paddle2.y + PADDLE_HEIGHT / 2);
        ball.dy = deltaY * 0.35;
        playHitSound();
      }

      let newPlayer1Scoring = false;
      let newPlayer2Scoring = false;

      // Scoring
      if (ball.x < -BALL_SIZE) {
        score.player2++;
        newPlayer2Scoring = true;
        playScoreSound();
        if (score.player2 >= WINNING_SCORE) {
          status = GameStatus.GAMEOVER;
          winner = 'Player 2';
        } else {
          // This call was incorrect inside a `setGameState` updater function. 
          // It's better to update the ball state directly here.
          ball.x = GAME_WIDTH / 2 - BALL_SIZE / 2;
          ball.y = GAME_HEIGHT / 2 - BALL_SIZE / 2;
          ball.dx = INITIAL_BALL_SPEED_X;
          ball.dy = Math.random() > 0.5 ? INITIAL_BALL_SPEED_Y : -INITIAL_BALL_SPEED_Y;
        }
      } else if (ball.x > GAME_WIDTH) {
        score.player1++;
        newPlayer1Scoring = true;
        playScoreSound();
        if (score.player1 >= WINNING_SCORE) {
          status = GameStatus.GAMEOVER;
          winner = 'Player 1';
        } else {
          // This call was incorrect inside a `setGameState` updater function.
          // It's better to update the ball state directly here.
          ball.x = GAME_WIDTH / 2 - BALL_SIZE / 2;
          ball.y = GAME_HEIGHT / 2 - BALL_SIZE / 2;
          ball.dx = -INITIAL_BALL_SPEED_X;
          ball.dy = Math.random() > 0.5 ? INITIAL_BALL_SPEED_Y : -INITIAL_BALL_SPEED_Y;
        }
      }

      return { ...prev, ball, paddle1, paddle2, score, status, winner, isPlayer1Scoring: newPlayer1Scoring, isPlayer2Scoring: newPlayer2Scoring };
    });

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.status === GameStatus.PLAYING) {
      lastTimeRef.current = 0;
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.status]);

  useEffect(() => {
    if (gameState.isPlayer1Scoring || gameState.isPlayer2Scoring) {
      const timer = setTimeout(() => {
        setGameState(prev => ({...prev, isPlayer1Scoring: false, isPlayer2Scoring: false }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlayer1Scoring, gameState.isPlayer2Scoring]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState.status !== GameStatus.PLAYING) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const newY = (relativeY / rect.height) * GAME_HEIGHT - PADDLE_HEIGHT / 2;
    setGameState(prev => ({
      ...prev,
      paddle1: { ...prev.paddle1, y: Math.max(0, Math.min(newY, GAME_HEIGHT - PADDLE_HEIGHT)) },
    }));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState.status !== GameStatus.PLAYING) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const relativeY = touch.clientY - rect.top;
    const newY = (relativeY / rect.height) * GAME_HEIGHT - PADDLE_HEIGHT / 2;
    setGameState(prev => ({
      ...prev,
      paddle1: { ...prev.paddle1, y: Math.max(0, Math.min(newY, GAME_HEIGHT - PADDLE_HEIGHT)) },
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.PAUSED }));
  };

  const resumeGame = () => {
    setGameState(prev => ({ ...prev, status: GameStatus.PLAYING }));
  };

  const restartGame = () => {
    startGame();
  };

  const backToMenu = () => {
     setGameState(getInitialState());
  };

  return (
