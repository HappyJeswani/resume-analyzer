"use client";

import React from "react";
import { Sparkles, Key, FileCheck2, Cpu } from "lucide-react";
import { SAMPLE_RESUMES } from "@/lib/sampleResumes";

interface HeaderProps {
  onOpenApiKeyModal: () => void;
  onSelectSampleResume: (sampleId: string) => void;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiKeyModal,
  onSelectSampleResume,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Resume<span className="text-indigo-400">Pulse</span> AI
              </h1>
              <span className="hidden rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 sm:inline-flex items-center gap-1">
                <Cpu className="h-3 w-3" /> TF-IDF + Gemini
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Enterprise ATS Score & MNC Compatibility Intelligence
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sample Resume Quick Loader */}
          <div className="relative group">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  onSelectSampleResume(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="cursor-pointer appearance-none rounded-lg bg-gray-900 border border-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 transition-all hover:bg-gray-800 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>
                ⚡ Quick Load Sample
              </option>
              {SAMPLE_RESUMES.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Config Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${
              hasCustomKey
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-700"
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasCustomKey ? "Gemini Key Active" : "Set API Key"}
            </span>
            {hasCustomKey && <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
