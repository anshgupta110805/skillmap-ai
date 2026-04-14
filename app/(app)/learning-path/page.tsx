'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Link as LinkIcon, 
  Award, 
  Layout, 
  ChevronRight,
  TrendingUp,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { generateLearningPathFlow } from '@/ai/flows/generateLearningPathFlow';
import { WeeklyPlan } from '@/types';

export default function LearningPathPage() {
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<WeeklyPlan[]>([]);
  const [activeWeek, setActiveWeek] = useState(1);

  useEffect(() => {
    const saved = localStorage.getItem('learning_path_progress');
    if (saved) {
      setPath(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateLearningPathFlow({
        skillGaps: ['GenAI', 'Advanced Next.js', 'Distributed Systems']
      });
      setPath(res as any);
      localStorage.setItem('learning_path_progress', JSON.stringify(res));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (weekNum: number) => {
    const newPath = path.map(w => 
      w.week === weekNum ? { ...w, completed: !w.completed } : w
    );
    setPath(newPath);
    localStorage.setItem('learning_path_progress', JSON.stringify(newPath));
  };

  const completedCount = path.filter(w => w.completed).length;
  const progressPct = path.length > 0 ? (completedCount / path.length) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">AI Learning Path</h1>
          <p className="text-muted-foreground">Your personalized 12-week roadmap to bridge skill gaps.</p>
        </div>
        {path.length === 0 && (
          <Button onClick={handleGenerate} className="bg-purple-600 hover:bg-purple-700 font-bold gap-2 shadow-lg shadow-purple-500/20" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate My Path
          </Button>
        )}
      </div>

      {path.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-purple-500/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground tracking-wider">Overall Progress</CardTitle>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black">{Math.round(progressPct)}%</span>
                  <span className="text-xs text-muted-foreground">{completedCount}/12 Weeks</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progressPct} className="h-3 bg-purple-100 dark:bg-purple-900/20 [&>div]:bg-purple-600" />
                <div className="mt-6 space-y-2">
                  {path.map((w) => (
                    <div 
                      key={w.week}
                      onClick={() => setActiveWeek(w.week)}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${activeWeek === w.week ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-muted'}`}
                    >
                      <div className={`size-5 rounded-full flex items-center justify-center border ${w.completed ? 'bg-green-500 border-green-500 text-white' : 'border-muted-foreground/30'}`}>
                        {w.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`text-xs font-medium ${activeWeek === w.week ? 'text-purple-700 dark:text-purple-400' : 'text-muted-foreground'}`}>
                        Week {w.week}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/10 bg-blue-500/[0.02]">
              <CardHeader className="p-4 flex flex-row items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-xs font-bold uppercase">Impact Meta</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground italic">
                Completing this path will increase your Gravity Score by an estimated 14 points.
              </CardContent>
            </Card>
          </div>

          {/* Week Detail View */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {path.map((w) => w.week === activeWeek && (
                <motion.div
                  key={w.week}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="border-purple-500/10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 h-full bg-purple-600/5 flex items-center justify-center rotate-12 translate-x-12">
                       <GraduationCap className="size-48 text-purple-600/10" />
                    </div>
                    <CardHeader className="p-8">
                      <div className="flex items-center gap-3 mb-2">
                         <Badge variant="outline" className="border-purple-500/30 text-purple-600">WEEK {w.week}</Badge>
                         <Badge className={w.completed ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}>
                           {w.completed ? 'Completed' : 'In Progress'}
                         </Badge>
                      </div>
                      <CardTitle className="text-3xl font-bold">{w.topic}</CardTitle>
                      <CardDescription className="max-w-2xl text-base mt-2">
                        Master the core concepts and implementation strategies for this phase of your development.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`check-${w.week}`} 
                            checked={w.completed} 
                            onCheckedChange={() => toggleWeek(w.week)}
                            className="size-6 border-purple-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <label htmlFor={`check-${w.week}`} className="text-sm font-semibold cursor-pointer">
                            Mark this week as complete
                          </label>
                       </div>
                       <Button variant="ghost" className="gap-2 text-purple-600" onClick={() => setActiveWeek(w.week + 1 > 12 ? 1 : w.week + 1)}>
                          Next Week <ChevronRight className="w-4 h-4" />
                       </Button>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {w.resources.map((res, i) => (
                      <Card key={i} className="hover:border-purple-500/30 transition-all cursor-pointer group">
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                           <div className="p-2 rounded-lg bg-muted group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                             {res.type === 'course' && <BookOpen className="w-4 h-4 text-blue-500" />}
                             {res.type === 'project' && <Layout className="w-4 h-4 text-purple-500" />}
                             {res.type === 'certification' && <Award className="w-4 h-4 text-amber-500" />}
                           </div>
                           <LinkIcon className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="text-[10px] uppercase mb-2 font-bold tracking-widest">{res.type}</Badge>
                          <h4 className="font-bold text-sm leading-tight">{res.title}</h4>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">Premium curated resource from top-tier platforms.</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
