"use client";

import { useEffect, useRef } from "react";
import { Individual } from "@/lib/genetic-algorithm";

interface GACanvasProps {
  population: Individual[];
  generation: number;
  bestFitness: number;
  fitnessFunction: (x: number) => number;
  minX: number;
  maxX: number;
}

export function GACanvas({
  population,
  generation,
  bestFitness,
  fitnessFunction,
  minX,
  maxX,
}: GACanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = "#fafafa";
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        ctx.fillStyle = "#171717";
    }
    ctx.fillRect(0, 0, width, height);

    // Draw function curve
    ctx.beginPath();
    ctx.strokeStyle = "#a3a3a3";
    ctx.lineWidth = 2;

    const step = (maxX - minX) / width;
    let first = true;
    
    // Find min/max Y for scaling
    let minY = Infinity;
    let maxY = -Infinity;
    for (let x = minX; x <= maxX; x += step) {
        const y = fitnessFunction(x);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }
    
    // Add some padding to Y range
    const yRange = maxY - minY;
    const padding = yRange * 0.1;
    const effectiveMinY = minY - padding;
    const effectiveMaxY = maxY + padding;

    const mapX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const mapY = (y: number) => height - ((y - effectiveMinY) / (effectiveMaxY - effectiveMinY)) * height;

    for (let x = minX; x <= maxX; x += step) {
      const y = fitnessFunction(x);
      const canvasX = mapX(x);
      const canvasY = mapY(y);
      
      if (first) {
        ctx.moveTo(canvasX, canvasY);
        first = false;
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    }
    ctx.stroke();

    // Draw population
    population.forEach((ind) => {
      const x = ind.genes[0]; // Assuming 1D gene
      const y = fitnessFunction(x); // Calculate current fitness for visualization
      
      const cx = mapX(x);
      const cy = mapY(y);

      ctx.beginPath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"; // Semi-transparent black
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
         ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      }
      
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw best individual highlight
    if (population.length > 0) {
        // Find best in current population based on CURRENT fitness function
        let currentBest = population[0];
        let maxFitness = fitnessFunction(currentBest.genes[0]);
        
        for(const p of population) {
            const f = fitnessFunction(p.genes[0]);
            if(f > maxFitness) {
                maxFitness = f;
                currentBest = p;
            }
        }
        
        const bx = mapX(currentBest.genes[0]);
        const by = mapY(maxFitness);
        
        ctx.beginPath();
        ctx.strokeStyle = "#f97316"; 
        ctx.lineWidth = 2;
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.stroke();
    }

  }, [population, generation, bestFitness, fitnessFunction, minX, maxX]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-[400px] rounded-lg border border-border bg-card shadow-sm"
    />
  );
}
