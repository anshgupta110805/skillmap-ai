'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  recommendCareerRoute,
  type RecommendCareerRouteOutput,
} from '@/ai/flows/recommend-career-route';

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
import { Textarea } from '@/components/ui/textarea';
import { cities, roles, experienceLevels } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
  List,
  Percent,
  Target,
  XCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const formSchema = z.object({
  skills: z.string().min(1, 'Please enter at least one skill.'),
  experienceLevel: z.enum(['entry', 'mid', 'senior']),
  city: z.string().min(1, 'Please select a city.'),
  targetRole: z.string().min(1, 'Please select a target role.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CareerPlannerPage() {
  const [result, setResult] = useState<RecommendCareerRouteOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: '',
      experienceLevel: 'entry',
      city: '',
      targetRole: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await recommendCareerRoute({
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()),
      });
      setResult(output);
    } catch (error) {
      console.error('Error getting career route:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">AI Career Planner</h1>
        <p className="text-muted-foreground">
          Get a probability-based roadmap to your dream job.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
          <CardDescription>
            Tell us about your skills, experience, and goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Python, React, SQL"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your current skills, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level} className="capitalize">
                              {level}
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
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current City</FormLabel>
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
                <FormField
                  control={form.control}
                  name="targetRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target role" />
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
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating Roadmap...' : 'Generate Roadmap'}
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
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
            </div>
        </div>
        <Separator />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
             </div>
             <div className="space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
             </div>
         </div>
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({ result }: { result: RecommendCareerRouteOutput }) {
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-2xl">
              Your Personalized Career Route
            </CardTitle>
            <CardDescription>
              The AI-generated plan to help you achieve your career goals.
            </CardDescription>
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
                <p>This is the AI's confidence in its overall assessment, based on the quality of available data and the predictability of the market.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                    <Target className="size-6 text-primary" />
                    <CardTitle className="text-lg font-headline">Eligible Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {result.eligibleRoles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-base">{role}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                    <Clock className="size-6 text-primary" />
                    <CardTitle className="text-lg font-headline">Time-to-Job Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{result.timeToJobEstimate}</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                    <Percent className="size-6 text-primary" />
                    <CardTitle className="text-lg font-headline">Placement Probability</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{(result.placementProbability * 100).toFixed(0)}%</p>
                     <p className="text-xs text-muted-foreground">After acquiring needed skills.</p>
                </CardContent>
            </Card>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    <XCircle className="size-5 text-destructive" />
                    Missing Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill) => (
                        <Badge key={skill} variant="destructive">{skill}</Badge>
                    ))}
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    Learning Priority
                </h3>
                <div className="flex flex-wrap gap-2">
                    {result.priorityLearningOrder.map((skill, index) => (
                        <Badge key={skill} className="bg-primary/20 text-primary-foreground hover:bg-primary/30">
                            <span className="mr-2 font-bold">{index + 1}.</span> {skill}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>

         <Separator />

        <div>
            <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                <List className="size-5 text-primary" />
                Free Learning Resources
            </h3>
            <ul className="mt-4 space-y-2 list-disc pl-5">
                {result.freeLearningLinks.map((link, index) => (
                    <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            {new URL(link).hostname}
                            <ExternalLink className="size-3" />
                        </a>
                    </li>
                ))}
            </ul>
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

    