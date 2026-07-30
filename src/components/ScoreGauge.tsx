"use client";

import React from "react";
import { Award, CheckCircle, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";

interface ScoreGaugeProps {
  overallScore: number;
  categoryScores: {
    formatting: number;
    skillMatch: number;
    companyMatch: number;
    quantifiableMetrics: number;
  };
  targetCompanyName: string;
  targetRoleTitle: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  overallScore,
  categoryScores,
  targetCompanyName,
  targetRoleTitle,
}) => {
  // Calculate SVG arc parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Determine badge styling based on score
  const getBadgeStyle = (score: number) => {
    if (score >= 80) {
      return {
        label: "Excellent ATS Match",
        color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
        stroke: "#10b981",
        icon: CheckCircle,
      };
    }
    if (score >= 65) {
      return {
        label: "Moderate Match - Optimization Recommended",
        color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
        stroke: "#f59e0b",
        icon: AlertTriangle,
      };
    }
    return {
      label: "Low ATS Score - Action Required",
      color: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      stroke: "#f43f5e",
      icon: ShieldAlert,
    };
  };

  const badge = getBadgeStyle(overallScore);
  const BadgeIcon = badge.icon;

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-2xl border border-gray-800 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-indigo-400" /> Overall ATS Score
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Combined TF-IDF similarity & formatting evaluation
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${badge.color}`}
        >
          <BadgeIcon className="h-3.5 w-3.5" /> {badge.label}
        </span>
      </div>

      {/* Main Circular Gauge & Breakdown */}
      <div className="py-6 flex flex-col md:flex-row items-center justify-around gap-6">
        {/* SVG Circular Progress Meter */}
        <div className="relative flex items-center justify-center">
          <svg className="h-48 w-48 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Track Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              className="stroke-gray-800"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Animated Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke={badge.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Score Counter */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {overallScore}
            </span>
            <span className="text-xs font-medium text-gray-400">out of 100</span>
            <span className="mt-1 text-[10px] uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> ATS Score
            </span>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="w-full max-w-xs space-y-4">
          {/* Skill / TF-IDF Match */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Skill & TF-IDF Match</span>
              <span className="text-indigo-400">{categoryScores.skillMatch}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all duration-700"
                style={{ width: `${categoryScores.skillMatch}%` }}
              ></div>
            </div>
          </div>

          {/* Company Keyword Match */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">{targetCompanyName} Keyword Fit</span>
              <span className="text-purple-400">{categoryScores.companyMatch}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-purple-500 transition-all duration-700"
                style={{ width: `${categoryScores.companyMatch}%` }}
              ></div>
            </div>
          </div>

          {/* Formatting & Structure */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Formatting Quality</span>
              <span className="text-emerald-400">{categoryScores.formatting}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${categoryScores.formatting}%` }}
              ></div>
            </div>
          </div>

          {/* Quantifiable Impact */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-gray-300">Metrics & Impact Points</span>
              <span className="text-amber-400">{categoryScores.quantifiableMetrics}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-800">
              <div
                className="h-2 rounded-full bg-amber-500 transition-all duration-700"
                style={{ width: `${categoryScores.quantifiableMetrics}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="rounded-xl bg-gray-900/60 p-3 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <span>Target Role: <strong className="text-white">{targetRoleTitle}</strong></span>
        <span>Target Company: <strong className="text-white">{targetCompanyName}</strong></span>
      </div>
    </div>
  );
};
