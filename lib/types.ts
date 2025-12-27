export interface City {
  name: string;
  costOfLivingIndex: number; // e.g., 100 is baseline
}

export interface Skill {
  name: string;
  industry: string;
}

export interface Industry {
  name: string;
}

export interface SkillDemand {
  skillName: string;
  cityName: string;
  demandCount: number; // Number of job postings
  supplyCount: number; // Number of professionals with this skill
}

export interface SalaryData {
  cityName: string;
  role: string;
  averageSalary: number;
}

export interface TrendData {
    month: string;
    [key: string]: string | number;
}


export interface ImagePlaceholder {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
}

export interface UserData {
  fullName: string;
  age: number;
  skills: string[];
  employmentStatus: 'employed' | 'fresher';
  experience: number;
  education: string;
  currentRole: string;
  industry: string;
}
