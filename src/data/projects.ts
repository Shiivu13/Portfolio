export interface Project {
  id: number;
  title: string;
  tags: string[];
  description: string;
  githubUrl: string;
  image: string;
  /** Accent colour for the holographic case-file card. */
  accent: string;
  /** Japanese motif shown as a watermark on the card. */
  kanji: string;
  /** Short category / classification label. */
  category: string;
  /** Lucide icon key (mapped in ProjectsSection). */
  icon: string;
  /** Short status / year tag for the HUD header. */
  year: string;
}

export const projects: Project[] = [
  {
    id: 7,
    title: "Rufus-Twin: AI Shopping Assistant",
    tags: ["React", "FastAPI", "Gemini AI", "Supabase"],
    description: "A smart AI shopping assistant that uses Gemini AI and Tavily Search for real-time web research and product comparisons. Features a sleek React + Vite glassmorphic frontend and a FastAPI + Supabase backend.",
    githubUrl: "https://github.com/Shiivu13/Rufus-Twin",
    image: "/bg-projects.jpg",
    accent: "#7EC8E3",
    kanji: "助手",
    category: "AI ASSISTANT",
    icon: "bot",
    year: "2025",
  },
  {
    id: 1,
    title: "AI-Powered Smart Surveillance",
    tags: ["Python", "YOLOv8", "FastAPI", "AWS"],
    description: "Real-time surveillance system with YOLOv8 human detection, face recognition, behavioral analysis, and AWS cloud deployment. Features live analytics dashboard and event-driven FastAPI backend.",
    githubUrl: "https://github.com/Shiivu13/AI-Powered-Smart-Surveillance-System",
    image: "/bg-projects.jpg",
    accent: "#FF8DA1",
    kanji: "監視",
    category: "COMPUTER VISION",
    icon: "scan",
    year: "2024",
  },
  {
    id: 2,
    title: "AI Evaluation Platform",
    tags: ["Python", "Streamlit", "GenAI", "Gemini"],
    description: "A framework to evaluate and compare Generative AI models using rule-based + LLM-as-a-judge scoring for clarity, risk, consistency, and RAG metrics. Built with Streamlit dashboard.",
    githubUrl: "https://github.com/Shiivu13/AI_evaluation_platform",
    image: "/bg-projects.jpg",
    accent: "#9D8DF1",
    kanji: "評価",
    category: "GENERATIVE AI",
    icon: "gauge",
    year: "2025",
  },
  {
    id: 3,
    title: "Fraud Detection System",
    tags: ["Python", "LightGBM", "SHAP", "Docker"],
    description: "End-to-end fraud detection with imbalanced data handling, PR-AUC optimization, SHAP explainability, and Dockerized FastAPI deployment. Live demo available on Streamlit.",
    githubUrl: "https://github.com/Shiivu13/end-to-end-Fraud-Detection-System-with-explanibility-",
    image: "/bg-projects.jpg",
    accent: "#F4C77E",
    kanji: "検出",
    category: "ML / SECURITY",
    icon: "shield",
    year: "2024",
  },
  {
    id: 4,
    title: "GenAI Audit Trail",
    tags: ["Python", "Risk Scoring", "LLM", "Compliance"],
    description: "Audit trail system that tracks and scores GenAI outputs for compliance, risk assessment, and accountability. Ensures every AI decision is traceable and auditable.",
    githubUrl: "https://github.com/Shiivu13/GenAI-Audit-Trail-Risk-Scoring-System",
    image: "/bg-projects.jpg",
    accent: "#86E3CE",
    kanji: "監査",
    category: "COMPLIANCE",
    icon: "search",
    year: "2025",
  },
  {
    id: 5,
    title: "Movie Recommender",
    tags: ["Python", "Scikit-learn", "TF-IDF", "Streamlit"],
    description: "Content-based movie recommender using TF-IDF vectorization and cosine similarity. Features an interactive Streamlit frontend deployed to Streamlit Cloud.",
    githubUrl: "https://github.com/Shiivu13/Project-1-Recommender",
    image: "/bg-projects.jpg",
    accent: "#6FD3E3",
    kanji: "推薦",
    category: "MACHINE LEARNING",
    icon: "film",
    year: "2023",
  },
  {
    id: 6,
    title: "PsyNotes",
    tags: ["Node.js", "React", "Prisma", "Tailwind"],
    description: "Full-stack notes and blog application with authentication, categories, quizzes, and a modern React + Tailwind UI. Features JWT auth and a RESTful API backend.",
    githubUrl: "https://github.com/Shiivu13/psynotes-froentend",
    image: "/bg-projects.jpg",
    accent: "#C8A8F4",
    kanji: "記録",
    category: "FULL-STACK",
    icon: "notebook",
    year: "2023",
  },
];

export interface Skill {
  name: string;
  level: number;
  /** Short label used on the radar axes. */
  short: string;
  /** Domain key — maps to SKILL_CATEGORIES. */
  category: string;
}

export const skills: Skill[] = [
  { name: "Python / ML", level: 95, short: "PYTHON", category: "ai" },
  { name: "Computer Vision (YOLO, OpenCV)", level: 88, short: "VISION", category: "ai" },
  { name: "GenAI / LLM Evaluation", level: 85, short: "GENAI", category: "ai" },
  { name: "FastAPI / Backend", level: 90, short: "FASTAPI", category: "backend" },
  { name: "SQL / PostgreSQL", level: 82, short: "SQL", category: "backend" },
  { name: "AWS (EC2, S3, Lambda)", level: 85, short: "AWS", category: "cloud" },
  { name: "Docker / DevOps", level: 80, short: "DOCKER", category: "cloud" },
  { name: "React / Node.js", level: 70, short: "REACT", category: "frontend" },
  { name: "Streamlit / Frontend", level: 75, short: "STREAMLIT", category: "frontend" },
  { name: "Java", level: 65, short: "JAVA", category: "backend" },
];

export interface SkillCategory {
  name: string;
  kanji: string;
  accent: string;
}

export const SKILL_CATEGORIES: Record<string, SkillCategory> = {
  ai: { name: "AI / MACHINE LEARNING", kanji: "知能", accent: "#F4A8B4" },
  backend: { name: "BACKEND / DATA", kanji: "基盤", accent: "#7EC8E3" },
  cloud: { name: "CLOUD / DEVOPS", kanji: "雲", accent: "#9D8DF1" },
  frontend: { name: "FRONTEND", kanji: "画面", accent: "#F4C77E" },
};
