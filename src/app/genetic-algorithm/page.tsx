"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GeneticAlgorithm, Individual } from "@/lib/genetic-algorithm";
import { GACanvas } from "@/components/visualizer/GACanvas";
import { Controls } from "@/components/visualizer/Controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Define the fitness function (1D optimization)
// f(x) = x * sin(10 * x) + x * cos(2 * x) in range [0, 5]
const MIN_X = 0;
const MAX_X = 5;
const fitnessFunction = (x: number) => x * Math.sin(10 * x) + x * Math.cos(2 * x);
// Wrapper for GA which expects array of genes
const gaFitnessFunction = (genes: number[]) => fitnessFunction(genes[0]);

export default function GeneticAlgorithmPage() {
  const [ga, setGa] = useState<GeneticAlgorithm | null>(null);
  const [population, setPopulation] = useState<Individual[]>([]);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(-Infinity);
  const [isRunning, setIsRunning] = useState(false);
  const requestRef = useRef<number | null>(null);

  // Initialize GA
  useEffect(() => {
    const newGa = new GeneticAlgorithm(
      50,    // Population size
      0.05,  // Mutation rate
      0.5,   // Crossover rate
      2,     // Elitism count
      1,     // Gene length (1D)
      gaFitnessFunction
    );
    newGa.initializePopulation(MIN_X, MAX_X);
    setGa(newGa);
    setPopulation([...newGa.population]);
    setBestFitness(newGa.getBest().fitness);
  }, []);

  const evolve = useCallback(() => {
    if (!ga) return;
    ga.evolve();
    setPopulation([...ga.population]);
    setGeneration((g) => g + 1);
    setBestFitness(ga.getBest().fitness);
  }, [ga]);

  const animate = useCallback(() => {
    if (isRunning) {
      evolve();
      // Slow down animation slightly for visibility
      setTimeout(() => {
          requestRef.current = requestAnimationFrame(animate);
      }, 50); 
    }
  }, [isRunning, evolve]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, animate]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    if (ga) {
      ga.initializePopulation(MIN_X, MAX_X);
      setPopulation([...ga.population]);
      setGeneration(0);
      setBestFitness(ga.getBest().fitness);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Genetic Algorithm</h1>
        <p className="text-muted-foreground">
          Visualizing function optimization. The algorithm tries to find the maximum value (peak) of the function.
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <GACanvas
              population={population}
              generation={generation}
              bestFitness={bestFitness}
              fitnessFunction={fitnessFunction}
              minX={MIN_X}
              maxX={MAX_X}
            />
          </CardContent>
        </Card>

        <Controls
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
          generation={generation}
          bestFitness={bestFitness}
        />

        <div className="grid gap-4 md:grid-cols-3">
           <Card>
            <CardHeader>
                <CardTitle className="text-sm">Population Size</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-mono">50</div>
            </CardContent>
           </Card>
           <Card>
            <CardHeader>
                <CardTitle className="text-sm">Mutation Rate</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-mono">5%</div>
            </CardContent>
           </Card>
           <Card>
            <CardHeader>
                <CardTitle className="text-sm">Function</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-mono text-muted-foreground">
                    f(x) = x·sin(10x) + x·cos(2x)
                </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
