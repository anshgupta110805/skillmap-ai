'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface TopSkillsChartProps {
  data: { skillName: string; demandCount: number }[];
}

const chartConfig = {
  demand: {
    label: 'Demand',
    color: 'hsl(var(--chart-1))',
  },
  skillName: {
    label: 'Skill',
  },
} satisfies ChartConfig;

export function TopSkillsChart({ data }: TopSkillsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: -20,
        }}
      >
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)"/>
        <YAxis
          dataKey="skillName"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          stroke="hsl(var(--muted-foreground))"
        />
        <XAxis type="number" dataKey="demandCount" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            indicator="line" 
            nameKey="demand" 
            labelClassName="font-bold text-foreground"
            className="bg-background/90 border-border"
          />}
        />
        <Bar dataKey="demandCount" fill="var(--color-demand)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

    