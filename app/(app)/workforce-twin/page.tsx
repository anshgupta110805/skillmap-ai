'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cities, skillDemand, skillTrendData } from '@/lib/data';
import { SkillDemandChart } from '@/components/charts/skill-demand-chart';
import { SkillTrendChart } from '@/components/charts/skill-trend-chart';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function WorkforceTwinPage() {
  const [selectedCity, setSelectedCity] = useState(cities[0].name);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  const citySkillDemand = skillDemand.filter(
    (sd) => sd.cityName === selectedCity
  );

  const topSkills = [...citySkillDemand]
    .sort((a, b) => b.demandCount - a.demandCount)
    .slice(0, 5);

  const skillDeficit = citySkillDemand
    .map((s) => ({
      ...s,
      deficit: s.demandCount - s.supplyCount,
    }))
    .sort((a, b) => b.deficit - a.deficit);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Users className="size-8 text-primary" /> Workforce Digital Twin
          </h1>
          <p className="text-muted-foreground">
            A dynamic digital model of a city's workforce.
          </p>
        </div>
        <Select onValueChange={handleCityChange} defaultValue={selectedCity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="font-headline">
              Workforce Summary: {selectedCity}
            </CardTitle>
            <CardDescription>
              Current state, predicted evolution, and shock response analysis.
            </CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills in Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead className="text-right">Demand</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSkills.map((s) => (
                      <TableRow key={s.skillName}>
                        <TableCell className="font-medium">
                          {s.skillName}
                        </TableCell>
                        <TableCell className="text-right">
                          {s.demandCount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skill Gaps (Demand vs. Supply)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Skill</TableHead>
                      <TableHead className="text-right">Gap</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skillDeficit.slice(0, 5).map((s) => (
                      <TableRow key={s.skillName}>
                        <TableCell className="font-medium">
                          {s.skillName}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold ${
                            s.deficit > 0
                              ? 'text-destructive'
                              : 'text-green-600'
                          }`}
                        >
                          {s.deficit > 0 ? `+${s.deficit}` : s.deficit}
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
              <CardTitle>Future Demand Predictor</CardTitle>
              <CardDescription>
                Simulated 6-month forecast for key skill categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillTrendChart data={skillTrendData} />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
