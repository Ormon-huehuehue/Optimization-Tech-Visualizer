import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Image from "next/image";

export function GeneticAlgorithmDocs() {
  return (
    <div className="space-y-6 mt-12">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">How it Works</h2>
        <p className="text-muted-foreground">
          Understanding the biological inspiration behind the algorithm.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>1. Initialization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-white">
              <Image
                src="/images/init_step.png"
                alt="Initialization Step"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The algorithm starts by creating a random population of individuals (dots). Each individual represents a potential solution to the problem (an x-value on the graph).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-white">
              <Image
                src="/images/selection_step.png"
                alt="Selection Step"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Individuals are evaluated based on their fitness (y-value). The best performing individuals are more likely to be selected to become parents for the next generation.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Crossover</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-white">
              <Image
                src="/images/crossover_step.png"
                alt="Crossover Step"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Selected parents combine their genetic information to create offspring. This mimics biological reproduction, where children inherit traits from both parents.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Mutation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-white">
              <Image
                src="/images/mutation_step.png"
                alt="Mutation Step"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Random changes are introduced to some offspring. This maintains genetic diversity and prevents the algorithm from getting stuck in local optima (false peaks).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
