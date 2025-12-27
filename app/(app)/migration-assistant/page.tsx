'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  skillMigrationAssistant,
  type SkillMigrationAssistantOutput,
} from '@/ai/flows/skill-migration-assistant';

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
import { cities } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BarChart,
  Briefcase,
  DollarSign,
  MapPin,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  city: z.string().min(1, 'Please select a city.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function MigrationAssistantPage() {
  const [result, setResult] = useState<SkillMigrationAssistantOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setSelectedCity(values.city);
    try {
      const output = await skillMigrationAssistant({
        city: values.city,
      });
      setResult(output);
    } catch (error) {
      console.error('Error getting migration assistance:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Skill Migration Assistant
        </h1>
        <p className="text-muted-foreground">
          Considering a move? Find out which skills will maximize your salary.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Select a Destination</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a city to explore" />
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Analyze Opportunity'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {result && <ResultsDisplay result={result} city={selectedCity} />}
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
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    );
}

function ResultsDisplay({
  result,
  city,
}: {
  result: SkillMigrationAssistantOutput;
  city: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <MapPin className="text-primary" /> Opportunity Analysis: {city}
        </CardTitle>
        <CardDescription>
          AI-generated insights to guide your career move.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard
            icon={<Briefcase />}
            title="Top Roles"
            content={result.topRoles.join(', ')}
          />
          <InfoCard
            icon={<DollarSign />}
            title="Salary Range"
            content={result.salaryRange}
            className="text-green-600 font-semibold"
          />
          <InfoCard
            icon={<BarChart />}
            title="Competition Level"
            content={result.competitionLevel}
          />
        </div>

        <div>
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-4">
            <Sparkles className="text-primary" /> Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-base">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-2">
            <TrendingUp className="text-primary" /> 3-6 Month Roadmap
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>View the learning roadmap</AccordionTrigger>
              <AccordionContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {result.roadmap}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard({
  icon,
  title,
  content,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  className?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
        <div className="text-primary">{icon}</div>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-lg ${className}`}>{content}</p>
      </CardContent>
    </Card>
  );
}
