import { UserData } from '@/lib/types';

// Functions to extract data from resume content
function extractNameFromContent(content: string): string | null {
  // Look for common name patterns at the beginning of resumes
  const namePatterns = [
    /^([A-Z][a-z]+\\s[A-Z][a-z]+)/,  // John Doe format
    /^([A-Z][a-z]+\\s[A-Z][a-z]+\\s[A-Z][a-z]+)/,  // John Doe Smith format
    /Name:\\s*([A-Z][a-z]+\\s[A-Z][a-z]+)/i,  // Name: John Doe format
    /NAME:\\s*([A-Z][a-z]+\\s[A-Z][a-z]+)/,  // NAME: John Doe format
  ];
  
  for (const pattern of namePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractExperienceFromContent(content: string): number {
  // Look for years of experience patterns
  const experiencePatterns = [
    /(\\d+)\\s*years?\\s*experience/i,
    /(\\d+)\\s*years?\\s*of\\s*experience/i,
    /Experience:\\s*(\\d+)\\s*years?/i,
    /EXPERIENCE:\\s*(\\d+)\\s*years?/,
    /Total Experience:\\s*(\\d+)\\s*years?/i,
  ];
  
  for (const pattern of experiencePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const years = parseInt(match[1], 10);
      if (!isNaN(years) && years >= 0 && years <= 50) {
        return years;
      }
    }
  }
  
  // If no explicit experience mentioned, try to count work history
  const workKeywords = ['experience', 'work', 'employment', 'professional', 'job', 'position', 'role'];
  const workSections = content.toLowerCase().split(/\\n\\s*\\n/); // Split by paragraphs
  let experienceCount = 0;
  
  for (const section of workSections) {
    if (workKeywords.some(keyword => section.includes(keyword))) {
      // Count number of job positions mentioned in the section
      const jobPositions = section.match(/(developer|engineer|manager|analyst|specialist|director|coordinator|consultant|associate|executive|officer|technician|scientist|architect|leader|supervisor|coordinator|coordinator|coordinator)/gi);
      if (jobPositions) {
        experienceCount += jobPositions.length;
      }
    }
  }
  
  return Math.min(experienceCount, 30); // Cap at 30 years
}

function extractSkillsFromContent(content: string): string[] {
  // Look for skills sections
  const skillsSectionPattern = /(?:skills|technical skills|core competencies|technologies|expertise)[\\s\\n\\r:]+([\\s\\S]*?)(?:\\n\\s*\\n|education|experience|contact|summary|$)/i;
  const skillsMatch = content.match(skillsSectionPattern);
  
  if (skillsMatch && skillsMatch[1]) {
    // Extract skills from the skills section
    const skillsText = skillsMatch[1];
    const skills = extractSkillsFromText(skillsText);
    if (skills.length > 0) {
      return skills;
    }
  }
  
  // If no dedicated skills section, look for skills throughout the document
  return extractSkillsFromText(content);
}

function extractSkillsFromText(text: string): string[] {
  // Common technical and soft skills
  const technicalSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'React', 'Angular', 'Vue.js', 'Node.js',
    'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'Git', 'Jenkins', 'Agile', 'Scrum', 'REST', 'GraphQL', 'API', 'UI/UX', 'Data Analysis',
    'Machine Learning', 'AI', 'DevOps', 'CI/CD', 'Testing', 'PHP', 'Ruby', 'Swift', 'Kotlin'
  ];
  
  const softSkills = [
    'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Project Management',
    'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity', 'Emotional Intelligence',
    'Negotiation', 'Conflict Resolution', 'Decision Making', 'Organization', 'Attention to Detail'
  ];
  
  const allSkills = [...technicalSkills, ...softSkills];
  const foundSkills = new Set<string>();
  
  // Look for skills in the text
  for (const skill of allSkills) {
    if (new RegExp(skill.replace(/[.*+?^${}()|\\[\\]\\]/g, '\\$&'), 'gi').test(text)) {
      foundSkills.add(skill);
    }
  }
  
  // Also look for skills separated by commas, pipes, or other delimiters
  const potentialSkills = text.match(/([A-Z][a-z]+(?:\\s[A-Z][a-z]+)*)/g) || [];
  for (const potentialSkill of potentialSkills) {
    const cleanedSkill = potentialSkill.trim();
    if (allSkills.some(skill => skill.toLowerCase() === cleanedSkill.toLowerCase())) {
      foundSkills.add(cleanedSkill);
    }
  }
  
  return Array.from(foundSkills).slice(0, 15); // Return up to 15 skills
}

