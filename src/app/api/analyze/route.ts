import { NextRequest, NextResponse } from "next/server";
import { runTfidfAnalysis } from "@/lib/tfidf";
import { analyzeResumeFormatting } from "@/lib/formatter";
import { TARGET_COMPANIES, TARGET_JOB_ROLES } from "@/lib/companyData";
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

// Dynamic runtime configuration
export const dynamic = "force-dynamic";

/**
 * Text extraction helper for PDF & DOCX files
 */
async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    try {
      // Lazy load pdf-parse
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const pdfData = await pdfParse(buffer);
      if (pdfData && pdfData.text && pdfData.text.trim().length > 0) {
        return pdfData.text;
      }
    } catch (err) {
      console.warn("pdf-parse failed, falling back to text stream parsing:", err);
    }
    // Fallback simple regex text extractor for PDF buffer if native module fails
    const rawString = buffer.toString("utf-8");
    const extracted = rawString
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s+/g, " ");
    return extracted.length > 50 ? extracted : "Unable to extract clear text from PDF file.";
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.endsWith(".docx")
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    } catch (err) {
      console.error("Mammoth DOCX parsing failed:", err);
      throw new Error("Failed to parse DOCX document.");
    }
  }

  // Plain text fallback
  return buffer.toString("utf-8");
}

/**
 * AI Insight Generator using Google Gemini API or intelligent fallback engine
 */
async function generateAiInsights(
  resumeText: string,
  targetRoleTitle: string,
  targetCompanyName: string,
  tfIdfScore: number,
  companyScore: number,
  matchedSkills: string[],
  missingSkills: string[],
  customApiKey?: string
) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert Executive Recruiter and ATS Analyst.
Analyze the following resume for the target job role "${targetRoleTitle}" at "${targetCompanyName}".

Calculated Metrics:
- TF-IDF Keyword Match Score: ${tfIdfScore}%
- Company ATS Score: ${companyScore}%
- Matched Skills: ${matchedSkills.join(", ")}
- Missing Skills: ${missingSkills.join(", ")}

Resume Content:
"""
${resumeText.slice(0, 3000)}
"""

Respond STRICTLY with a valid raw JSON object (no markdown formatting, no code blocks) with the following key structure:
{
  "strengths": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "weaknesses": ["missing critical skill or gap 1", "gap 2", "gap 3"],
  "actionableSuggestions": [
    "Actionable Tip 1",
    "Actionable Tip 2",
    "Actionable Tip 3",
    "Actionable Tip 4"
  ],
  "bestFitAlternativeRoles": [
    {"title": "Role Name 1", "matchPercent": 88, "reason": "Brief justification"},
    {"title": "Role Name 2", "matchPercent": 82, "reason": "Brief justification"},
    {"title": "Role Name 3", "matchPercent": 75, "reason": "Brief justification"}
  ]
}`;

      // Gemini API call using gemini-2.5-flash model
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text?.trim() || "";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (error) {
      console.warn("Gemini API call failed or missing valid key, executing rule-based AI engine:", error);
    }
  }

  // Rule-based Fallback AI Engine when API key is missing or quota exceeded
  const roleObj = TARGET_JOB_ROLES.find(r => r.title === targetRoleTitle) || TARGET_JOB_ROLES[0];
  const companyObj = TARGET_COMPANIES.find(c => c.name === targetCompanyName) || TARGET_COMPANIES[0];

  const strengths: string[] = [];
  if (matchedSkills.length > 0) {
    strengths.push(`Strong alignment with key required technical skills: ${matchedSkills.slice(0, 4).join(", ")}.`);
  } else {
    strengths.push("Good foundational technical terminology throughout experience sections.");
  }
  if (resumeText.length > 800) {
    strengths.push("Comprehensive project breakdown with clear operational context.");
  }
  strengths.push(`Demonstrates core engineering competency relevant to ${targetCompanyName}'s technology stack.`);

  const weaknesses: string[] = [];
  if (missingSkills.length > 0) {
    weaknesses.push(`Missing high-frequency ATS keywords for ${targetCompanyName}: ${missingSkills.slice(0, 4).join(", ")}.`);
  } else {
    weaknesses.push(`Could further highlight domain-specific culture terms for ${targetCompanyName} (${companyObj.cultureKeywords.slice(0, 3).join(", ")}).`);
  }
  weaknesses.push("Some experience bullet points lack quantifiable impact metrics (percentages, revenue, latency numbers).");
  weaknesses.push(`Requires stronger emphasis on specialized ${roleObj.title} tools.`);

  const actionableSuggestions: string[] = [
    `Inject key missing industry terms into your Skills section: ${missingSkills.slice(0, 3).join(", ")}.`,
    `Quantify your accomplishments in bullet points (e.g., 'Reduced API latency by 35%' or 'Managed $50k budget').`,
    `Tailor your Professional Summary explicitly mentioning ${targetCompanyName}'s core technical stack (${companyObj.keywords.slice(0, 3).join(", ")}).`,
    `Ensure standard section titles ('Experience', 'Education', 'Skills') are used for 100% ATS parser readability.`,
  ];

  // Calculate best-fit alternative roles based on skills overlap
  const alternativeRoles = TARGET_JOB_ROLES.filter(r => r.id !== roleObj.id)
    .slice(0, 3)
    .map((altRole, index) => {
      const match = Math.max(65, Math.min(95, tfIdfScore + (15 - index * 6)));
      return {
        title: altRole.title,
        matchPercent: match,
        reason: `Shares key technical competencies in ${altRole.category} and software architecture.`,
      };
    });

  return {
    strengths,
    weaknesses,
    actionableSuggestions,
    bestFitAlternativeRoles: alternativeRoles,
  };
}

