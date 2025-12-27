'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SkillDemandChartProps {
    data: any[];
    cities: string[];
}


export function SkillDemandChart({data, cities}: SkillDemandChartProps) {
    const chartConfig = {
        demand: {
            label: "Demand",
        },
    }  as ChartConfig;

    cities.forEach((city, index) => {
        chartConfig[city] = {
            label: city,
            color: `hsl(var(--chart-${index + 1}))`
        }
    });


  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)" />
        <YAxis
          dataKey="skillName"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 15)}
          stroke="hsl(var(--muted-foreground))"
        />
        <XAxis dataKey="demand" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            labelClassName="font-bold text-foreground"
            className="bg-background/90 border-border" 
          />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {cities.map(city => (
            <Bar key={city} dataKey={city} fill={`var(--color-${city})`} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

    