"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FileUploader } from "@/components/FileUploader";
import { ScoreGauge } from "@/components/ScoreGauge";
import { CompanyBreakdown, CompanyScoreItem } from "@/components/CompanyBreakdown";
import { InsightsView } from "@/components/InsightsView";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SAMPLE_RESUMES } from "@/lib/sampleResumes";
import { Sparkles, ShieldCheck, Cpu, Building2, Zap, ArrowDown } from "lucide-react";

interface AnalysisResult {
  overallScore: number;
  categoryScores: {
    formatting: number;
    skillMatch: number;
    companyMatch: number;
    quantifiableMetrics: number;
  };
  targetCompany: {
    id: string;
    name: string;
    score: number;
  };
  targetRole: {
    id: string;
    title: string;
  };
  companyScores: CompanyScoreItem[];
  formattingDetails: {
    score: number;
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
  };
  strengths: string[];
  weaknesses: string[];
  actionableSuggestions: string[];
  bestFitAlternativeRoles: {
    title: string;
    matchPercent: number;
    reason: string;
  }[];
  extractedTextLength: number;
}

export default function Home() {
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Resume text state for sample loading
  const [externalResumeText, setExternalResumeText] = useState("");

  // Load API key from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("GEMINI_API_KEY");
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("GEMINI_API_KEY", key);
    } else {
      localStorage.removeItem("GEMINI_API_KEY");
    }
  };

  const handleSelectSampleResume = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId);
    if (sample) {
      setExternalResumeText(sample.text);
      setErrorMsg("");
    }
  };

  const handleRunAnalysis = async (data: {
    file: File | null;
    resumeText: string;
    targetRoleId: string;
    targetCompanyId: string;
  }) => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      let res;
      if (data.file) {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("targetRoleId", data.targetRoleId);
        formData.append("targetCompanyId", data.targetCompanyId);
        if (apiKey) formData.append("apiKey", apiKey);

        res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: data.resumeText,
            targetRoleId: data.targetRoleId,
            targetCompanyId: data.targetCompanyId,
            apiKey: apiKey,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to analyze resume.");
      }

      setAnalysisResult(json);

      // Scroll to dashboard after completion
      setTimeout(() => {
        const dashboardElement = document.getElementById("results-dashboard");
        if (dashboardElement) {
          dashboardElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onSelectSampleResume={handleSelectSampleResume}
        hasCustomKey={Boolean(apiKey)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Banner */}
        <section className="text-center space-y-4 pt-4 pb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>AI Resume Optimization & TF-IDF ATS Scoring</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
            Land Top Tech Interviews with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Precision ATS Scoring & AI Insights
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-400 leading-relaxed">
            Evaluate your resume against top MNC hiring weightings (Google, Amazon, Microsoft, TCS, Infosys, Accenture, JP Morgan). Uncover missing skills, formatting gaps, and actionable fixes powered by Google Gemini AI.
          </p>

          {/* Feature Badge Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-gray-400">
            <span className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1 border border-gray-800">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" /> TF-IDF Keyword Formula
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1 border border-gray-800">
              <Building2 className="h-3.5 w-3.5 text-purple-400" /> 7 MNC ATS Profiles
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1 border border-gray-800">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Instant PDF & DOCX Parser
            </span>
            <span className="flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1 border border-gray-800">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Secure & Vercel Ready
            </span>
          </div>
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg("")}
              className="text-rose-400 hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Input Section */}
        <section className="max-w-4xl mx-auto">
          <FileUploader
            onAnalyze={handleRunAnalysis}
            isLoading={isLoading}
            externalResumeText={externalResumeText}
            onClearExternalText={() => setExternalResumeText("")}
          />
        </section>

        {/* Results Dashboard */}
        {analysisResult && (
          <section id="results-dashboard" className="space-y-8 pt-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                  <ArrowDown className="h-4 w-4" />
                </div>
                <h2 className="text-xl font-bold text-white">Analysis Results Dashboard</h2>
              </div>
              <span className="text-xs text-gray-400">
                Text parsed: {analysisResult.extractedTextLength} chars
              </span>
            </div>

            {/* Overall Score Gauge */}
            <ScoreGauge
              overallScore={analysisResult.overallScore}
              categoryScores={analysisResult.categoryScores}
              targetCompanyName={analysisResult.targetCompany.name}
              targetRoleTitle={analysisResult.targetRole.title}
            />

            {/* Company Breakdown Scores */}
            <CompanyBreakdown companyScores={analysisResult.companyScores} />

            {/* Detailed AI Insights */}
            <InsightsView
              strengths={analysisResult.strengths}
              weaknesses={analysisResult.weaknesses}
              actionableSuggestions={analysisResult.actionableSuggestions}
              bestFitAlternativeRoles={analysisResult.bestFitAlternativeRoles}
              targetRoleTitle={analysisResult.targetRole.title}
              targetCompanyName={analysisResult.targetCompany.name}
              overallScore={analysisResult.overallScore}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 bg-gray-950/60 py-6 text-center text-xs text-gray-500">
        <p>© 2026 AI Resume Analyzer (ResumePulse AI). Built with Next.js (App Router), Tailwind CSS & Google Gemini API.</p>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}
