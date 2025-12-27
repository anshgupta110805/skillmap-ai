import type { City, Skill, Industry, SkillDemand, SalaryData, TrendData } from './types';

export const industries: Industry[] = [
  { name: 'AI' },
  { name: 'Web Development' },
  { name: 'Cybersecurity' },
  { name: 'Data Science' },
  { name: 'Cloud Computing' },
];

export const cities: City[] = [
  { name: 'Bangalore', costOfLivingIndex: 80 },
  { name: 'Pune', costOfLivingIndex: 75 },
  { name: 'Hyderabad', costOfLivingIndex: 70 },
  { name: 'Delhi', costOfLivingIndex: 85 },
  { name: 'Mumbai', costOfLivingIndex: 100 },
];

export const skills: Skill[] = [
  { name: 'Python', industry: 'AI' },
  { name: 'TensorFlow', industry: 'AI' },
  { name: 'PyTorch', industry: 'AI' },
  { name: 'AI Ops', industry: 'AI' },
  { name: 'React', industry: 'Web Development' },
  { name: 'Node.js', industry: 'Web Development' },
  { name: 'Manual QA', industry: 'Web Development' },
  { name: 'Penetration Testing', industry: 'Cybersecurity' },
  { name: 'SIEM', industry: 'Cybersecurity' },
  { name: 'SQL', industry: 'Data Science' },
  { name: 'Power BI', industry: 'Data Science' },
  { name: 'Tableau', industry: 'Data Science' },
  { name: 'AWS', industry: 'Cloud Computing' },
  { name: 'Azure', industry: 'Cloud Computing' },
];

export const skillDemand: SkillDemand[] = [
  // Bangalore
  { skillName: 'Python', cityName: 'Bangalore', demandCount: 500, supplyCount: 450 },
  { skillName: 'React', cityName: 'Bangalore', demandCount: 450, supplyCount: 500 },
  { skillName: 'AWS', cityName: 'Bangalore', demandCount: 480, supplyCount: 400 },
  { skillName: 'AI Ops', cityName: 'Bangalore', demandCount: 300, supplyCount: 150 },

  // Pune
  { skillName: 'Python', cityName: 'Pune', demandCount: 350, supplyCount: 380 },
  { skillName: 'Penetration Testing', cityName: 'Pune', demandCount: 250, supplyCount: 120 },
  { skillName: 'React', cityName: 'Pune', demandCount: 300, supplyCount: 320 },
  { skillName: 'Azure', cityName: 'Pune', demandCount: 280, supplyCount: 200 },

  // Hyderabad
  { skillName: 'SQL', cityName: 'Hyderabad', demandCount: 400, supplyCount: 420 },
  { skillName: 'Power BI', cityName: 'Hyderabad', demandCount: 350, supplyCount: 300 },
  { skillName: 'AWS', cityName: 'Hyderabad', demandCount: 380, supplyCount: 310 },
  { skillName: 'TensorFlow', cityName: 'Hyderabad', demandCount: 200, supplyCount: 150 },

  // Delhi
  { skillName: 'React', cityName: 'Delhi', demandCount: 400, supplyCount: 550 },
  { skillName: 'Node.js', cityName: 'Delhi', demandCount: 350, supplyCount: 450 },
  { skillName: 'Manual QA', cityName: 'Delhi', demandCount: 150, supplyCount: 300 },
  { skillName: 'SIEM', cityName: 'Delhi', demandCount: 180, supplyCount: 100 },
  
  // Mumbai
  { skillName: 'Python', cityName: 'Mumbai', demandCount: 420, supplyCount: 400 },
  { skillName: 'SQL', cityName: 'Mumbai', demandCount: 450, supplyCount: 480 },
  { skillName: 'Tableau', cityName: 'Mumbai', demandCount: 280, supplyCount: 250 },
  { skillName: 'AWS', cityName: 'Mumbai', demandCount: 400, supplyCount: 350 },
];

export const roles = [
    'AI Engineer',
    'Data Analyst',
    'Frontend Developer',
    'Backend Developer',
    'Full-stack Developer',
    'Cybersecurity Analyst',
    'Cloud Engineer',
    'QA Engineer'
];

export const experienceLevels = [
    'entry',
    'mid',
    'senior'
];

export const salaryData: SalaryData[] = [
    { cityName: 'Bangalore', role: 'AI Engineer', averageSalary: 1800000 },
    { cityName: 'Pune', role: 'AI Engineer', averageSalary: 1500000 },
    { cityName: 'Hyderabad', role: 'AI Engineer', averageSalary: 1600000 },
    { cityName: 'Delhi', role: 'AI Engineer', averageSalary: 1400000 },
    { cityName: 'Mumbai', role: 'AI Engineer', averageSalary: 1900000 },

    { cityName: 'Bangalore', role: 'Data Analyst', averageSalary: 800000 },
    { cityName: 'Pune', role: 'Data Analyst', averageSalary: 700000 },
    { cityName: 'Hyderabad', role: 'Data Analyst', averageSalary: 750000 },
    { cityName: 'Delhi', role: 'Data Analyst', averageSalary: 650000 },
    { cityName: 'Mumbai', role: 'Data Analyst', averageSalary: 850000 },

    { cityName: 'Bangalore', role: 'Cybersecurity Analyst', averageSalary: 1200000 },
    { cityName: 'Pune', role: 'Cybersecurity Analyst', averageSalary: 1100000 },
    { cityName: 'Hyderabad', role: 'Cybersecurity Analyst', averageSalary: 1150000 },
    { cityName: 'Delhi', role: 'Cybersecurity Analyst', averageSalary: 1000000 },
    { cityName: 'Mumbai', role: 'Cybersecurity Analyst', averageSalary: 1300000 },
];

export const skillTrendData: TrendData[] = [
    { month: 'Jan', 'AI Ops': 150, 'Manual QA': 300 },
    { month: 'Feb', 'AI Ops': 170, 'Manual QA': 290 },
    { month: 'Mar', 'AI Ops': 195, 'Manual QA': 285 },
    { month: 'Apr', 'AI Ops': 220, 'Manual QA': 270 },
    { month: 'May', 'AI Ops': 250, 'Manual QA': 260 },
    { month: 'Jun', 'AI Ops': 280, 'Manual QA': 245 },
];
