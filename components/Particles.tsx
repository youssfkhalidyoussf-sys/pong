
import React, { useEffect, useState } from 'react';
import { GAME_HEIGHT } from '../constants';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  opacity: number;
  color: string;
}

interface ParticlesProps {
  count: number;
  targetX: number;
}

const colors = ['#0ff', '#f0f', '#ff0'];

const Particles: React.FC<ParticlesProps> = ({ count, targetX }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: targetX,
        y: Math.random() * GAME_HEIGHT,
        size: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 12 * (targetX === 0 ? 1 : -1),
        vy: (Math.random() - 0.5) * 12,
        opacity: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);
  }, [count, targetX]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setParticles(prevParticles =>
        prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            opacity: p.opacity - 0.02,
          }))
          .filter(p => p.opacity > 0)
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 5px ${p.color}, 0 0 10px ${p.color}`,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </>
  );
};

export default Particles;
