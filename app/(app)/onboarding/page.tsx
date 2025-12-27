'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { parseResume } from '@/lib/resume-parser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, FileText, User, Briefcase, GraduationCap, Calendar, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/logo';

interface UserData {
  fullName: string;
  age: number;
  skills: string[];
  employmentStatus: 'employed' | 'fresher';
  experience: number;
  education: string;
  currentRole: string;
  industry: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please upload a PDF, DOC, DOCX, or TXT file');
        return;
      }
      
      setFile(selectedFile);
      setStep(2);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeResume = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    
    try {
      const parsedData = await parseResume(file);
      setUserData(parsedData);
      setIsAnalyzing(false);
      setStep(3);
    } catch (error) {
      console.error('Error parsing resume:', error);
      alert('Error parsing resume. Please try again with a different file.');
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
    // Mark onboarding as completed
    localStorage.setItem('onboarding_completed', 'true');
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 flex flex-col">
      <div className="flex justify-center mb-8 pt-8">
        <Logo className="size-10 text-primary" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of 3
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {step === 1 ? 'Upload Resume' : step === 2 ? 'Analyzing' : 'Confirmation'}
              </span>
            </div>
            <Progress value={step * 33.33} className="w-full" />
          </div>

          <div className="transition-all duration-300">
            {step === 1 && (
              <div
                key="step1"
                className="opacity-100 transition-opacity duration-300"
              >
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Welcome to SkillMapper AI</CardTitle>
                    <CardDescription>
                      Let's get to know you better by analyzing your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-10">
                    <div 
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer w-full max-w-md transition-colors hover:border-primary"
                      onClick={triggerFileInput}
                    >
                      <Upload className="mx-auto size-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        PDF, DOC, DOCX, or TXT files accepted
                      </p>
                      <Button variant="outline">
                        <FileText className="size-4 mr-2" />
                        Select File
                      </Button>
                    </div>
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                    />
                    
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      We'll extract your skills, experience, and other details to personalize your experience
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 2 && (
              <div
                key="step2"
                className="opacity-100 transition-opacity duration-300"
              >
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Analyzing Your Resume</CardTitle>
                    <CardDescription>
                      Extracting skills, experience, and background information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center py-12">
                    {isAnalyzing ? (
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                          <div className="absolute inset-4 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <p className="text-lg font-medium">Processing your resume...</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Extracting skills, experience, and other details
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="mx-auto size-16 text-green-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Analysis Complete!</h3>
                        <p className="text-muted-foreground mb-6">
                          We've extracted the following information from your resume
                        </p>
                        <Button onClick={() => {
                          if (file) {
                            analyzeResume();
                          }
                        }}>
                          Analyze Resume
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 3 && userData && (
              <div
                key="step3"
                className="opacity-100 transition-opacity duration-300"
              >
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Your Profile Summary</CardTitle>
                    <CardDescription>
                      We've extracted this information from your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <User className="size-5 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{userData.fullName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="size-5 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Age</p>
                            <p className="font-medium">{userData.age} years</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Briefcase className="size-5 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Current Role</p>
                            <p className="font-medium">{userData.currentRole}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <GraduationCap className="size-5 text-primary mr-3" />
                          <div>
                            <p className="text-sm text-muted-foreground">Education</p>
                            <p className="font-medium">{userData.education}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="size-5 mr-3">
                            <Badge 
                              variant={userData.employmentStatus === 'employed' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {userData.employmentStatus}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Employment Status</p>
                            <p className="font-medium capitalize">{userData.employmentStatus}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="size-5 text-primary mr-3">
                            <Calendar className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Experience</p>
                            <p className="font-medium">{userData.experience} years</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="size-5 text-primary mr-3">
                            <Briefcase className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Industry</p>
                            <p className="font-medium">{userData.industry}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="font-medium mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleConfirm}
                        disabled={isConfirmed}
                      >
                        {isConfirmed ? 'Confirming...' : 'Confirm & Continue'}
                        {isConfirmed && (
                          <CheckCircle className="ml-2 size-4 animate-pulse" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}