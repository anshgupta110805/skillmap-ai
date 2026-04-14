'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Group
} from 'recharts';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Info,
  Layers,
  Sparkles,
  TrendingUp,
  TrendingDown,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

// Mock Data
const skills = [
  { id: '1', name: 'TypeScript', category: 'Frontend', momentum: 'Rising', strength: 92, demand: 88, salary: 15000 },
  { id: '2', name: 'React Native', category: 'Mobile', momentum: 'Neutral', strength: 75, demand: 65, salary: 8000 },
  { id: '3', name: 'GenAI (Genkit)', category: 'AI/ML', momentum: 'Rising', strength: 60, demand: 95, salary: 25000 },
  { id: '4', name: 'Docker', category: 'DevOps', momentum: 'Decaying', strength: 82, demand: 45, salary: -2000 },
  { id: '5', name: 'Next.js', category: 'Frontend', momentum: 'Rising', strength: 88, demand: 92, salary: 12000 },
  { id: '6', name: 'AWS Lambda', category: 'Cloud', momentum: 'Neutral', strength: 45, demand: 70, salary: 10000 },
];

const demandByCity = [
  { city: 'London', demand: 85, growth: 12 },
  { city: 'NYC', demand: 92, growth: 15 },
  { city: 'SF', demand: 98, growth: 20 },
  { city: 'Berlin', demand: 70, growth: 8 },
  { city: 'Bangalore', demand: 88, growth: 25 },
];

export default function SkillsIntelligencePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  const filteredSkills = skills.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const momentumIcon = (m: string) => {
    if (m === 'Rising') return <ArrowUpRight className="w-3 h-3 text-green-500" />;
    if (m === 'Decaying') return <ArrowDownRight className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-gray-500" />;
  };

  const momentumColor = (m: string) => {
    if (m === 'Rising') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (m === 'Decaying') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Skill Intelligence</h1>
          <p className="text-muted-foreground">Deep dive into your professional inventory and market demand.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skill List Sidebar */}
        <Card className="lg:col-span-1 h-[calc(100vh-250px)] flex flex-col">
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                className="pl-8 bg-muted/50 focus-visible:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto px-2">
            <div className="space-y-1">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedSkill?.id === skill.id ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30' : 'hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-background border flex items-center justify-center font-bold text-xs">
                      {skill.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{skill.name}</p>
                      <p className="text-[10px] text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] h-5 gap-1 ${momentumColor(skill.momentum)}`}>
                    {momentumIcon(skill.momentum)}
                    {skill.momentum}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Intelligence Visualization & Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Demand Chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Global Skill Demand</CardTitle>
                <CardDescription>Market intensity by major tech hubs</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demandByCity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="city" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(147, 51, 234, 0.05)'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="demand" fill="#9333ea" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="growth" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Recommendation Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-500/20 bg-green-500/[0.02]">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  Add
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {['Kubernetes', 'Go'].map(s => (
                  <div key={s} className="text-xs p-2 rounded bg-background border flex items-center justify-between">
                    {s} <ArrowUpRight className="w-3 h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/[0.02]">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  Drop
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {['jQuery', 'C++'].map(s => (
                  <div key={s} className="text-xs p-2 rounded bg-background border flex items-center justify-between">
                    {s} <ArrowDownRight className="w-3 h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-blue-500/[0.02]">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Deepen
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {['Next.js', 'PostgreSQL'].map(s => (
                  <div key={s} className="text-xs p-2 rounded bg-background border flex items-center justify-between">
                    {s} <BookOpen className="w-3 h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Skill Detail Sheet */}
      <Sheet open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
        <SheetContent className="sm:max-w-md bg-background/95 backdrop-blur-xl">
          {selectedSkill && (
            <div className="h-full flex flex-col">
              <SheetHeader className="pb-6">
                <div className="size-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-purple-500/20">
                  {selectedSkill.name[0]}
                </div>
                <SheetTitle className="text-2xl font-bold">{selectedSkill.name}</SheetTitle>
                <SheetDescription>{selectedSkill.category} • Current Strength: {selectedSkill.strength}%</SheetDescription>
              </SheetHeader>
              
              <div className="flex-1 overflow-auto space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/50 border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="w-3 h-3" /> Market Demand
                    </div>
                    <div className="text-2xl font-bold">{selectedSkill.demand}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-muted/50 border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <DollarSign className="w-3 h-3" /> Salary Impact
                    </div>
                    <div className="text-2xl font-bold">+{selectedSkill.salary >= 0 ? '$' : '-$'}{Math.abs(selectedSkill.salary).toLocaleString()}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    Learning Resources
                  </h4>
                  <div className="space-y-3">
                    {[
                      { title: 'Advanced patterns in ' + selectedSkill.name, type: 'Course' },
                      { title: 'Building production ' + selectedSkill.name + ' projects', type: 'Project' }
                    ].map((res, i) => (
                      <div key={i} className="group p-4 rounded-xl border hover:border-purple-500/30 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 cursor-pointer transition-all">
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">{res.type}</p>
                        <p className="text-sm font-semibold flex items-center justify-between">
                          {res.title}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    Market Insights
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The demand for {selectedSkill.name} is currently {selectedSkill.momentum.toLowerCase()} across major tech hubs. 
                    {selectedSkill.salary > 0 
                      ? ` Proficiency in this skill is valued highly, contributing an estimated $${selectedSkill.salary.toLocaleString()} premium to base salaries.`
                      : ` However, market saturation has led to a slight decline in salary premiums for this specific expertise.`}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-12 rounded-xl text-white font-bold gap-2">
                  <Zap className="w-4 h-4" /> Add to Goal List
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
