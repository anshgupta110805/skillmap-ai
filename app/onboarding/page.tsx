'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileUp, 
  MapPin, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { extractSkillsFlow } from '@/ai/flows/extractSkillsFlow';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, title: 'Experience', desc: 'Upload your resume', icon: <FileUp className="w-4 h-4" /> },
  { id: 2, title: 'Ambition', desc: 'Define target roles', icon: <Briefcase className="w-4 h-4" /> },
  { id: 3, title: 'Location', desc: 'Choose your cities', icon: <MapPin className="w-4 h-4" /> },
  { id: 4, title: 'Timeline', desc: 'Set your goals', icon: <Target className="w-4 h-4" /> },
  { id: 5, title: 'Confirm', desc: 'Review profile', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    skills: [] as string[],
    targetRoles: [] as string[],
    targetCities: [] as string[],
    timeline: '12',
    goal: 'Career Growth'
  });

  const [tempRole, setTempRole] = useState('');
  const [tempCity, setTempCity] = useState('');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    // In a real app, we'd use mammoth/pdfjs here. 
    // For this simulation, we simulate the text extraction and call the Genkit flow.
    setTimeout(async () => {
      try {
        const skills = await extractSkillsFlow({ document: "Simulated resume content for " + file.name });
        setProfile({ ...profile, skills: skills as string[] });
        nextStep();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const addItem = (list: 'targetRoles' | 'targetCities', val: string, setVal: (v: string) => void) => {
    if (!val.trim()) return;
    setProfile({ ...profile, [list]: [...profile[list], val] });
    setVal('');
  };

  const removeItem = (list: 'targetRoles' | 'targetCities', val: string) => {
    setProfile({ ...profile, [list]: profile[list].filter(v => v !== val) });
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Progress Tracker */}
        <div className="lg:col-span-1 space-y-4">
          <div className="mb-8">
             <div className="size-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-purple-500/20">S</div>
             <h1 className="text-xl font-bold mt-4">SkillMapper AI</h1>
          </div>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4 items-start">
                <div className={`size-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${currentStep >= step.id ? 'bg-purple-600 border-purple-600 text-white' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <div className="space-y-0.5">
                  <p className={`text-sm font-bold ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3">
          <Card className="border-purple-500/10 shadow-2xl h-full flex flex-col">
            <CardHeader className="p-8 pb-4">
              <Progress value={(currentStep / steps.length) * 100} className="h-1.5 mb-8 bg-purple-100 dark:bg-purple-900/20 [&>div]:bg-purple-600" />
              <CardTitle className="text-3xl font-black tracking-tight">{steps[currentStep-1].title}</CardTitle>
              <CardDescription className="text-base">{steps[currentStep-1].desc}</CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-4 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="border-2 border-dashed border-purple-500/20 rounded-3xl p-12 text-center space-y-4 bg-purple-500/[0.02] hover:bg-purple-500/[0.04] transition-colors relative">
                        {loading ? (
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="size-12 text-purple-600 animate-spin" />
                            <p className="text-sm font-bold text-purple-600">AI is extracting your skills...</p>
                          </div>
                        ) : (
                          <>
                            <div className="size-16 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mx-auto">
                              <FileUp className="size-8 text-purple-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-lg font-bold">Drop your resume here</p>
                              <p className="text-sm text-muted-foreground">PDF or DOCX preferred. AI will automatically build your profile.</p>
                            </div>
                            <Label htmlFor="resume-upload" className="inline-block px-8 py-3 bg-purple-600 text-white rounded-xl font-bold cursor-pointer transition-transform active:scale-95">
                               Select File
                            </Label>
                            <Input id="resume-upload" type="file" className="hidden" onChange={handleFileUpload} />
                          </>
                        )}
                      </div>
                      <div className="text-center">
                        <Button variant="link" onClick={nextStep} className="text-muted-foreground text-xs">Skip for now, I'll enter manually</Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>What roles are you targeting?</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="e.g. AI Architect" 
                            value={tempRole}
                            onChange={(e) => setTempRole(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem('targetRoles', tempRole, setTempRole)}
                            className="bg-muted/50 h-12 rounded-xl"
                          />
                          <Button onClick={() => addItem('targetRoles', tempRole, setTempRole)} className="size-12 rounded-xl bg-purple-600">
                             <Plus className="size-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.targetRoles.map(role => (
                          <Badge key={role} className="pl-3 pr-1 py-1.5 gap-2 bg-purple-100 text-purple-700 hover:bg-purple-100 border-none rounded-lg text-sm">
                            {role}
                            <X className="size-4 cursor-pointer hover:bg-purple-200 rounded" onClick={() => removeItem('targetRoles', role)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Which cities would you relocate to?</Label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder="e.g. San Francisco" 
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addItem('targetCities', tempCity, setTempCity)}
                            className="bg-muted/50 h-12 rounded-xl"
                          />
                          <Button onClick={() => addItem('targetCities', tempCity, setTempCity)} className="size-12 rounded-xl bg-purple-600">
                             <Plus className="size-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.targetCities.map(city => (
                          <Badge key={city} className="pl-3 pr-1 py-1.5 gap-2 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none rounded-lg text-sm">
                            {city}
                            <X className="size-4 cursor-pointer hover:bg-blue-200 rounded" onClick={() => removeItem('targetCities', city)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>Your Transition Timeline</Label>
                        <div className="grid grid-cols-2 gap-4">
                           {['3 Months', '6 Months', '12 Months', '24 Months'].map(t => (
                             <div 
                                key={t}
                                onClick={() => setProfile({...profile, timeline: t})}
                                className={`p-4 border-2 rounded-2xl cursor-pointer text-center font-bold transition-all ${profile.timeline === t ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-700' : 'border-muted'}`}
                             >
                               {t}
                             </div>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-2 pt-4">
                        <Label>Primary Goal</Label>
                        <select 
                          className="w-full h-12 rounded-xl bg-muted/50 border-none px-4 font-medium"
                          value={profile.goal}
                          onChange={(e) => setProfile({...profile, goal: e.target.value})}
                        >
                          <option>Salary Maximization</option>
                          <option>Career Growth</option>
                          <option>Work-Life Balance</option>
                          <option>Skill Diversification</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {currentStep === 5 && (
                    <div className="space-y-6">
                       <div className="p-6 rounded-3xl bg-muted/30 border space-y-6">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <h4 className="text-xl font-black">Profile Ready</h4>
                                <p className="text-sm text-muted-foreground">Expert analysis complete.</p>
                             </div>
                             <Badge className="bg-green-500 text-white border-none">Verified</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Skills Found</p>
                              <p className="text-lg font-bold">{profile.skills.length > 0 ? profile.skills.length : '12'} Skills</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Path Depth</p>
                              <p className="text-lg font-bold">12 Weeks</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                             <p className="text-[10px] uppercase font-bold text-muted-foreground">Target Strategy</p>
                             <div className="flex flex-wrap gap-1">
                               {profile.targetRoles.map(r => <span key={r} className="text-sm font-medium">{r} in {profile.targetCities.join(', ')}</span>)}
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="p-8 pt-0 flex justify-between">
              {currentStep > 1 && (
                <Button variant="ghost" onClick={prevStep} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}
              <div className="flex-1" />
              {currentStep < steps.length ? (
                currentStep !== 1 && (
                  <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-700 font-bold px-8 h-12 rounded-xl gap-2 shadow-lg shadow-purple-500/20">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                )
              ) : (
                <Button onClick={handleFinish} className="bg-purple-600 hover:bg-purple-700 font-bold px-8 h-12 rounded-xl gap-2 shadow-lg shadow-purple-500/20" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RocketIcon className="w-4 h-4" />}
                  Launch My Career
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RocketIcon(props: any) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
      <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
    </svg>
  );
}
