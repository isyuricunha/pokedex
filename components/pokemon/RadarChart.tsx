'use client';

import { useEffect, useRef } from 'react';

interface RadarChartProps {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  size?: number;
}

export default function RadarChart({ stats, size = 300 }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.4;
    const maxStat = 255; // Max stat value in Pokemon

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Data points
    const statValues = [
      stats.hp,
      stats.attack,
      stats.defense,
      stats.spAttack,
      stats.spDefense,
      stats.speed,
    ];

    const labels = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

    // Draw background hexagon (grid)
    const levels = 5;
    for (let level = 1; level <= levels; level++) {
      const radius = (maxRadius / levels) * level;
      
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axes
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw labels
      const labelRadius = maxRadius + 20;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw stat polygon
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const statValue = statValues[i % 6];
      const radius = (statValue / maxStat) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    // Fill
    ctx.fillStyle = 'rgba(255, 140, 0, 0.3)';
    ctx.fill();

    // Stroke
    ctx.strokeStyle = '#FF8C00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw stat points
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const statValue = statValues[i];
      const radius = (statValue / maxStat) * maxRadius;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FF8C00';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [stats, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto"
    />
  );
}
