'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  AlertCircle, 
  ArrowRight, 
  Rocket, 
  CheckCircle2, 
  Calendar,
  Zap,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Treemap, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line 
} from 'recharts';

// Mock Data
const gravityScore = 78;
const skillData = [
  { name: 'Technical', children: [
    { name: 'TypeScript', size: 90 },
    { name: 'React', size: 85 },
    { name: 'Next.js', size: 80 },
    { name: 'Node.js', size: 70 },
  ]},
  { name: 'Design', children: [
    { name: 'Framer Motion', size: 65 },
    { name: 'Tailwind CSS', size: 95 },
    { name: 'UI/UX', size: 75 },
  ]},
  { name: 'Soft Skills', children: [
    { name: 'Leadership', size: 60 },
    { name: 'Strategy', size: 55 },
  ]}
];

const priorityActions = [
  { id: 1, action: "Master Advanced Genkit Flows", effort: "Medium", impact: "High", icon: <Zap className="w-4 h-4 text-purple-500" /> },
  { id: 2, action: "Apply for 'Principal AI Engineer' role", effort: "Low", impact: "High", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
  { id: 3, action: "Complete Cloud Architect Cert", effort: "High", impact: "Medium", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
];

const launchWindows = [
  { id: 1, role: "Senior AI Engineer", company: "Google", match: 94, location: "Remote" },
  { id: 2, role: "Principal Product Engineer", company: "Vercel", match: 89, location: "SF" },
  { id: 3, role: "CTO, Early Stage AI Startup", company: "Stealth", match: 85, location: "NYC" },
  { id: 4, role: "Staff Engineer", company: "Meta", match: 82, location: "London" },
  { id: 5, role: "AI Solutions Architect", company: "AWS", match: 88, location: "Remote" },
];

const riskFlags = [
  { title: "Skill Stagnation", severity: "High", desc: "Your 'Docker' usage is Decaying." },
  { title: "Market Volatility", severity: "Medium", desc: "Low demand for 'Python 3.8' in NYC." },
  { title: "Career Gap", severity: "Low", desc: "3 months since last certification." },
];

const sparklineData = [
  { val: 10 }, { val: 25 }, { val: 20 }, { val: 45 }, { val: 35 }, { val: 60 }, { val: 78 }
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Your Career Pulse</h1>
          <p className="text-muted-foreground">Welcome back, Ansh. Here is what is happening in your career.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Review
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 flex gap-2">
            <Rocket className="w-4 h-4" />
            Accelerate Path
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Gravity Score Card */}
        <Card className="md:col-span-1 border-purple-500/10 shadow-sm relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Gravity Score</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="58" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className="text-purple-100 dark:text-purple-900/20"
                />
                <motion.circle 
                  cx="64" cy="64" r="58" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="364.4"
                  initial={{ strokeDashoffset: 364.4 }}
                  animate={{ strokeDashoffset: 364.4 - (364.4 * gravityScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  strokeLinecap="round"
                  className="text-purple-600"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{gravityScore}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Rising</span>
              </div>
            </div>
            <div className="w-full h-10 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="val" stroke="#9333ea" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-center mt-2 text-muted-foreground">
              Top 5% for Senior AI Engineers
            </p>
          </CardContent>
        </Card>

        {/* Skill Heatmap Treemap */}
        <Card className="md:col-span-2 lg:col-span-3 border-purple-500/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Skill Heatmap</CardTitle>
              <CardDescription>Strength by Category & Expertise</CardDescription>
            </div>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={skillData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#9333ea"
              >
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderRadius: '8px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </Treemap>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Actions */}
        <Card className="lg:col-span-2 border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Priority Actions</CardTitle>
            <CardDescription>AI-generated steps to increase your Gravity Score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorityActions.map((action) => (
              <motion.div 
                key={action.id}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-background border shadow-sm">
                    {action.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.action}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-4">Effort: {action.effort}</Badge>
                      <Badge className="text-[10px] h-4 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">Impact: {action.impact}</Badge>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Flags */}
        <Card className="border-red-500/10 bg-red-500/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Risk Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskFlags.map((risk, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{risk.title}</span>
                  <Badge variant={risk.severity === 'High' ? 'destructive' : 'secondary'} className="text-[9px] px-1.5 h-3.5">
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{risk.desc}</p>
                {index < riskFlags.length - 1 && <div className="h-px bg-border pt-2" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Launch Windows */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Launch Windows</h2>
          <Button variant="link" className="text-purple-600 p-0 h-auto">View All Opportunities</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {launchWindows.map((job) => (
            <motion.div 
              key={job.id} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-4 rounded-2xl bg-background border border-purple-500/5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[10px]">
                  {job.match}% Match
                </Badge>
                <div className="size-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                  {job.company[0]}
                </div>
              </div>
              <h3 className="font-bold text-sm truncate">{job.role}</h3>
              <p className="text-xs text-muted-foreground mt-1">{job.company} • {job.location}</p>
              <div className="mt-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-muted-foreground">Confidence</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-1 bg-muted [&>div]:bg-green-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