function extractEducationFromContent(content: string): string {
  // Look for education sections
  const educationSectionPattern = /(?:education|academic background|qualifications)[\\s\\n\\r:]+([\\s\\S]*?)(?:\\n\\s*\\n|skills|experience|contact|summary|$)/i;
  const educationMatch = content.match(educationSectionPattern);
  
  if (educationMatch && educationMatch[1]) {
    const educationText = educationMatch[1].substring(0, 500); // Limit to first 500 chars
    
    // Look for degree patterns
    const degreePatterns = [
      /(Bachelor|Master|PhD|B\\.?[A-Z]*|M\\.?[A-Z]*)\\s*(?:of|in)?\\s*([A-Za-z\\s&]+)/i,
      /([A-Za-z\\s&]+)\\s*(Bachelor|Master|PhD|B\\.?[A-Z]*|M\\.?[A-Z]*)/i,
      /(Degree|Diploma)\\s*in\\s*([A-Za-z\\s&]+)/i,
    ];
    
    for (const pattern of degreePatterns) {
      const match = educationText.match(pattern);
      if (match) {
        return `${match[1]} ${match[2] || ''}`.trim();
      }
    }
  }
  
  // Look for education throughout the document
  const educationKeywords = ['university', 'college', 'institute', 'school'];
  const degreeKeywords = ['bachelor', 'master', 'phd', 'b.a.', 'm.a.', 'b.sc', 'm.sc', 'b.tech', 'm.tech'];
  
  for (const keyword of educationKeywords) {
    const index = content.toLowerCase().indexOf(keyword);
    if (index !== -1) {
      // Extract the sentence/paragraph containing the education info
      const context = content.substring(Math.max(0, index - 100), index + 200);
      
      for (const degree of degreeKeywords) {
        if (context.toLowerCase().includes(degree)) {
          const lines = context.split(/\\n|\\r/);
          for (const line of lines) {
            if (line.toLowerCase().includes(keyword) && line.toLowerCase().includes(degree)) {
              return line.trim();
            }
          }
        }
      }
    }
  }
  
  return 'Education information not found';
}

function extractCurrentRoleFromContent(content: string): string {
  // Look for current position in experience section
  const experienceSectionPattern = /(?:experience|work experience|employment history)[\\s\\n\\r:]+([\\s\\S]*?)(?:\\n\\s*\\n|education|skills|contact|summary|$)/i;
  const experienceMatch = content.match(experienceSectionPattern);
  
  if (experienceMatch && experienceMatch[1]) {
    const expText = experienceMatch[1].substring(0, 1000); // Limit to first 1000 chars
    
    // Look for current/present indicators
    const currentRolePattern = /(?:current|present|now|currently)[\\s\\S]*?([A-Z][a-zA-Z\\s]{3,30}?)(?:,|\\s+at|\\s+in|\\s+with)/i;
    const currentMatch = expText.match(currentRolePattern);
    
    if (currentMatch && currentMatch[1]) {
      return currentMatch[1].trim();
    }
    
    // Look for the first role mentioned (likely the most recent)
    const rolePattern = /([A-Z][a-zA-Z\\s]{3,30}?)(?:,|\\s+at|\\s+in|\\s+with)/;
    const firstRoleMatch = expText.match(rolePattern);
    
    if (firstRoleMatch && firstRoleMatch[1]) {
      return firstRoleMatch[1].trim();
    }
  }
  
  return 'Position not specified';
}

