'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  policyAdvisor,
  type PolicyAdvisorOutput,
} from '@/ai/flows/policy-advisor';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cities } from '@/lib/data';
import { HelpCircle, Landmark, Lightbulb, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const formSchema = z.object({
  region: z.string().min(1, 'Please select a region.'),
  goal: z.string().min(1, 'Please specify a goal.'),
});

type FormValues = z.infer<typeof formSchema>;

const goals = [
  'Boost tech sector growth',
  'Reduce youth unemployment',
  'Improve workforce competitiveness',
  'Attract foreign investment',
];

export default function PolicyAdvisorPage() {
  const [result, setResult] = useState<PolicyAdvisorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      region: '',
      goal: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await policyAdvisor(values);
      setResult(output);
    } catch (error) {
      console.error('Error getting policy advice:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Institutional Policy Advisor
        </h1>
        <p className="text-muted-foreground">
          Generate AI-driven policy recommendations for government and
          education.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Request Policy Advice</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
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
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Goal</FormLabel>
                       <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a primary goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goals.map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating Advice...' : 'Get Policy Advice'}
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
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({ result }: { result: PolicyAdvisorOutput }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Landmark className="text-primary" /> Policy Recommendations
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                  <HelpCircle className="size-4" />
                  <span>Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>The AI's confidence in its recommendations based on available data and trend analysis.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" className="w-full space-y-4">
          {result.recommendations.map((rec, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg px-4">
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{rec.recommendation}</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-4 text-muted-foreground">
                    <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1"><Lightbulb className="size-4"/>Rationale</h4>
                        <p>{rec.rationale}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1"><ListChecks className="size-4"/>Implementation Steps</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            {rec.implementationSteps.map((step, i) => <li key={i}>{step}</li>)}
                        </ul>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Show AI Reasoning</AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{result.explanation}</p>
              </AccordionContent>
            </AccordionItem>
        </Accordion>

      </CardContent>
    </Card>
  );
}
