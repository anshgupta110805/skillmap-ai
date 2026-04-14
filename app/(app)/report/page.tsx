'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Zap, 
  MapPin, 
  Route, 
  Target, 
  CheckCircle2, 
  ShieldCheck,
  Award,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CareerDNAReportPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">Career DNA Report</h1>
          <p className="text-muted-foreground">Certified summary of your market position and growth path.</p>
        </div>
        <Button onClick={handlePrint} className="bg-purple-600 hover:bg-purple-700 font-bold gap-2">
           <Download className="w-4 h-4" />
           Export to PDF
        </Button>
      </div>

      <div id="report-content" className="space-y-6 print:space-y-4 print:max-w-none">
        {/* Header Section */}
        <Card className="border-purple-500/20 shadow-xl overflow-hidden print:shadow-none print:border-none">
          <div className="h-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between p-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="size-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl">SM</div>
                 <h2 className="text-xl font-bold text-purple-600">SkillMapper AI</h2>
              </div>
              <h3 className="text-4xl font-black tracking-tighter">Ansh Gupta</h3>
              <p className="text-lg text-muted-foreground font-medium uppercase tracking-widest">Senior AI Engineer</p>
            </div>
            <div className="text-right">
               <div className="text-6xl font-black text-purple-600">78</div>
               <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">Gravity Score</p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4">
          {/* Top Skills */}
          <Card className="md:col-span-2 border-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-500" />
                Top Skills & Momentum
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'TypeScript', score: 92, status: 'Rising' },
                  { name: 'GenAI (Genkit)', score: 88, status: 'Rising' },
                  { name: 'Next.js', score: 85, status: 'Stable' },
                  { name: 'Node.js', score: 78, status: 'Stable' },
                ].map((s) => (
                  <div key={s.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{s.name}</span>
                      <span className="text-purple-600">{s.status}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full">
                       <div className="h-full bg-purple-600 rounded-full" style={{ width: `${s.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Target City */}
          <Card className="border-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                Optimal Market
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
               <p className="text-3xl font-black">San Francisco</p>
               <Badge className="bg-green-100 text-green-700">+24% Financial Advantage</Badge>
               <p className="text-[10px] text-muted-foreground mt-2 italic">Based on demand/cost ratio for AI Engineers</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:gap-4">
          {/* Best Path */}
          <Card className="md:col-span-1 border-purple-500/10 bg-purple-600 text-white">
            <CardHeader className="pb-2 text-white">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Route className="w-4 h-4" />
                Recommended Route
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-2xl font-black">Accelerated</p>
                <p className="text-xs opacity-80">12 Month Target</p>
              </div>
              <Separator className="bg-white/20" />
              <div className="space-y-2">
                {[
                  'CTO Track',
                  '+$45k Salary Delta',
                  'Moderate Risk'
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" /> {t}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Actions */}
          <Card className="md:col-span-2 border-purple-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                Strategic Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               {[
                 { action: 'Certify in Cloud Solution Architecture', impact: 'High' },
                 { action: 'Open source 2 GenAI projects', impact: 'Medium' },
                 { action: 'Relocate or switch to US-based remote role', impact: 'Very High' },
               ].map((a, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl border bg-muted/20">
                    <div className="bg-background size-6 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-purple-500/20">{i+1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{a.action}</p>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Impact: {a.impact}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground/30" />
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer section for print */}
        <div className="hidden print:block pt-8 text-center border-t text-[10px] text-muted-foreground uppercase tracking-widest italic">
           SkillMapper AI Analysis Report • Generated on {new Date().toLocaleDateString()} • CONFIDENTIAL
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
          }
          .sidebar-inset, header, .copilot-widget {
            display: none !important;
          }
          main {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
