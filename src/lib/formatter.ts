export interface FormatCheckResult {
  score: number; // 0 - 100
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedin: boolean;
  hasGithub: boolean;
  detectedSections: string[];
  missingSections: string[];
  quantifiableMetricsCount: number;
  actionVerbsCount: number;
  wordCount: number;
  feedback: string[];
}

const CRITICAL_SECTIONS = [
  { name: "Experience / Work History", regex: /(experience|work history|employment|career history)/i },
  { name: "Education", regex: /(education|academic|qualification|university|degree)/i },
  { name: "Skills / Technical Expertise", regex: /(skills|technical skills|technologies|expertise|competencies)/i },
  { name: "Projects", regex: /(projects|key projects|portfolio|built)/i },
];

const ACTION_VERBS = [
  "built", "developed", "scaled", "engineered", "optimized", "implemented", "designed",
  "led", "architected", "delivered", "increased", "reduced", "automated", "created",
  "managed", "spearheaded", "orchestrated", "launched", "streamlined", "improved"
];

export function analyzeResumeFormatting(resumeText: string): FormatCheckResult {
  if (!resumeText) {
    return {
      score: 0,
      hasEmail: false,
      hasPhone: false,
      hasLinkedin: false,
      hasGithub: false,
      detectedSections: [],
      missingSections: CRITICAL_SECTIONS.map(s => s.name),
      quantifiableMetricsCount: 0,
      actionVerbsCount: 0,
      wordCount: 0,
      feedback: ["Resume text is empty."],
    };
  }

  const feedback: string[] = [];

  // Contact Info Checks
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/.test(resumeText);
  const hasLinkedin = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i.test(resumeText);
  const hasGithub = /(github\.com\/[a-zA-Z0-9_-]+|gitlab\.com\/[a-zA-Z0-9_-]+)/i.test(resumeText);

  // Section Headers Checks
  const detectedSections: string[] = [];
  const missingSections: string[] = [];

  for (const section of CRITICAL_SECTIONS) {
    if (section.regex.test(resumeText)) {
      detectedSections.push(section.name);
    } else {
      missingSections.push(section.name);
    }
  }

  // Quantifiable Metrics Check (e.g. 40%, $10M, 500k, 3x)
  const metricMatches = resumeText.match(/(\d+%\s*|\$\s*\d+[\d,.]*|\b\d+x\b|\b\d+\s*(users|clients|projects|million|thousand|k|m)\b)/gi);
  const quantifiableMetricsCount = metricMatches ? metricMatches.length : 0;

  // Action Verbs Check
  const lowerText = resumeText.toLowerCase();
  let actionVerbsCount = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      actionVerbsCount += matches.length;
    }
  }

  // Word Count Check
  const words = resumeText.trim().split(/\s+/);
  const wordCount = words.length;

  // Score Calculation (Base 100)
  let score = 0;

  // 1. Contact info (Max 25 pts)
  if (hasEmail) score += 10;
  else feedback.push("Add a clear email address at the top.");
  if (hasPhone) score += 5;
  if (hasLinkedin) score += 5;
  else feedback.push("Include a link to your LinkedIn profile.");
  if (hasGithub) score += 5;

  // 2. Sections (Max 35 pts)
  score += Math.round((detectedSections.length / CRITICAL_SECTIONS.length) * 35);
  if (missingSections.length > 0) {
    feedback.push(`Missing section headers: ${missingSections.join(", ")}.`);
  }

  // 3. Impact & Quantifiable Metrics (Max 25 pts)
  if (quantifiableMetricsCount >= 5) {
    score += 25;
  } else if (quantifiableMetricsCount >= 2) {
    score += 15;
    feedback.push("Add more quantified metrics (e.g., %, $, team size, growth numbers).");
  } else {
    score += 5;
    feedback.push("Strong resumes include measurable results like 'Increased revenue by 35%'.");
  }

  // 4. Action Verbs & Length (Max 15 pts)
  if (actionVerbsCount >= 8) score += 10;
  else score += 5;

  if (wordCount >= 300 && wordCount <= 1200) {
    score += 5;
  } else if (wordCount < 300) {
    feedback.push("Resume is too short. Aim for at least 350-600 words.");
  } else {
    feedback.push("Resume is lengthy. Try concising it to 1-2 focused pages.");
  }

  return {
    score: Math.min(100, Math.max(20, score)),
    hasEmail,
    hasPhone,
    hasLinkedin,
    hasGithub,
    detectedSections,
    missingSections,
    quantifiableMetricsCount,
    actionVerbsCount,
    wordCount,
    feedback,
  };
}