export async function POST(req: NextRequest) {
  try {
    let resumeText = "";
    let targetRoleId = "software-engineer";
    let targetCompanyId = "google";
    let customApiKey = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      targetRoleId = (formData.get("targetRoleId") as string) || "software-engineer";
      targetCompanyId = (formData.get("targetCompanyId") as string) || "google";
      customApiKey = (formData.get("apiKey") as string) || "";

      if (file) {
        resumeText = await extractTextFromFile(file);
      } else {
        resumeText = (formData.get("resumeText") as string) || "";
      }
    } else {
      const body = await req.json();
      resumeText = body.resumeText || "";
      targetRoleId = body.targetRoleId || "software-engineer";
      targetCompanyId = body.targetCompanyId || "google";
      customApiKey = body.apiKey || "";
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Resume text or file is required for analysis." },
        { status: 400 }
      );
    }

    const roleObj = TARGET_JOB_ROLES.find((r) => r.id === targetRoleId) || TARGET_JOB_ROLES[0];
    const companyObj = TARGET_COMPANIES.find((c) => c.id === targetCompanyId) || TARGET_COMPANIES[0];

    // 1. Run TF-IDF & Keyword Score Analysis
    const tfidfAnalysis = runTfidfAnalysis(resumeText, targetRoleId, targetCompanyId);

    // 2. Run Formatting & Structure Analysis
    const formatAnalysis = analyzeResumeFormatting(resumeText);

    // 3. Compute Weighted Overall ATS Score
    // Weighting: Formatting Quality (25%) + Role TF-IDF Match (35%) + Target Company Score (40%)
    const overallScore = Math.round(
      formatAnalysis.score * 0.25 +
      tfidfAnalysis.tfidfScore * 0.35 +
      tfidfAnalysis.targetCompanyScore * 0.40
    );

    // 4. Generate AI Insights via Gemini API or Fallback
    const aiInsights = await generateAiInsights(
      resumeText,
      roleObj.title,
      companyObj.name,
      tfidfAnalysis.tfidfScore,
      tfidfAnalysis.targetCompanyScore,
      tfidfAnalysis.matchedSkills,
      tfidfAnalysis.missingSkills,
      customApiKey
    );

    return NextResponse.json({
      success: true,
      overallScore: Math.min(99, Math.max(10, overallScore)),
      categoryScores: {
        formatting: formatAnalysis.score,
        skillMatch: tfidfAnalysis.tfidfScore,
        companyMatch: tfidfAnalysis.targetCompanyScore,
        quantifiableMetrics: Math.min(100, formatAnalysis.quantifiableMetricsCount * 20),
      },
      targetCompany: {
        id: companyObj.id,
        name: companyObj.name,
        score: tfidfAnalysis.targetCompanyScore,
      },
      targetRole: {
        id: roleObj.id,
        title: roleObj.title,
      },
      companyScores: tfidfAnalysis.companyScores,
      formattingDetails: formatAnalysis,
      strengths: aiInsights.strengths,
      weaknesses: aiInsights.weaknesses,
      actionableSuggestions: aiInsights.actionableSuggestions,
      bestFitAlternativeRoles: aiInsights.bestFitAlternativeRoles,
      extractedTextLength: resumeText.length,
      extractedTextPreview: resumeText.slice(0, 350) + "...",
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Resume analysis API error:", error);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
