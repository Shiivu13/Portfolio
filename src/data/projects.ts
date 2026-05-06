export interface Project {
  id: number;
  title: string;
  tags: string[];
  description: string;
  githubUrl: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: 7,
    title: "Rufus-Twin: AI Shopping Assistant",
    tags: ["React", "FastAPI", "Gemini AI", "Supabase"],
    description: "A smart AI shopping assistant that uses Gemini AI and Tavily Search for real-time web research and product comparisons. Features a sleek React + Vite glassmorphic frontend and a FastAPI + Supabase backend.",
    githubUrl: "https://github.com/Shiivu13/Rufus-Twin",
    image: "/bg-projects.jpg",
  },
  {
    id: 1,
    title: "AI-Powered Smart Surveillance",
    tags: ["Python", "YOLOv8", "FastAPI", "AWS"],
    description: "Real-time surveillance system with YOLOv8 human detection, face recognition, behavioral analysis, and AWS cloud deployment. Features live analytics dashboard and event-driven FastAPI backend.",
    githubUrl: "https://github.com/Shiivu13/AI-Powered-Smart-Surveillance-System",
    image: "/bg-projects.jpg",
  },
  {
    id: 2,
    title: "AI Evaluation Platform",
    tags: ["Python", "Streamlit", "GenAI", "Gemini"],
    description: "A framework to evaluate and compare Generative AI models using rule-based + LLM-as-a-judge scoring for clarity, risk, consistency, and RAG metrics. Built with Streamlit dashboard.",
    githubUrl: "https://github.com/Shiivu13/AI_evaluation_platform",
    image: "/bg-projects.jpg",
  },
  {
    id: 3,
    title: "Fraud Detection System",
    tags: ["Python", "LightGBM", "SHAP", "Docker"],
    description: "End-to-end fraud detection with imbalanced data handling, PR-AUC optimization, SHAP explainability, and Dockerized FastAPI deployment. Live demo available on Streamlit.",
    githubUrl: "https://github.com/Shiivu13/end-to-end-Fraud-Detection-System-with-explanibility-",
    image: "/bg-projects.jpg",
  },
  {
    id: 4,
    title: "GenAI Audit Trail",
    tags: ["Python", "Risk Scoring", "LLM", "Compliance"],
    description: "Audit trail system that tracks and scores GenAI outputs for compliance, risk assessment, and accountability. Ensures every AI decision is traceable and auditable.",
    githubUrl: "https://github.com/Shiivu13/GenAI-Audit-Trail-Risk-Scoring-System",
    image: "/bg-projects.jpg",
  },
  {
    id: 5,
    title: "Movie Recommender",
    tags: ["Python", "Scikit-learn", "TF-IDF", "Streamlit"],
    description: "Content-based movie recommender using TF-IDF vectorization and cosine similarity. Features an interactive Streamlit frontend deployed to Streamlit Cloud.",
    githubUrl: "https://github.com/Shiivu13/Project-1-Recommender",
    image: "/bg-projects.jpg",
  },
  {
    id: 6,
    title: "PsyNotes",
    tags: ["Node.js", "React", "Prisma", "Tailwind"],
    description: "Full-stack notes and blog application with authentication, categories, quizzes, and a modern React + Tailwind UI. Features JWT auth and a RESTful API backend.",
    githubUrl: "https://github.com/Shiivu13/psynotes-froentend",
    image: "/bg-projects.jpg",
  },
];

export interface Skill {
  name: string;
  level: number;
}

export const skills: Skill[] = [
  { name: "Python / ML", level: 95 },
  { name: "FastAPI / Backend", level: 90 },
  { name: "Computer Vision (YOLO, OpenCV)", level: 88 },
  { name: "AWS (EC2, S3, Lambda)", level: 85 },
  { name: "Docker / DevOps", level: 80 },
  { name: "SQL / PostgreSQL", level: 82 },
  { name: "GenAI / LLM Evaluation", level: 85 },
  { name: "Streamlit / Frontend", level: 75 },
  { name: "React / Node.js", level: 70 },
  { name: "Java", level: 65 },
];
