'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  skillGraphIntelligence,
  type SkillGraphIntelligenceOutput,
} from '@/ai/flows/skill-graph-intelligence';
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
import { skills } from '@/lib/data';
import { ArrowRight, GitGraph, Share2, Telescope } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  skill: z.string().min(1, 'Please select a skill to explore.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillGraphPage() {
  const [result, setResult] = useState<SkillGraphIntelligenceOutput | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setSelectedSkill(values.skill);
    try {
      const output = await skillGraphIntelligence(values);
      setResult(output);
    } catch (error) {
      console.error('Error getting skill graph:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Skill Graph Intelligence
        </h1>
        <p className="text-muted-foreground">
          Explore the hidden relationships between skills, roles, and
          industries.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Explore a Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skill"
                render={({ field }) => (
                  <FormItem className="max-w-sm">
                    <FormLabel>Select a skill</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {skills.map((skill) => (
                          <SelectItem key={skill.name} value={skill.name}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Explore Connections'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <LoadingSkeleton />}
      {result && <ResultsDisplay result={result} skill={selectedSkill} />}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({
  result,
  skill,
}: {
  result: SkillGraphIntelligenceOutput;
  skill: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <GitGraph className="text-primary" /> Skill Graph: {skill}
        </CardTitle>
        <CardDescription>
          AI-generated insights into the skill ecosystem.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-4">
            <Share2 className="text-primary" /> Direct Relationships
          </h3>
          <div className="space-y-4">
            {result.directRelationships.map((rel, index) => (
              <Card key={index} className="bg-background/50">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <Badge className="text-base">{skill}</Badge>
                  <span className="text-muted-foreground text-sm italic">{rel.relationship}</span>
                  <Badge variant="secondary" className="text-base">{rel.skill}</Badge>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{rel.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 mb-4">
            <Telescope className="text-primary" /> Indirect Opportunities
          </h3>
           <div className="space-y-4">
            {result.indirectOpportunities.map((opp, index) => (
              <Card key={index} className="bg-background/50">
                <CardHeader>
                    <CardTitle className="text-xl font-headline">{opp.opportunity}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{opp.reasoning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
