export interface Individual {
  genes: number[];
  fitness: number;
}

export class GeneticAlgorithm {
  population: Individual[];
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
  geneLength: number;
  fitnessFunction: (genes: number[]) => number;
  minimize: boolean;
  minX: number = 0;
  maxX: number = 1;

  constructor(
    populationSize: number,
    mutationRate: number,
    crossoverRate: number,
    elitismCount: number,
    geneLength: number,
    fitnessFunction: (genes: number[]) => number,
    minimize: boolean = false
  ) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.elitismCount = elitismCount;
    this.geneLength = geneLength;
    this.fitnessFunction = fitnessFunction;
    this.minimize = minimize;
    this.population = [];
  }

  initializePopulation(min: number = 0, max: number = 1) {
    this.minX = min;
    this.maxX = max;
    this.population = [];
    for (let i = 0; i < this.populationSize; i++) {
      const genes = Array.from({ length: this.geneLength }, () => Math.random() * (max - min) + min);
      this.population.push({
        genes,
        fitness: this.fitnessFunction(genes),
      });
    }
  }

  evolve() {
    // Sort by fitness
    this.population.sort((a, b) => {
        return this.minimize ? a.fitness - b.fitness : b.fitness - a.fitness;
    });

    const newPopulation: Individual[] = [];

    // Elitism
    for (let i = 0; i < this.elitismCount; i++) {
      newPopulation.push({ ...this.population[i] });
    }

    // Generate rest of population
    while (newPopulation.length < this.populationSize) {
      const parent1 = this.tournamentSelection();
      const parent2 = this.tournamentSelection();

      let offspring = this.crossover(parent1, parent2);
      this.mutate(offspring);

      offspring.fitness = this.fitnessFunction(offspring.genes);
      newPopulation.push(offspring);
    }

    this.population = newPopulation;
  }

  private tournamentSelection(tournamentSize: number = 3): Individual {
    let best: Individual | null = null;
    for (let i = 0; i < tournamentSize; i++) {
      const ind = this.population[Math.floor(Math.random() * this.populationSize)];
      if (!best) {
        best = ind;
      } else if (this.minimize) {
        if (ind.fitness < best.fitness) best = ind;
      } else {
        if (ind.fitness > best.fitness) best = ind;
      }
    }
    return best!;
  }

  private crossover(parent1: Individual, parent2: Individual): Individual {
    if (Math.random() > this.crossoverRate) {
      return { genes: [...parent1.genes], fitness: 0 };
    }

    const genes: number[] = [];
    // Uniform crossover or single point? Let's do simple arithmetic crossover for continuous values
    // or uniform crossover. Let's do uniform for now.
    for (let i = 0; i < this.geneLength; i++) {
      genes.push(Math.random() < 0.5 ? parent1.genes[i] : parent2.genes[i]);
    }
    return { genes, fitness: 0 };
  }

  private mutate(individual: Individual) {
    for (let i = 0; i < this.geneLength; i++) {
      if (Math.random() < this.mutationRate) {
        // Add small random noise for continuous values
        // Add small random noise for continuous values
        individual.genes[i] += (Math.random() - 0.5) * 0.5; // Mutation step size
        
        // Clamp to bounds
        individual.genes[i] = Math.max(this.minX, Math.min(this.maxX, individual.genes[i]));
      }
    }
  }
  
  getBest(): Individual {
    return this.population.reduce((prev, current) => {
        if (this.minimize) {
            return (prev.fitness < current.fitness) ? prev : current;
        }
        return (prev.fitness > current.fitness) ? prev : current;
    });
  }
}
