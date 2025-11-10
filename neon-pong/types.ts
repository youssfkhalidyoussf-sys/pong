
export enum GameStatus {
  START = 'start',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAMEOVER = 'gameover',
}

export interface BallState {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface PaddleState {
  y: number;
}

export interface ScoreState {
  player1: number;
  player2: number;
}

export interface GameState {
  status: GameStatus;
  ball: BallState;
  paddle1: PaddleState;
  paddle2: PaddleState;
  score: ScoreState;
  winner: string | null;
  isPlayer1Scoring: boolean;
  isPlayer2Scoring: boolean;
}
