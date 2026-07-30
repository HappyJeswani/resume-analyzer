"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Building2,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { TARGET_COMPANIES, TARGET_JOB_ROLES } from "@/lib/companyData";

interface FileUploaderProps {
  onAnalyze: (data: {
    file: File | null;
    resumeText: string;
    targetRoleId: string;
    targetCompanyId: string;
  }) => void;
  isLoading: boolean;
  externalResumeText?: string;
  onClearExternalText?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onAnalyze,
  isLoading,
  externalResumeText = "",
  onClearExternalText,
}) => {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [targetRoleId, setTargetRoleId] = useState<string>("software-engineer");
  const [targetCompanyId, setTargetCompanyId] = useState<string>("google");
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize externally loaded sample text
  React.useEffect(() => {
    if (externalResumeText) {
      setPastedText(externalResumeText);
      setActiveTab("text");
    }
  }, [externalResumeText]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const isPdfDocx =
      validTypes.includes(file.type) ||
      file.name.endsWith(".pdf") ||
      file.name.endsWith(".docx");

    if (isPdfDocx) {
      setSelectedFile(file);
      setActiveTab("file");
    } else {
      alert("Please upload a valid PDF or DOCX file.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "file" && !selectedFile) {
      alert("Please select a resume file (PDF/DOCX) to upload.");
      return;
    }
    if (activeTab === "text" && !pastedText.trim()) {
      alert("Please paste your resume text.");
      return;
    }

    onAnalyze({
      file: activeTab === "file" ? selectedFile : null,
      resumeText: activeTab === "text" ? pastedText : "",
      targetRoleId,
      targetCompanyId,
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPastedText("");
    if (onClearExternalText) onClearExternalText();
  };

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-2xl transition-all border border-gray-800">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileUp className="h-5 w-5 text-indigo-400" /> Upload Resume or Paste Text
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Support PDF and DOCX files. Select your target position & company for TF-IDF keyword optimization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl bg-gray-900/90 p-1 border border-gray-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "file"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === "text"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* File Dropzone */}
        {activeTab === "file" && (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/10"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-gray-800 bg-gray-900/40 hover:border-indigo-500/50 hover:bg-gray-900/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="rounded-full bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready for analysis
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline pt-1"
                  >
                    Choose a different file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="rounded-2xl bg-indigo-600/10 p-4 text-indigo-400 border border-indigo-500/20">
                    <UploadCloud className="h-9 w-9" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      Drag & drop your resume file here, or{" "}
                      <span className="text-indigo-400 font-semibold underline">Browse</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF and DOCX formats (Max size: 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text Area */}
        {activeTab === "text" && (
          <div>
            <textarea
              rows={7}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your raw resume text here... (e.g. Skills, Experience, Education, Projects)"
              className="w-full rounded-xl glass-input p-4 text-xs font-mono placeholder-gray-500 transition-all"
            ></textarea>
            {pastedText && (
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>Word count: {pastedText.trim().split(/\s+/).filter(Boolean).length} words</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Clear Text
                </button>
              </div>
            )}
          </div>
        )}

        {/* Target Selectors */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
          {/* Target Job Role */}
          <div>
            <label className="mb-1.5 flex items-center space-x-1.5 text-xs font-semibold text-gray-300">
              <Briefcase className="h-4 w-4 text-indigo-400" />
              <span>Target Job Role</span>
            </label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {TARGET_JOB_ROLES.map((role) => (
                <option key={role.id} value={role.id} className="bg-gray-900 text-white">
                  {role.title} ({role.category})
                </option>
              ))}
            </select>
          </div>

          {/* Target Company */}
          <div>
            <label className="mb-1.5 flex items-center space-x-1.5 text-xs font-semibold text-gray-300">
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span>Target Company (MNC)</span>
            </label>
            <select
              value={targetCompanyId}
              onChange={(e) => setTargetCompanyId(e.target.value)}
              className="w-full rounded-xl glass-input px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {TARGET_COMPANIES.map((company) => (
                <option key={company.id} value={company.id} className="bg-gray-900 text-white">
                  {company.name} (Passing ATS: {company.passingScore}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>Evaluating ATS Score & Gemini AI Insights...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Run AI Resume Analysis & ATS Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
