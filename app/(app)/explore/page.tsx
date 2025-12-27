import {
  ArrowRight,
  BrainCircuit,
  Compass,
  GitGraph,
  Landmark,
  Map,
  MoveRight,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tools = [
  {
    icon: <Sparkles className="size-6 text-primary" />,
    title: 'Skill Extractor',
    description: 'Analyze a job description to identify the key skills required.',
    href: '/skill-extractor',
    cta: 'Extract Skills',
  },
  {
    icon: <BrainCircuit className="size-6 text-primary" />,
    title: 'AI Career Planner',
    description:
      'Get a probability-based roadmap to your dream job with confidence scores.',
    href: '/career-planner',
    cta: 'Plan Your Career',
  },
  {
    icon: <Map className="size-6 text-primary" />,
    title: 'City Intelligence',
    description: 'Compare salary, cost of living, and job opportunities across cities.',
    href: '/city-intelligence',
    cta: 'Compare Cities',
  },
  {
    icon: <MoveRight className="size-6 text-primary" />,
    title: 'Migration Assistant',
    description: 'Find out which skills can maximize your salary in a new city.',
    href: '/migration-assistant',
    cta: 'Analyze Opportunities',
  },
  {
    icon: <Users className="size-6 text-primary" />,
    title: 'Migration Simulator',
    description: 'Run "what-if" scenarios to see the impact of workforce migration on cities.',
    href: '/migration-simulator',
    cta: 'Run Simulation',
  },
  {
    icon: <GitGraph className="size-6 text-primary" />,
    title: 'Skill Graph Explorer',
    description: 'Visualize how skills, roles, and industries are interconnected.',
    href: '/skill-graph',
    cta: 'Explore Graph',
  },
  {
    icon: <Landmark className="size-6 text-primary" />,
    title: 'Institutional Policy Advisor',
    description: 'Generate AI-driven policy recommendations for government and education.',
    href: '/policy-advisor',
    cta: 'Get Advice',
  },
  {
    icon: <Users className="size-6 text-primary" />,
    title: 'Workforce Digital Twin',
    description: 'Access a dynamic digital model of a city\'s entire workforce.',
    href: '/workforce-twin',
    cta: 'View Twin',
  },
];

export default function ExplorePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Compass className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">
            Explore Your Career Path
          </h1>
          <p className="text-muted-foreground">
            A guided tour through the powerful tools of SkillMapper AI.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Card key={tool.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              {tool.icon}
              <CardTitle className="font-headline text-xl">
                {tool.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground mb-4">{tool.description}</p>
              <Button asChild className="mt-auto w-fit">
                <Link href={tool.href}>
                  {tool.cta} <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
