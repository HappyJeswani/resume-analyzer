"use client";

import React, { useState } from "react";
import { Building, CheckCircle2, XCircle, Shield, ArrowUpRight } from "lucide-react";

export interface CompanyScoreItem {
  companyId: string;
  companyName: string;
  score: number;
  passingScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  isTarget: boolean;
}

interface CompanyBreakdownProps {
  companyScores: CompanyScoreItem[];
}

export const CompanyBreakdown: React.FC<CompanyBreakdownProps> = ({ companyScores }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const selectedCompany = companyScores.find((c) => c.companyId === selectedCompanyId);

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-2xl border border-gray-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-400" /> MNC Company-wise ATS Scores
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Evaluation across major tech & consulting hiring algorithms
          </p>
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Passing Threshold
          </span>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {companyScores.map((comp) => {
          const isPassing = comp.score >= comp.passingScore;

          return (
            <div
              key={comp.companyId}
              onClick={() => setSelectedCompanyId(comp.companyId)}
              className={`group cursor-pointer rounded-xl p-4 transition-all border ${
                comp.isTarget
                  ? "bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "bg-gray-900/50 border-gray-800 hover:border-gray-700 hover:bg-gray-800/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {comp.companyName}
                    </span>
                    {comp.isTarget && (
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                        Target
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Min Req: {comp.passingScore}%
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`text-lg font-extrabold ${
                      isPassing ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {comp.score}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isPassing ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${comp.score}%` }}
                ></div>
              </div>

              {/* Status footer */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span
                  className={`flex items-center gap-1 font-medium ${
                    isPassing ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isPassing ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" /> Qualified
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" /> Below Threshold
                    </>
                  )}
                </span>
                <span className="text-indigo-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  View <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Company Keyword Detail Drawer / Modal */}
      {selectedCompany && (
        <div className="mt-4 rounded-xl bg-gray-900/90 border border-indigo-500/30 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              Detailed Keyword Breakdown: {selectedCompany.companyName}
            </h3>
            <button
              onClick={() => setSelectedCompanyId(null)}
              className="text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Keywords */}
            <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-3 space-y-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Matched Keywords (
                {selectedCompany.matchedKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCompany.matchedKeywords.length > 0 ? (
                  selectedCompany.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/20"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">No exact keywords matched yet.</span>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="rounded-lg bg-rose-950/20 border border-rose-500/20 p-3 space-y-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" /> Missing High-Weight Keywords (
                {selectedCompany.missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedCompany.missingKeywords.length > 0 ? (
                  selectedCompany.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-300 border border-rose-500/20"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">All target keywords present!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