function extractIndustryFromContent(content: string, skills: string[]): string {
  // Determine industry based on skills and keywords in the resume
  const industryKeywords: { [key: string]: string[] } = {
    'Technology': ['javascript', 'python', 'java', 'react', 'angular', 'node', 'api', 'software', 'developer', 'engineer', 'cloud', 'aws', 'azure', 'gcp', 'database', 'sql', 'devops'],
    'Finance': ['financial', 'banking', 'investment', 'accounting', 'tax', 'audit', 'risk', 'compliance', 'fintech', 'trading', 'portfolio'],
    'Healthcare': ['medical', 'healthcare', 'nurse', 'doctor', 'clinical', 'hospital', 'pharmaceutical', 'biotech', 'patient', 'medicine'],
    'Education': ['education', 'teaching', 'school', 'university', 'professor', 'instructor', 'academic', 'curriculum', 'student'],
    'Marketing': ['marketing', 'advertising', 'brand', 'campaign', 'digital', 'social media', 'seo', 'content', 'pr', 'promotion'],
    'Consulting': ['consultant', 'advisory', 'strategy', 'business', 'management', 'solution', 'advisor', 'analyst', 'project'],
    'E-commerce': ['e-commerce', 'retail', 'sales', 'customer', 'product', 'inventory', 'logistics', 'supply chain', 'omnichannel'],
    'Manufacturing': ['manufacturing', 'production', 'quality', 'operations', 'supply', 'logistics', 'industrial', 'assembly', 'process'],
    'Telecommunications': ['telecom', 'network', 'telecommunications', 'wireless', 'mobile', 'infrastructure', 'protocol'],
    'Energy': ['energy', 'oil', 'gas', 'renewable', 'solar', 'wind', 'power', 'utilities', 'petroleum', 'electric'],
  };
  
  const lowerContent = content.toLowerCase();
  
  // Count matches for each industry
  const industryMatches: { [key: string]: number } = {};
  
  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    let count = 0;
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword)) {
        count++;
      }
    }
    // Also check if any of the extracted skills are related to this industry
    for (const skill of skills) {
      if (keywords.some(kw => skill.toLowerCase().includes(kw))) {
        count += 0.5; // Add partial credit for skills matching industry
      }
    }
    industryMatches[industry] = count;
  }
  
  // Return the industry with the most matches
  const topIndustry = Object.entries(industryMatches).sort((a, b) => b[1] - a[1])[0];
  
  if (topIndustry && topIndustry[1] > 0) {
    return topIndustry[0];
  }
  
  // Default to Technology if no strong indicators
  return 'Technology';
}

// Resume parsing service that analyzes actual resume content
export async function parseResume(file: File): Promise<UserData> {
  try {
    // Extract text content from the file
    const content = await extractFileContent(file);
    
    // Parse the content to extract information
    const fullName = extractNameFromContent(content) || extractName(file.name);
    const experience = extractExperienceFromContent(content);
    const skills = extractSkillsFromContent(content);
    const education = extractEducationFromContent(content);
    const currentRole = extractCurrentRoleFromContent(content);
    const industry = extractIndustryFromContent(content, skills);
    const age = calculateAgeFromExperience(experience);
    const employmentStatus = experience > 0 ? 'employed' : 'fresher';
    
    const parsedData: UserData = {
      fullName,
      age,
      skills,
      employmentStatus,
      experience,
      education,
      currentRole,
      industry,
    };
    
    return parsedData;
  } catch (error) {
    console.error('Error parsing resume:', error);
    
    // Return fallback data if parsing fails
    return {
      fullName: extractName(file.name),
      age: 28,
      skills: ['Communication', 'Teamwork', 'Problem Solving'],
      employmentStatus: 'fresher',
      experience: 0,
      education: 'Education information not found',
      currentRole: 'Recent Graduate',
      industry: 'Technology',
    };
  }
}

// Helper function as fallback when content extraction fails
function calculateAgeFromExperience(experience: number): number {
  // Estimate age based on experience level
  // Assume people start working around age 22
  return Math.min(65, Math.max(22, 22 + experience + Math.floor(Math.random() * 5)));
}

function extractName(fileName: string): string {
  // Extract name from common resume file naming patterns
  const nameMatch = fileName.match(/([A-Za-z]+)_Resume|([A-Za-z]+)_CV|([A-Za-z]+)\.pdf|([A-Za-z]+)\.docx/i);
  if (nameMatch) {
    return nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4] || 'John Doe';
  }
  return 'John Doe';
}

function extractExperience(file: File): number {
  // Default experience if content extraction fails
  return 0;
}

function determineEmploymentStatus(file: File): 'employed' | 'fresher' {
  // Determine employment status based on experience
  const experience = extractExperience(file);
  return experience > 0 ? 'employed' : 'fresher';
}

// Function to read PDF content
export async function readPdfContent(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async () => {
      try {
        const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          const pageText = text.items.map((item: any) => item.str).join(' ');
          textContent += pageText + ' ';
        }
        
        resolve(textContent);
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
}

// Function to read DOCX content
export async function readDocxContent(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('Failed to read DOCX file'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
}

// Function to read TXT content
export async function readTxtContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        resolve(content);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read text file'));
    };
    
    reader.readAsText(file);
  });
}

// Function to extract content based on file type
export async function extractFileContent(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return await readPdfContent(file);
    case 'docx':
      return await readDocxContent(file);
    case 'txt':
      return await readTxtContent(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}