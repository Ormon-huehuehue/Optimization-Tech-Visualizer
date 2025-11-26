"use client";


import { Play, Pause, RotateCcw, Settings2 } from "lucide-react";

// I'll create a simple Button component here since I haven't created a reusable one yet
// Actually, I should create a reusable Button component in ui/button.tsx first.
// But for now, I'll inline the button styles or use standard HTML buttons with classes.
// Let's stick to "production ready" and create a Button component.

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  generation: number;
  bestFitness: number;
  functionExpression: string;
  onFunctionChange: (value: string) => void;
  mutationRate: number;
  onMutationRateChange: (value: number) => void;
  populationSize: number;
  onPopulationSizeChange: (value: number) => void;
  convergedGeneration: number | null;
}

export function Controls({
  isRunning,
  onStart,
  onStop,
  onReset,
  generation,
  bestFitness,
  functionExpression,
  onFunctionChange,
  mutationRate,
  onMutationRateChange,
  populationSize,
  onPopulationSizeChange,
  convergedGeneration,
}: ControlsProps) {
  return (
    <div className="flex flex-col space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={isRunning ? onStop : onStart}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </button>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Generation</span>
            <span className="font-bold font-mono">{generation}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Best Fitness</span>
            <span className="font-bold font-mono">{bestFitness.toFixed(4)}</span>
          </div>
          {convergedGeneration !== null && (
            <div className="flex flex-col text-orange-500 animate-pulse">
              <span className="text-sm font-medium">Converged at</span>
              <span className="font-bold font-mono">Gen {convergedGeneration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 pt-4">
        <div className="flex flex-col space-y-6">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Population Size ({populationSize})
          </label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={populationSize}
            onChange={(e) => onPopulationSizeChange(parseInt(e.target.value))}
            className="w-full cursor-pointer accent-primary"
            disabled={isRunning}
          />
        </div>
        <div className="flex flex-col space-y-6">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Mutation Rate ({mutationRate})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mutationRate}
            onChange={(e) => onMutationRateChange(parseFloat(e.target.value))}
            className="w-full cursor-pointer accent-primary"
            disabled={isRunning}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Function f(x)
          </label>
          <input
            type="text"
            value={functionExpression}
            onChange={(e) => onFunctionChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="x * sin(10 * x)"
            disabled={isRunning}
          />
        </div>
      </div>
    </div>
  );
}
