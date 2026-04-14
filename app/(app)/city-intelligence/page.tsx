'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Briefcase,
  AlertCircle,
  BarChart3,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock Data for Cities
const cities = [
  "San Francisco", "New York", "London", "Berlin", "Bangalore", 
  "Singapore", "Toronto", "Austin", "Seattle", "Sydney"
];

const mockIntelligence = {
  city: "San Francisco",
  role: "AI Engineer",
  demandScore: 94,
  avgSalaryMin: 160000,
  avgSalaryMax: 285000,
  topCompanies: ["OpenAI", "Anthropic", "Google", "Meta", "Scale AI"],
  skillDemands: [
    { skill: "PyTorch", score: 98 },
    { skill: "LLMs", score: 95 },
    { skill: "Typescript", score: 85 },
    { skill: "Kubernetes", score: 78 },
    { skill: "React", score: 82 },
  ],
  skillGaps: ["Distributed Training", "CUDA Optimization", "Vector Databases"]
};

export default function CityIntelligencePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<typeof mockIntelligence | null>(null);
  const [formData, setFormData] = useState({ city: '', role: 'AI Engineer' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setResult({...mockIntelligence, city: formData.city || 'San Francisco', role: formData.role});
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">City Intelligence</h1>
        <p className="text-muted-foreground">Market-specific insights for any city-role combination.</p>
      </div>

      <Card className="border-purple-500/10 shadow-lg bg-background/50 backdrop-blur">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>City</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. San Francisco" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <Label>Role</Label>
              <div className="relative">
                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. AI Engineer" 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="pl-9 bg-muted/30"
                />
              </div>
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 font-bold px-8 h-10 gap-2" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Analyze Market
            </Button>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Market Stats */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-purple-500/10 bg-purple-500/[0.02]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Average Salary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    ${(result.avgSalaryMin / 1000).toFixed(0)}k - ${(result.avgSalaryMax / 1000).toFixed(0)}k
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Estimated annual base in {result.city}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    Top Hiring Companies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.topCompanies.map((c, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/50 text-sm font-medium hover:bg-muted cursor-pointer transition-colors">
                      {c}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-red-500/10 bg-red-500/[0.02]">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    Common Skill Gaps
                  </CardTitle>
                  <CardDescription className="text-[10px]">What seekers in {result.city} are missing most</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {result.skillGaps.map((gap, i) => (
                    <Badge key={i} variant="outline" className="bg-background border-red-500/20 text-red-700 dark:text-red-400">
                      {gap}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Demand Visualization */}
            <Card className="lg:col-span-2 border-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Skill Demand Intensity</CardTitle>
                  <CardDescription>Required proficiency levels for {result.role} in {result.city}</CardDescription>
                </div>
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.skillDemands} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="skill" type="category" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(147, 51, 234, 0.05)'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="score" fill="#9333ea" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
