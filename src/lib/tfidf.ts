import { TARGET_COMPANIES, TARGET_JOB_ROLES, CompanyProfile, JobRoleProfile } from "./companyData";

// Standard English Stopwords list
const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
  "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down",
  "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't",
  "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself",
  "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
  "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not",
  "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
  "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
  "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's",
  "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
  "you've", "your", "yours", "yourself", "yourselves"
]);

/**
 * Tokenizes and normalizes text into clean words/terms
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  // Convert to lowercase and strip special characters except space & plus (e.g. c++, c#)
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9+#\s-]/g, " ")
    .replace(/\s+/g, " ");

  const words = cleaned.split(" ");
  return words.filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

/**
 * Computes Term Frequency (TF) map for a document
 */
export function computeTF(tokens: string[]): Record<string, number> {
  const tfMap: Record<string, number> = {};
  if (tokens.length === 0) return tfMap;

  for (const token of tokens) {
    tfMap[token] = (tfMap[token] || 0) + 1;
  }

  // Normalize by total tokens count
  for (const token in tfMap) {
    tfMap[token] = tfMap[token] / tokens.length;
  }

  return tfMap;
}

/**
 * Computes IDF for a vocabulary across a corpus of reference texts
 */
export function computeIDF(vocabulary: string[], corpus: string[][]): Record<string, number> {
  const idfMap: Record<string, number> = {};
  const N = corpus.length;

  for (const term of vocabulary) {
    let docCount = 0;
    for (const docTokens of corpus) {
      if (docTokens.includes(term)) {
        docCount++;
      }
    }
    // Smooth IDF formula: log((N + 1) / (docCount + 1)) + 1
    idfMap[term] = Math.log((N + 1) / (docCount + 1)) + 1;
  }

  return idfMap;
}

/**
 * Calculates Cosine Similarity between two TF-IDF vectors
 */
export function calculateCosineSimilarity(
  tfIdfVectorA: Record<string, number>,
  tfIdfVectorB: Record<string, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  const allTerms = new Set([...Object.keys(tfIdfVectorA), ...Object.keys(tfIdfVectorB)]);

  for (const term of allTerms) {
    const valA = tfIdfVectorA[term] || 0;
    const valB = tfIdfVectorB[term] || 0;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Evaluates Resume keyword match & weighted score against a Target Company
 */
export function calculateCompanyAtsScore(
  resumeText: string,
  company: CompanyProfile,
  roleSkills: string[]
): { score: number; matchedKeywords: string[]; missingKeywords: string[] } {
  const tokens = tokenizeText(resumeText);
  const tokenSet = new Set(tokens);
  const resumeRawLower = resumeText.toLowerCase();

  let totalWeight = 0;
  let earnedWeight = 0;

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  // Check company target keywords
  for (const keyword of company.keywords) {
    const kwLower = keyword.toLowerCase();
    const weight = company.weightings[kwLower] || 1.5;
    totalWeight += weight;

    // Check exact phrase or token match
    const isMatched = tokenSet.has(kwLower) || resumeRawLower.includes(kwLower);

    if (isMatched) {
      earnedWeight += weight;
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  // Check overlap with role required skills
  for (const skill of roleSkills) {
    const skillLower = skill.toLowerCase();
    const weight = 1.0;
    totalWeight += weight;

    if (tokenSet.has(skillLower) || resumeRawLower.includes(skillLower)) {
      earnedWeight += weight;
    }
  }

  const baseScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 50;

  // Normalize final score between 10 and 98
  const score = Math.round(Math.min(98, Math.max(15, baseScore)));

  return {
    score,
    matchedKeywords,
    missingKeywords,
  };
}

/**
 * Runs full TF-IDF engine across all target companies and job role
 */
export function runTfidfAnalysis(
  resumeText: string,
  targetRoleId: string,
  targetCompanyId: string
) {
  const role = TARGET_JOB_ROLES.find((r) => r.id === targetRoleId) || TARGET_JOB_ROLES[0];
  const selectedCompany = TARGET_COMPANIES.find((c) => c.id === targetCompanyId) || TARGET_COMPANIES[0];

  // Tokenize candidate resume
  const resumeTokens = tokenizeText(resumeText);
  const resumeTF = computeTF(resumeTokens);

  // Build corpus from job roles + companies
  const corpus: string[][] = [
    resumeTokens,
    ...TARGET_JOB_ROLES.map((r) => tokenizeText([...r.requiredSkills, ...r.recommendedKeywords].join(" "))),
    ...TARGET_COMPANIES.map((c) => tokenizeText(c.keywords.join(" "))),
  ];

  // Target Role Corpus
  const roleCorpusText = [...role.requiredSkills, ...role.recommendedKeywords].join(" ");
  const roleTokens = tokenizeText(roleCorpusText);
  const roleTF = computeTF(roleTokens);

  // Compute vocabulary & IDF
  const vocab = Array.from(new Set([...resumeTokens, ...roleTokens]));
  const idf = computeIDF(vocab, corpus);

  // Create TF-IDF vectors
  const resumeTfidf: Record<string, number> = {};
  const roleTfidf: Record<string, number> = {};

  for (const term of vocab) {
    resumeTfidf[term] = (resumeTF[term] || 0) * (idf[term] || 1);
    roleTfidf[term] = (roleTF[term] || 0) * (idf[term] || 1);
  }

  // Similarity score (0 - 100)
  const cosineSim = calculateCosineSimilarity(resumeTfidf, roleTfidf);
  const tfidfScore = Math.round(cosineSim * 100);

  // Company Breakdown Scores
  const companyScores = TARGET_COMPANIES.map((company) => {
    const res = calculateCompanyAtsScore(resumeText, company, role.requiredSkills);
    return {
      companyId: company.id,
      companyName: company.name,
      score: res.score,
      passingScore: company.passingScore,
      matchedKeywords: res.matchedKeywords,
      missingKeywords: res.missingKeywords,
      isTarget: company.id === targetCompanyId,
    };
  });

  const targetCompanyRes = companyScores.find((c) => c.companyId === targetCompanyId) || companyScores[0];

  return {
    tfidfScore,
    targetCompanyScore: targetCompanyRes.score,
    companyScores,
    matchedSkills: targetCompanyRes.matchedKeywords,
    missingSkills: targetCompanyRes.missingKeywords,
  };
}
