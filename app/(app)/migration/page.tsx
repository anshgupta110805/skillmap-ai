'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plane, 
  MapPin, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag,
  ArrowRightLeft,
  Loader2,
  Users,
  LocateFixed
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { runMigrationSimFlow } from '@/ai/flows/runMigrationSimFlow';
import { MigrationResult } from '@/types';

export default function MigrationSimulatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  
  const [formData, setFormData] = useState({
    currentCity: 'Mumbai',
    targetCity: 'London',
    role: 'Senior Software Engineer'
  });

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await runMigrationSimFlow(formData);
      setResult(res as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Migration Simulator</h1>
          <p className="text-muted-foreground">Calculate the impact of relocating for your next career move.</p>
        </div>
      </div>

      <Card className="border-purple-500/10 shadow-xl bg-background/50 backdrop-blur">
        <CardContent className="p-6">
          <form onSubmit={handleSimulate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentCity">Current City</Label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="currentCity" 
                  value={formData.currentCity}
                  onChange={(e) => setFormData({...formData, currentCity: e.target.value})}
                  className="pl-9 bg-muted/50" 
                />
              </div>
            </div>
            <div className="flex items-center justify-center pt-6">
              <ArrowRightLeft className="w-5 h-5 text-muted-foreground hidden md:block" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetCity">Target City</Label>
              <div className="relative">
                <LocateFixed className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
                <Input 
                  id="targetCity" 
                  value={formData.targetCity}
                  onChange={(e) => setFormData({...formData, targetCity: e.target.value})}
                  className="pl-9 bg-muted/50 border-purple-500/20" 
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 h-10 gap-2 font-bold" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plane className="w-4 h-4" />}
                Run simulation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Comparison Map & High Level Indicators */}
            <Card className="md:col-span-3 overflow-hidden border-purple-500/10">
              <div className="flex flex-col md:flex-row h-full">
                <div className="flex-1 bg-muted/30 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                   {/* Simple SVG Map Placeholder */}
                  <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
                    <circle cx="200" cy="200" r="10" fill="#9333ea" />
                    <circle cx="600" cy="150" r="10" fill="#9333ea" />
                    <path d="M200 200 Q400 100 600 150" fill="none" stroke="#9333ea" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                  
                  <div className="flex items-center gap-12 relative z-10">
                    <div className="text-center">
                       <p className="text-xs font-bold text-muted-foreground uppercase">{formData.currentCity}</p>
                       <p className="text-2xl font-bold">Base</p>
                    </div>
                    <motion.div 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <ArrowRightLeft className="w-8 h-8 text-purple-600" />
                    </motion.div>
                    <div className="text-center">
                       <p className="text-xs font-bold text-purple-500 uppercase">{formData.targetCity}</p>
                       <p className="text-2xl font-bold">New Start</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-8 grid grid-cols-2 gap-8 border-t md:border-t-0 md:border-l">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <DollarSign className="w-3 h-3 text-green-500" /> Salary Delta
                    </div>
                    <div className={`text-3xl font-bold ${result.salaryAdjustmentPct >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {result.salaryAdjustmentPct >= 0 ? '+' : ''}{result.salaryAdjustmentPct}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <ShoppingBag className="w-3 h-3 text-blue-500" /> Cost of Living
                    </div>
                    <div className={`text-3xl font-bold ${result.costOfLivingDeltaPct <= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {result.costOfLivingDeltaPct >= 0 ? '+' : ''}{result.costOfLivingDeltaPct}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <TrendingUp className="w-3 h-3 text-purple-500" /> Demand Score
                    </div>
                    <div className="text-3xl font-bold">{result.demandScore}/100</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      <Users className="w-3 h-3 text-amber-500" /> Hiring Rank
                    </div>
                    <div className="text-3xl font-bold text-amber-600">#4 Global</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Companies */}
            <Card className="border-purple-500/10">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-500" />
                  Top Companies
                </CardTitle>
                <CardDescription>Major players hiring for {formData.role} in {formData.targetCity}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.topHiringCompanies.map((company, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-background border flex items-center justify-center font-bold text-xs">
                        {company[0]}
                      </div>
                      <span className="text-sm font-semibold">{company}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Hiring</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Net Advantage Card */}
            <Card className="md:col-span-2 border-purple-500/10 bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Financial Analysis</CardTitle>
                <CardDescription className="text-purple-100/70">Estimated Real Value comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-80">Economic Advantage</p>
                      <p className="text-4xl font-black">+{result.salaryAdjustmentPct - result.costOfLivingDeltaPct}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-80">Annual Gain (Est.)</p>
                      <p className="text-2xl font-bold">+$24,500</p>
                    </div>
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="h-full bg-green-400" style={{ width: '60%' }} />
                    <div className="h-full bg-white/20" style={{ width: '40%' }} />
                  </div>
                  <p className="text-xs opacity-70 italic">
                    *This estimate includes base salary adjustments and mean consumer price index deltas. Tax implications not included.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="h-[400px] bg-muted/20 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center space-y-4 text-muted-foreground">
             <LocateFixed className="w-12 h-12 opacity-15" />
             <p className="text-sm">Configure your cities and role to start the simulation.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
