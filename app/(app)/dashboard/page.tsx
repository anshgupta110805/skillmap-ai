'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cities, skillDemand, skillTrendData } from '@/lib/data';
import { TopSkillsChart } from '@/components/charts/top-skills-chart';
import { SkillDemandChart } from '@/components/charts/skill-demand-chart';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { SkillTrendChart } from '@/components/charts/skill-trend-chart';
import { detectSkillAnomalies, type DetectSkillAnomaliesOutput } from '@/ai/flows/detect-skill-anomalies';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SkillShockAlerts() {
  const [result, setResult] = useState<DetectSkillAnomaliesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAnomalies() {
      setIsLoading(true);
      try {
        const output = await detectSkillAnomalies({ trends: skillTrendData });
        setResult(output);
      } catch (error) {
        console.error('Error detecting skill anomalies:', error);
        setResult({ anomalies: [] });
      } finally {
        setIsLoading(false);
      }
    }
    getAnomalies();
  }, []);

  const getIcon = (type: 'spike' | 'drop' | 'emerging' | 'divergence' | 'declining') => {
    switch (type) {
      case 'spike':
        return <TrendingUp className="size-5 text-destructive" />;
      case 'drop':
        return <TrendingDown className="size-5 text-green-500" />;
      case 'emerging':
        return <Zap className="size-5 text-primary" />;
      case 'divergence':
          return <AlertTriangle className="size-5 text-amber-500" />;
      case 'declining':
        return <TrendingDown className="size-5 text-green-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-28 rounded-lg" />
        </div>
      </div>
    );
  }
  
  if (!result || result.anomalies.length === 0) {
    return (
       <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Significant Shocks Detected</AlertTitle>
          <AlertDescription>
            The skill market is currently stable. The AI agent will continue to monitor for changes.
          </AlertDescription>
        </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {result.anomalies.map((anomaly, index) => (
        <Alert key={index} className={anomaly.type === 'divergence' ? "border-amber-500/50 text-amber-500 [&>svg]:text-amber-500" : ""}>
          {getIcon(anomaly.type)}
          <AlertTitle className="ml-7 font-headline flex items-center gap-4">
            {anomaly.skill}
            <Badge variant={anomaly.type === 'drop' || anomaly.type === 'declining' ? 'secondary' : 'destructive'}>{anomaly.change}</Badge>
          </AlertTitle>
          <AlertDescription className="ml-7">
            {anomaly.explanation}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}


export default function DashboardPage() {
  const topSkills = [...skillDemand]
    .sort((a, b) => b.demandCount - a.demandCount)
    .slice(0, 5);

  const skillDeficit = skillDemand
    .map((s) => ({
      ...s,
      deficit: s.demandCount - s.supplyCount,
    }))
    .sort((a, b) => b.deficit - a.deficit);

  const highDeficitSkills = skillDeficit.filter((s) => s.deficit > 0).slice(0, 5);
  const oversupplySkills = skillDeficit
    .filter((s) => s.deficit < 0)
    .reverse()
    .slice(0, 5);
  
  const uniqueSkills = [...new Set(skillDemand.map(s => s.skillName))].slice(0,5);
  const cityNames = cities.map(c => c.name);

  const skillDemandByCityData = uniqueSkills.map(skill => {
    const skillData: {[key: string]: string | number} = { skillName: skill };
    cityNames.forEach(city => {
        const demand = skillDemand.find(sd => sd.skillName === skill && sd.cityName === city);
        skillData[city] = demand ? demand.demandCount : 0;
    });
    return skillData;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of the current skills landscape.
        </p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-accent">Skill Shock Alerts</CardTitle>
          <CardDescription>
            The AI agent has detected these significant shifts in the job market.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SkillShockAlerts />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">
              Skill Demand by City
            </CardTitle>
            <CardDescription>
              Comparing demand for top skills across major cities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillDemandChart data={skillDemandByCityData} cities={cityNames} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Top Skills in Demand</CardTitle>
            <CardDescription>
              The most sought-after skills across all industries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopSkillsChart data={topSkills} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-destructive">
              Critical Skill Shortages
            </CardTitle>
            <CardDescription>
              High demand, low supply. Major opportunities for growth.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Deficit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highDeficitSkills.map((s) => (
                  <TableRow key={`${s.skillName}-${s.cityName}`}>
                    <TableCell className="font-medium">{s.skillName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.cityName}</Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end items-center gap-2">
                      {s.deficit}
                      <ArrowUp className="size-4 text-destructive" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-green-500">
              Oversaturated Skills
            </CardTitle>
            <CardDescription>
              Low demand, high supply. Highly competitive fields.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-right">Surplus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {oversupplySkills.map((s) => (
                  <TableRow key={`${s.skillName}-${s.cityName}`}>
                    <TableCell className="font-medium">{s.skillName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{s.cityName}</Badge>
                    </TableCell>
                    <TableCell className="text-right flex justify-end items-center gap-2">
                      {Math.abs(s.deficit)}
                      <ArrowDown className="size-4 text-green-500" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle className="font-headline">Future Demand Predictor (6-Month Forecast)</CardTitle>
            <CardDescription>
              Simulated demand trends for rising vs. saturating skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillTrendChart data={skillTrendData} />
          </CardContent>
        </Card>
    </div>
  );
}

    