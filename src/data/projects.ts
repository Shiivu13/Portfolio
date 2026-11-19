export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  githubUrl: string;
  /** Live app or demo video, when there is one. */
  liveUrl?: string;
  /** Button text for liveUrl. Defaults to "Live". */
  liveLabel?: string;
  /** Short category label shown on the card. */
  category: string;
  /** What the robot sidekick says when you hover the card. */
  quip: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: "latencyzero",
    quip: "It rewrites slow endpoints, then proves they still work.",
    title: "LatencyZero: Self-Fixing Load Tester",
    tags: ["FastAPI", "LLM", "AST", "SSE"],
    description:
      "Load tests a FastAPI endpoint, finds the handler behind it and asks an LLM for a faster version. The rewrite only gets mounted if it returns exactly the same response as the original. If it doesn't, the error goes back to the model for another try. You get before and after latency numbers plus a patch you can git apply. Built for the BharatCode Hackathon 2026.",
    githubUrl: "https://github.com/Shiivu13/LatencyZero---Autonomous-API-Load-Tester-Self-Healing-Code-Optimizer",
    liveUrl: "https://latencyzero-8ejj.onrender.com/",
    category: "Dev tools",
    year: "2026",
  },
  {
    id: "screenrag",
    quip: "Every interview question comes with receipts.",
    title: "ScreenRAG: Resume-Based Interviews",
    tags: ["FastAPI", "ChromaDB", "Gemini", "React"],
    description:
      "Upload a resume, pick a role, and it runs a screening interview. It reads the resume, decides what to probe, and pulls questions from that role's textbooks, so every question points back to a line on the resume and a page in a book. Retrieval mixes dense search with BM25. It works with no API key; Gemini just makes the questions read better.",
    githubUrl: "https://github.com/Shiivu13/AI-powered-role-based-candidate-screening-system",
    liveUrl: "https://ai-powered-role-based-candidate-scr-sage.vercel.app",
    category: "RAG / Hiring",
    year: "2026",
  },
  {
    id: "multi-agent",
    quip: "A whole team of LLMs. They argue less than people do.",
    title: "Multi-Agent LLM Orchestration",
    tags: ["FastAPI", "pgvector", "Gemini", "Docker"],
    description:
      "An async FastAPI backend that splits a hard question across several specialised LLM agents. A router picks which agents to call, they share context through Postgres and pgvector, and an evaluation step scores the answers so later runs improve. Responses stream back over SSE, and one docker-compose command brings the whole stack up.",
    githubUrl: "https://github.com/Shiivu13/Multi-AgentLLM",
    category: "LLM backend",
    year: "2026",
  },
  {
    id: "parserguard",
    quip: "Scrapers break. This one tells you exactly where.",
    title: "ParserGuard",
    tags: ["Rails 8", "MongoDB", "Sidekiq", "Nokogiri"],
    description:
      "Scrapers that read Google results break the day a class name changes. ParserGuard compares each new capture of a results page with a known good one, works out which parser fields stopped extracting, and ranks CSS selectors that would find the old values again. A person reviews the suggestion and accepts it.",
    githubUrl: "https://github.com/Shiivu13/parserguard",
    category: "Scraping / Ruby",
    year: "2026",
  },
  {
    id: "ai-qna",
    quip: "You can talk to a PDF here. Weird, but useful.",
    title: "Ask Your PDFs, Audio and Video",
    tags: ["RAG", "Whisper", "FAISS", "React"],
    description:
      "Upload a PDF, an MP3 or a video and ask it questions. PDFs get a summary, audio and video get timestamped transcripts from Whisper, and Gemini answers from local FAISS embeddings of your file. Click a timestamp in the chat and the player jumps to that moment.",
    githubUrl: "https://github.com/Shiivu13/Ai_QnA",
    liveUrl: "https://www.loom.com/share/1b2abed615b846dc9354e5145ee07e39",
    liveLabel: "Demo video",
    category: "RAG / GenAI",
    year: "2026",
  },
  {
    id: "rufus-twin",
    quip: "Ask it which laptop to buy. Go on.",
    title: "Rufus-Twin: Shopping Assistant",
    tags: ["React", "FastAPI", "Gemini", "Supabase"],
    description:
      "Ask it something like \"MacBook Air or iPad Pro?\" and it searches the web with Tavily, compares the options with Gemini and answers in a chat. React and Vite on the front, FastAPI and Supabase on the back.",
    githubUrl: "https://github.com/Shiivu13/Rufus-Twin",
    liveUrl: "https://romantic-creativity-production-130d.up.railway.app/",
    category: "AI assistant",
    year: "2025",
  },
  {
    id: "surveillance",
    quip: "YOLOv8 watches the cameras so nobody has to.",
    title: "Smart Surveillance System",
    tags: ["YOLOv8", "FastAPI", "Celery", "Redis"],
    description:
      "Live camera monitoring. YOLOv8 spots people, face recognition separates known faces from strangers, and Gemini handles the slower, deeper analysis. A classroom mode tracks whether students are paying attention. Events show up on a live dashboard, and everything runs in Docker.",
    githubUrl: "https://github.com/Shiivu13/AI-Powered-Smart-Surveillance-System",
    category: "Computer vision",
    year: "2024",
  },
  {
    id: "fraud",
    quip: "A fraud model that explains itself. Rare.",
    title: "Fraud Detection You Can Explain",
    tags: ["LightGBM", "SHAP", "FastAPI", "Docker"],
    description:
      "Fraud data is mostly legit transactions, so accuracy tells you nothing. This one is tuned on PR-AUC, the cut-off comes from what a missed fraud costs, and SHAP shows why each transaction got flagged. The model is served from a Dockerized FastAPI, with a Streamlit demo on top.",
    githubUrl: "https://github.com/Shiivu13/end-to-end-Fraud-Detection-System-with-explanibility-",
    liveUrl: "https://demofrauddetection.streamlit.app/",
    category: "ML / Security",
    year: "2024",
  },
  {
    id: "ai-eval",
    quip: "An LLM judging other LLMs. Very fair. Probably.",
    title: "AI Evaluation Platform",
    tags: ["Python", "Streamlit", "Gemini", "LLM judge"],
    description:
      "A Streamlit app for comparing generative models side by side. Outputs get scored with fixed rules and with an LLM acting as judge, on clarity, risk, consistency and RAG quality.",
    githubUrl: "https://github.com/Shiivu13/AI_evaluation_platform",
    category: "Generative AI",
    year: "2025",
  },
  {
    id: "job-board",
    quip: "Plain Node, zero packages. Respect.",
    title: "Job Board With Saved Jobs",
    tags: ["Node.js", "REST", "node:test", "Vanilla JS"],
    description:
      "A small job board written in plain Node, with no packages at all. You can save and remove jobs, saved jobs survive a server restart, and the API sends proper status codes for bad input. Tests use Node's built-in runner. I built it as a work sample.",
    githubUrl: "https://github.com/Shiivu13/job-board-saved-jobs",
    category: "Full stack",
    year: "2026",
  },
  {
    id: "recommender",
    quip: "His very first ML project. Still works!",
    title: "Movie Recommender",
    tags: ["Python", "Scikit-learn", "TF-IDF", "Streamlit"],
    description:
      "My first ML project. Pick a movie and it suggests similar ones using TF-IDF and cosine similarity. The notebooks go day by day, from cleaning the data to the Streamlit app.",
    githubUrl: "https://github.com/Shiivu13/Project-1-Recommender",
    liveUrl: "https://recommendermovies.streamlit.app/",
    category: "Machine learning",
    year: "2023",
  },
];

export interface Skill {
  name: string;
  level: number;
  /** Domain key, see SKILL_CATEGORIES. */
  category: string;
}

export const skills: Skill[] = [
  { name: "Python / ML", level: 95, category: "ai" },
  { name: "Computer Vision (YOLO, OpenCV)", level: 88, category: "ai" },
  { name: "GenAI / LLM Evaluation", level: 85, category: "ai" },
  { name: "FastAPI / Backend", level: 90, category: "backend" },
  { name: "SQL / PostgreSQL", level: 82, category: "backend" },
  { name: "Java", level: 65, category: "backend" },
  { name: "AWS (EC2, S3, Lambda)", level: 85, category: "cloud" },
  { name: "Docker / DevOps", level: 80, category: "cloud" },
  { name: "React / Node.js", level: 70, category: "frontend" },
  { name: "Streamlit / Frontend", level: 75, category: "frontend" },
];

export const SKILL_CATEGORIES: Record<string, { name: string }> = {
  ai: { name: "AI / Machine learning" },
  backend: { name: "Backend / Data" },
  cloud: { name: "Cloud / DevOps" },
  frontend: { name: "Frontend" },
};
