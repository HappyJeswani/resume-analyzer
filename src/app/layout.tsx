import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Analyzer - ATS Score & Detailed Insights",
  description:
    "Evaluate resume strength, company-specific ATS compatibility scores (Google, Amazon, Microsoft, TCS, Infosys, Accenture, JP Morgan), and get AI-powered career insights.",
  keywords: [
    "AI Resume Analyzer",
    "ATS Score Checker",
    "Resume Scanner",
    "Job Optimization",
    "Gemini AI",
    "Career Insights",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
