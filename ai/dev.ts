'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/extract-skills-from-job-description.ts';
import '@/ai/flows/skill-migration-assistant.ts';
import '@/ai/flows/recommend-career-route.ts';
import '@/ai/flows/detect-skill-anomalies.ts';
import '@/ai/flows/migration-simulator.ts';
import '@/ai/flows/policy-advisor.ts';
import '@/ai/flows/skill-graph-intelligence.ts';
