# Algorithm Visualizer

A web-based visualizer for optimization algorithms, built with Next.js and TypeScript.

## Features

- **Genetic Algorithm**: Visualize how a population evolves to find the maximum of a function.
  - Interactive controls for population size, mutation rate, and custom functions.
  - Real-time visualization of the population on the function curve.
  - Detailed explanation of the process with visual aids.

## Genetic Algorithm Theory

The Genetic Algorithm is inspired by the process of natural selection.

1. **Initialization**: A random population of potential solutions is created.
2. **Selection**: Individuals are evaluated based on a fitness function. The fittest individuals are selected to reproduce.
3. **Crossover**: Selected parents combine their genetic information to create offspring.
4. **Mutation**: Random changes are introduced to offspring to maintain diversity.
5. **Termination**: The process repeats for a number of generations or until a solution is found.

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
