'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  extractSkillsFromJobDescription,
  type ExtractSkillsFromJobDescriptionOutput,
} from '@/ai/flows/extract-skills-from-job-description';

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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  jobDescription: z
    .string()
    .min(50, 'Please enter a job description of at least 50 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function SkillExtractorPage() {
  const [result, setResult] =
    useState<ExtractSkillsFromJobDescriptionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const output = await extractSkillsFromJobDescription({
        jobDescription: values.jobDescription,
      });
      setResult(output);
    } catch (error) {
      console.error('Error extracting skills:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Skill Extractor</h1>
        <p className="text-muted-foreground">
          Automatically identify key skills from any job description.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Paste the job description below
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., We are looking for a software engineer with experience in React, Node.js, and AWS..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Extracting...' : 'Extract Skills'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Extracted Skills</CardTitle>
            <CardDescription>
              Skills identified by the AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-36 rounded-full" />
              </div>
            )}
            {result && result.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill) => (
                  <Badge key={skill} className="text-base px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
             {result && result.skills.length === 0 && (
                <p className="text-muted-foreground">No skills were extracted. Try a different job description.</p>
             )}
            {!isLoading && !result && (
              <p className="text-muted-foreground">
                Results will appear here.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
