'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, BrainCircuit, Map, Telescope } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/types';
import placeholderData from '@/lib/placeholder-images.json';
import { Logo } from '@/components/logo';

const featureCards = [
  {
    icon: <Map className="size-8 text-primary" />,
    title: 'Skills Heatmap',
    description: 'Visualize real-time demand for skills across different cities and industries.',
    imageId: 'feature-heatmap',
  },
  {
    icon: <Telescope className="size-8 text-primary" />,
    title: 'Skill Shortage Engine',
    description: 'Identify critical skill shortages and oversupply to make strategic career moves.',
    imageId: 'feature-shortage',
  },
  {
    icon: <BrainCircuit className="size-8 text-primary" />,
    title: 'AI Career Planner',
    description: 'Get personalized career route recommendations based on your unique profile.',
    imageId: 'feature-planner',
  },
];

export default function Home() {
  const images: ImagePlaceholder[] = placeholderData.placeholderImages;
  const heroImage = images.find((img) => img.id === 'hero-landing');
  const [year, setYear] = useState<number | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setYear(new Date().getFullYear());
    
    // Check if user is authenticated but hasn't completed onboarding
    if (isAuthenticated) {
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      if (!hasCompletedOnboarding) {
        router.push('/onboarding');
      } else {
        // If user is authenticated and has completed onboarding, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, router]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            SkillMapper AI
          </h1>
        </div>
        <Button asChild>
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
             />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
           <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                Navigate Your Career with Data-Driven Intelligence
              </h2>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
                SkillMapper AI analyzes millions of job postings to provide
                unparalleled insights into skill demand, salary benchmarks, and
                personalized career paths. Stop guessing, start planning.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
                  <Link href="/explore">
                    Explore Your Career Path
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-card border-y">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold font-headline">
                From Insight to foresight
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                SkillMapper AI offers a suite of tools to empower your career decisions.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((feature) => {
                const featureImage = images.find(
                  (img) => img.id === feature.imageId
                );
                return (
                  <Card key={feature.title} className="flex flex-col overflow-hidden">
                    {featureImage && (
                        <div className="aspect-video relative">
                            <Image
                                src={featureImage.imageUrl}
                                alt={featureImage.description}
                                fill
                                className="object-cover"
                                data-ai-hint={featureImage.imageHint}
                            />
                        </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {feature.icon}
                        <CardTitle className="font-headline text-2xl">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {year !== null ? year : new Date().getFullYear()} SkillMapper AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
