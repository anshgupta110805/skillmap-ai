'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendData } from '@/lib/types';


const chartConfig = {
  'AI Ops': {
    label: 'AI Ops',
    color: 'hsl(var(--chart-1))',
  },
  'Manual QA': {
    label: 'Manual QA',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface SkillTrendChartProps {
    data: TrendData[]
}

export function SkillTrendChart({data}: SkillTrendChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.2)"/>
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          stroke="hsl(var(--muted-foreground))"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke="hsl(var(--muted-foreground))"
        />
        <ChartTooltip 
          cursor={false} 
          content={<ChartTooltipContent 
            labelClassName="font-bold text-foreground"
            className="bg-background/90 border-border"
          />} 
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="AI Ops"
          type="monotone"
          stroke="var(--color-AI Ops)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Manual QA"
          type="monotone"
          stroke="var(--color-Manual QA)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

    