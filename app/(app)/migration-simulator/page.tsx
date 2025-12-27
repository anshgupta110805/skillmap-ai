'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  migrationSimulator,
  type MigrationSimulatorOutput,
} from '@/ai/flows/migration-simulator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cities, roles } from '@/lib/data';
import { AlertCircle, ArrowRight, HelpCircle, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  sourceCity: z.string().min(1, 'Please select a source city.'),
  destinationCity: z.string().min(1, 'Please select a destination city.'),
  role: z.string().min(1, 'Please select a role.'),
  migrationPercentage: z.array(z.number()).min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function MigrationSimulatorPage() {
  const [result, setResult] = useState<MigrationSimulatorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      migrationPercentage: [20],
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await migrationSimulator({
        ...values,
        migrationPercentage: values.migrationPercentage[0],
      });
      setResult(output);
    } catch (error) {
      console.error('Error running migration simulation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Multi-City Skill Migration Simulator
        </h1>
        <p className="text-muted-foreground">
          Run "what-if" scenarios to understand the impact of workforce
          migration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Simulation Parameters</CardTitle>
          <CardDescription>
            Define the scenario you want to simulate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="sourceCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center items-center pt-8">
                    <ArrowRight className="size-6 text-muted-foreground"/>
                </div>
                <FormField
                  control={form.control}
                  name="destinationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination City</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Migrating Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="migrationPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Migration Percentage: {field.value?.[0]}%
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={100}
                          step={1}
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {result && <ResultsDisplay result={result} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({ result }: { result: MigrationSimulatorOutput }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Simulation Results</CardTitle>
              <CardDescription>{result.simulationSummary}</CardDescription>
            </div>
            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                  <HelpCircle className="size-4" />
                  <span>Confidence: {(result.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This is the AI's confidence in its simulation, based on market predictability and data assumptions.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Source City Impact</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.sourceCityImpact}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Destination City Impact</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.destinationCityImpact}</p>
                </CardContent>
            </Card>
        </div>
        <Separator />
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Show AI Reasoning</AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{result.reasoning}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      </CardContent>
    </Card>
  );
}
