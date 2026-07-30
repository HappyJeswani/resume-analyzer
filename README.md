# 📄 AI Resume Analyzer (NLP + LLM Assignment)

An AI-powered ATS resume analyzer built with Next.js, Tailwind CSS, Google Gemini API, and TF-IDF keyword matching.

## 🔗 Live Demo & Links
- **Live Vercel App:** [https://resume-analyzer-steel-one.vercel.app](https://resume-analyzer-steel-one.vercel.app)
- **GitHub Repository:** [Your GitHub Repo URL]

---

## 🤖 Prompts Used (LLM Build)

The following prompt was used with the AI Agent to build the web application:

> "Build a full-stack 'AI Resume Analyzer' web app using Next.js and Tailwind CSS. Let users upload a resume (PDF/DOCX) and select a target job role and company (from major MNCs like TCS, Infosys, Google, Amazon, Microsoft, Accenture). Calculate an ATS score (0-100) based on keyword match and formatting. Show a different score per selected company. List strengths, weaknesses, and 3-5 improvement suggestions. Recommend the top 3 best-fit roles. Use an LLM API for the analysis text and a rule-based/TF-IDF method for the numeric score. Keep the API key in an environment variable. Make it deployable on Vercel. Set up everything, write the code, install dependencies, and run it locally."

---

## ⚙️ Features
- **ATS Scoring (0-100):** Calculated using TF-IDF keyword matching and rule-based formatting checks.
- **Company-Specific Benchmarking:** Tailored criteria for major MNCs (Google, Amazon, TCS, Infosys, etc.).
- **LLM Insights:** AI-generated strengths, weaknesses, and actionable recommendations.
- **Role Recommendations:** Top 3 best-fit job categories.

---

## 🔬 NLP Pipeline & Dataset
- **Dataset Used:** Kaggle "Resume Dataset" by Snehaan Bhawal (2,400+ resumes across 24 categories).
- **Pipeline:**
  1. Text cleaning (lowercasing, stopword removal, lemmatization).
  2. TF-IDF feature extraction & skill parsing via spaCy/skill dictionaries.
  3. Logistic Regression/SVM classification for category prediction & cosine similarity matching.
  4. Accuracy, Precision, Recall, F1-score evaluation and Confusion Matrix visualization.

---

## 💻 Local Setup
1. Clone repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Add `.env.local` with `GEMINI_API_KEY=your_key`
4. Run locally: `npm run dev`