"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GeneticAlgorithm, Individual } from "@/lib/genetic-algorithm";
import { GACanvas } from "@/components/visualizer/GACanvas";
import { Controls } from "@/components/visualizer/Controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { GeneticAlgorithmDocs } from "@/components/visualizer/GeneticAlgorithmDocs";
import { evaluate } from "mathjs";

const DEFAULT_MIN_X = 0;
const DEFAULT_MAX_X = 5;

export default function GeneticAlgorithmPage() {
  const [ga, setGa] = useState<GeneticAlgorithm | null>(null);
  const [population, setPopulation] = useState<Individual[]>([]);
  const [generation, setGeneration] = useState(0);
  const [bestFitness, setBestFitness] = useState(-Infinity);
  const [isRunning, setIsRunning] = useState(false);
  const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);
  const [convergedGeneration, setConvergedGeneration] = useState<number | null>(
    null
  );
  const requestRef = useRef<number | null>(null);
  const generationRef = useRef(0);

  // User Controls State
  const [functionExpression, setFunctionExpression] = useState(
    "x * sin(10 * x) + x * cos(2 * x)"
  );
  const [mutationRate, setMutationRate] = useState(0.05);
  const [populationSize, setPopulationSize] = useState(50);
  const [optimizationGoal, setOptimizationGoal] = useState<"maximize" | "minimize">("maximize");
  const [minX, setMinX] = useState(DEFAULT_MIN_X);
  const [maxX, setMaxX] = useState(DEFAULT_MAX_X);

  // Safe fitness function evaluation
  const getFitnessFunction = useCallback((expression: string) => {
    return (x: number) => {
      try {
        return evaluate(expression, { x });
      } catch (e) {
        return 0; // Fallback for invalid expression
      }
    };
  }, []);

  // Initialize GA
  const initializeGA = useCallback(() => {
    const fitnessFunc = getFitnessFunction(functionExpression);
    const gaFitnessFunction = (genes: number[]) => fitnessFunc(genes[0]);

    const newGa = new GeneticAlgorithm(
      populationSize,
      mutationRate,
      0.5, // Crossover rate
      2, // Elitism count
      1, // Gene length (1D)
      gaFitnessFunction,
      optimizationGoal === "minimize"
    );
    newGa.initializePopulation(minX, maxX);
    setGa(newGa);
    setPopulation([...newGa.population]);
    setBestFitness(newGa.getBest().fitness);
    setGeneration(0);
    generationRef.current = 0;
    setFitnessHistory([]);
    setConvergedGeneration(null);
  }, [functionExpression, mutationRate, populationSize, getFitnessFunction, optimizationGoal, minX, maxX]);

  // Update GA parameters when inputs change
  useEffect(() => {
    if (ga) {
      const fitnessFunc = getFitnessFunction(functionExpression);
      const gaFitnessFunction = (genes: number[]) => fitnessFunc(genes[0]);

      ga.fitnessFunction = gaFitnessFunction;
      ga.mutationRate = mutationRate;
      ga.minimize = optimizationGoal === "minimize";
      ga.minX = minX;
      ga.maxX = maxX;

      // Handle population resizing
      if (populationSize !== ga.populationSize) {
        const oldSize = ga.populationSize;
        ga.populationSize = populationSize;

        if (populationSize > oldSize) {
          // Add new individuals
          const diff = populationSize - oldSize;
          for (let i = 0; i < diff; i++) {
            const genes = Array.from(
              { length: 1 },
              () => Math.random() * (maxX - minX) + minX
            );
            ga.population.push({
              genes,
              fitness: gaFitnessFunction(genes),
            });
          }
        } else {
          // Truncate population
          ga.population = ga.population.slice(0, populationSize);
        }
      }

      // Re-evaluate fitness of current population with new function
      ga.population.forEach((ind) => {
        ind.fitness = gaFitnessFunction(ind.genes);
      });
      setPopulation([...ga.population]);
      setBestFitness(ga.getBest().fitness);
    }
  }, [
    functionExpression,
    mutationRate,
    populationSize,
    ga,
    getFitnessFunction,
    optimizationGoal,
    minX,
    maxX
  ]);

  // Initial setup
  useEffect(() => {
    initializeGA();
  }, []); // Run once on mount

  const evolve = useCallback(() => {
    if (!ga) return;
    ga.evolve();
    setPopulation([...ga.population]);
    generationRef.current += 1;
    setGeneration(generationRef.current);
    const currentBestFitness = ga.getBest().fitness;
    setBestFitness(currentBestFitness);

    // Convergence Check
    setFitnessHistory((prev) => {
      const newHistory = [...prev, currentBestFitness];
      if (newHistory.length > 20) {
        newHistory.shift(); // Keep last 20
      }

      if (newHistory.length >= 20) {
        const improvement = Math.abs(newHistory[newHistory.length - 1] - newHistory[0]);
        if (improvement < 0.001 && isRunningRef.current) {
          setIsRunning(false);
          setConvergedGeneration(generationRef.current);
        }
      }
      return newHistory;
    });
  }, [ga]);

  const isRunningRef = useRef(isRunning);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const animate = useCallback(() => {
    if (isRunningRef.current) {
      evolve();
      setTimeout(() => {
        if (isRunningRef.current) {
          requestRef.current = requestAnimationFrame(animate);
        }
      }, 200);
    }
  }, [evolve]);

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
    initializeGA();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Genetic Algorithm</h1>
        <p className="text-muted-foreground">
          Visualizing function optimization. The algorithm tries to find the
          optimal value (peak or valley) of the function.
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
              fitnessFunction={getFitnessFunction(functionExpression)}
              minX={minX}
              maxX={maxX}
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
          functionExpression={functionExpression}
          onFunctionChange={setFunctionExpression}
          mutationRate={mutationRate}
          onMutationRateChange={setMutationRate}
          populationSize={populationSize}
          onPopulationSizeChange={setPopulationSize}
          convergedGeneration={convergedGeneration}
          optimizationGoal={optimizationGoal}
          onOptimizationGoalChange={setOptimizationGoal}
          minX={minX}
          onMinXChange={setMinX}
          maxX={maxX}
          onMaxXChange={setMaxX}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Population Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono">{populationSize}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Mutation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono">
                {(mutationRate * 100).toFixed(0)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Function</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-sm font-mono text-muted-foreground truncate"
                title={functionExpression}
              >
                f(x) = {functionExpression}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GeneticAlgorithmDocs />
    </div>
  );
}
