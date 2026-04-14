'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Flame, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Loader2,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { simulateCareerPathFlow } from '@/ai/flows/simulateCareerPathFlow';
import { CareerPath } from '@/types';

export default function CareerRoutesPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ safe: CareerPath, accelerated: CareerPath, bold: CareerPath } | null>(null);
  
  const [formData, setFormData] = useState({
    currentRole: 'Software Engineer',
    targetRole: 'AI Solution Architect',
    timeline: '12',
    city: 'San Francisco'
  });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await simulateCareerPathFlow({
        profile: { currentRole: formData.currentRole },
        targetRole: formData.targetRole,
        city: formData.city
      });
      setResults(res as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pathConfig = {
    safe: {
      title: 'Safe Path',
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      color: 'border-green-500/20 bg-green-500/[0.02]',
      tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      description: 'Steady progression through established certifications and internal promotions.'
    },
    accelerated: {
      title: 'Accelerated Path',
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      color: 'border-purple-500/20 bg-purple-500/[0.02]',
      tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      description: 'Fast-track through bootcamp intensity, strategic networking, and early pivots.'
    },
    bold: {
      title: 'Bold Path',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      color: 'border-red-500/20 bg-red-500/[0.02]',
      tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      description: 'High-stake transitions, startup leadership, and disruptive skill mastery.'
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl">Career Route Recommender</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto italic">
          Map your trajectory using AI-simulated growth models.
        </p>
      </div>

      <Card className="border-purple-500/10 shadow-xl overflow-hidden bg-background/50 backdrop-blur">
        <CardContent className="p-6">
          <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2 lg:col-span-1">
              <Label htmlFor="current">Current Role</Label>
              <Input 
                id="current" 
                value={formData.currentRole} 
                onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                className="bg-muted/50" 
              />
            </div>
            <div className="space-y-2 lg:col-span-1">
              <Label htmlFor="target">Target Role</Label>
              <Input 
                id="target" 
                value={formData.targetRole} 
                onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                className="bg-muted/50" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline (Months)</Label>
              <Select value={formData.timeline} onValueChange={(v) => setFormData({...formData, timeline: v})}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Target City</Label>
              <Input 
                id="city" 
                value={formData.city} 
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="bg-muted/50" 
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-10 gap-2 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Simulate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {results ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {(['safe', 'accelerated', 'bold'] as const).map((key) => (
              <motion.div key={key} whileHover={{ scale: 1.02 }} className="h-full">
                <Card className={`h-full border-2 ${pathConfig[key].color} relative overflow-hidden transition-all shadow-lg`}>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="p-3 rounded-2xl bg-background border shadow-sm">
                        {pathConfig[key].icon}
                      </div>
                      <Badge className={pathConfig[key].tagColor}>{key.toUpperCase()}</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">{pathConfig[key].title}</CardTitle>
                    <CardDescription className="text-xs line-clamp-2">{pathConfig[key].description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Duration
                        </p>
                        <p className="font-bold text-lg">{results[key].timeToTransitionMonths} Mo</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Salary
                        </p>
                        <p className="font-bold text-lg text-green-600">+{results[key].salaryDeltaPct}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Risk Score</span>
                        <span>{results[key].riskScore}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${results[key].riskScore}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full ${results[key].riskScore > 70 ? 'bg-red-500' : results[key].riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Skill Gaps to Bridge</p>
                      <div className="flex flex-wrap gap-2">
                        {results[key].missingSkills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-background">
                            {skill}
                          </Badge>
                        ))}
                        {results[key].missingSkills.length > 4 && (
                          <Badge variant="outline" className="text-[10px] bg-background">+{results[key].missingSkills.length - 4} more</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full justify-between group h-10 border border-transparent hover:border-purple-500/20">
                      View Detailed Roadmap
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4 text-muted-foreground">
            <div className="p-6 rounded-full bg-muted/30">
              <Route className="w-12 h-12 opacity-20" />
            </div>
            <p>Enter your details above to simulate your career trajectory.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
