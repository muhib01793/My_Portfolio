// ─────────────────────────────────────────────────────────────
//  Everything shown on the site lives in this file.
//  Edit the text here; no need to touch the components.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Muhib Khan",
  role: "AI Engineer | Generative AI | Machine Learning",
  location: "Bannu, Pakistan",
  status: "Open to AI/ML internships",
  headline: "I build AI applications that answer from real data.",
  intro:
    "AI engineer focused on practical Generative AI and machine-learning applications in Python. I work with LLMs, RAG, LangChain and agentic workflows, and I ship API-backed, SQL-connected apps instead of notebook prototypes.",
  objective:
    "I am looking for an AI/ML internship where I can apply Python, Generative AI, RAG and machine learning to real problems, work with experienced engineers, and grow toward production-ready AI engineering.",
  github: "https://github.com/muhib01793",
  linkedin: "https://lnkd.in/dguMYemA",
  email: "muhibkhan9795@gmail.com",
  cvFile: "Muhib_Khan_Resume.pdf",
};

export const projects = [
  {
    id: "research-agent",
    title: "AI Research & Report Agent",
    kind: "Multi-agent system",
    repo: "https://github.com/muhib01793/ai-research-agent",
    summary:
      "Give it a topic and five cooperating agents plan the research, search the web, analyze the findings, fact-check the claims and write a structured report with a numbered reference list.",
    stack: ["Python", "LangGraph", "Google Gemini", "Streamlit"],
    flow: [
      "The Planner agent turns the topic into a research plan and search queries.",
      "The Research agent runs those searches through Gemini with Google Search grounding.",
      "The Information Analyzer condenses the research brief into an analysis.",
      "The Fact Checker re-checks the claims against a fresh search.",
      "The Report Writer produces a markdown report and appends the references.",
    ],
    decisions: [
      {
        title: "Sources you can check",
        text: "Real source URLs are pulled from Gemini’s grounding metadata, collected in the shared graph state with an operator.add reducer, de-duplicated, and printed as a reference list.",
      },
      {
        title: "Keeps running when a model fails",
        text: "A fallback chain moves to the next model on 404, 429, 500, 502 and 503 errors, with two passes and a short backoff. A 45-second request timeout stops one slow model from stalling the pipeline.",
      },
      {
        title: "Honest when search quota runs out",
        text: "If grounded search is refused, the run retries without it and finishes from the model’s own knowledge. The report is clearly labelled “Not web-verified” instead of passing as researched.",
      },
      {
        title: "Measured, not guessed",
        text: "I benchmarked model latency (from about 1 second to over 100 seconds on the same prompt) to choose the default, and run the planner’s searches in a thread pool for roughly 3x faster research while staying inside free-tier rate limits.",
      },
    ],
  },
  {
    id: "csv-analyst",
    title: "CSV Data Analyst",
    kind: "Natural-language data analysis",
    repo: "https://github.com/muhib01793/mcp-gemini-chatbot",
    summary:
      "Upload a CSV, ask questions in plain English and get answers computed by Pandas on your real data, then phrased by Gemini. Ask for the average salary and you get the exact figure, not a guess.",
    stack: ["Python", "Flask", "Pandas", "Google Gemini", "HTML / CSS / JavaScript"],
    flow: [
      "The Flask API loads the uploaded file with pandas and keeps the DataFrame in memory, keyed by a session id.",
      "Gemini receives only the column schema and a 3-row sample, never the full file.",
      "Gemini writes a short pandas query for the question.",
      "The query runs locally on the real data inside a restricted exec sandbox.",
      "Gemini phrases the computed result as a plain-English answer.",
    ],
    decisions: [
      {
        title: "Exact answers",
        text: "The LLM writes the query but never does the arithmetic, so numeric answers come from the data instead of being hallucinated.",
      },
      {
        title: "Small prompts at any file size",
        text: "Sending the schema and a sample keeps token usage low whether the CSV has a hundred rows or a million.",
      },
      {
        title: "Graceful fallback",
        text: "If the generated code fails, the app answers from the schema and sample and tells the user in the UI that the answer is approximate.",
      },
      {
        title: "Security-aware",
        text: "Generated code runs with no builtins and a keyword denylist. I documented clearly that this suits a local tool and is not a hardened sandbox for the open internet.",
      },
    ],
  },
  {
    id: "appointment-agent",
    title: "Appointment Booking Agent",
    kind: "Conversational booking with function calling",
    repo: "https://github.com/muhib01793/appointment-booking-agent",
    summary:
      "A chat assistant that collects a name, purpose, date and time through natural conversation, then books the appointment and saves it to PostgreSQL.",
    stack: ["Python", "FastAPI", "Gemini function calling", "PostgreSQL", "HTML / CSS / JavaScript"],
    flow: [
      "The chat UI greets the user and sends every message to POST /api/chat with a per-tab session id.",
      "The backend forwards it to Gemini, whose system prompt drives the conversation: name, purpose, date, time.",
      "Once all four fields are collected, Gemini calls a book_appointment function.",
      "The backend executes the call by inserting a row into PostgreSQL.",
      "Gemini then writes the final confirmation message.",
    ],
    decisions: [
      {
        title: "The model decides, the backend acts",
        text: "Function calling turns a free-form conversation into one structured, validated database write.",
      },
      {
        title: "A strict data model",
        text: "The appointments table enforces NOT NULL on every field with proper DATE and TIME types, and is created automatically on server startup.",
      },
      {
        title: "Clean separation",
        text: "A FastAPI backend and a dependency-free HTML/CSS/JS frontend, configured through environment variables including model name and CORS origin.",
      },
    ],
  },
  {
    id: "rag-chatbot",
    title: "RAG PDF Chatbot",
    kind: "Retrieval-augmented generation",
    repo: "https://github.com/muhib01793/RAG-Chatbot",
    summary:
      "Upload a PDF and chat with it. Answers are generated only from the passages retrieved from your document, and the bot says when the answer is not there.",
    stack: ["Python", "Streamlit", "ChromaDB", "Sentence-Transformers", "LangChain", "Groq (Llama 3.3 70B)", "pypdf"],
    flow: [
      "pypdf extracts the text, and the app flags scanned PDFs that contain no text layer.",
      "The text is split into 1,000-character chunks with a 200-character overlap.",
      "Chunks are embedded with all-MiniLM-L6-v2 and stored in a ChromaDB collection.",
      "A question retrieves the 4 most relevant chunks by semantic similarity.",
      "Llama 3.3 70B on Groq answers using only that context.",
    ],
    decisions: [
      {
        title: "Grounded by design",
        text: "The prompt restricts the model to the retrieved context and tells it to answer “I don’t know based on the document” when the answer is missing.",
      },
      {
        title: "Chunk overlap",
        text: "Overlapping chunks keep sentences that straddle a boundary retrievable.",
      },
      {
        title: "Free and fast to run",
        text: "Local embeddings plus Groq-hosted Llama keep the whole stack free to try. The API key comes from the environment or a password field in the sidebar.",
      },
    ],
  },
  {
    id: "genai-multitool",
    title: "GenAI Multi-Tool App",
    kind: "All-in-one generative AI workspace",
    repo: "https://github.com/muhib01793/genai-multitool-app",
    summary:
      "A Streamlit application that combines several GenAI features in one interface, using the Gemini API for both text and image understanding.",
    stack: ["Python", "Streamlit", "Google Gemini API", "Multimodal AI"],
    features: [
      "AI chat",
      "Document question answering",
      "Summarization",
      "Multimodal image analysis",
    ],
  },
];

export const skills = [
  { group: "Programming", items: ["Python", "SQL", "JavaScript", "HTML", "CSS"] },
  { group: "AI / GenAI", items: ["LLMs", "RAG", "Agentic AI", "LangChain", "LangGraph", "Prompt engineering", "n8n"] },
  { group: "AI engineering", items: ["Embeddings", "Vector search", "Function / tool calling", "API integration"] },
  { group: "Machine learning", items: ["Scikit-learn", "Supervised learning", "Model evaluation"] },
  { group: "Data", items: ["Pandas", "NumPy", "Matplotlib", "Data cleaning", "Exploratory analysis"] },
  { group: "Backend", items: ["FastAPI", "Flask", "REST APIs"] },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "ChromaDB (vector)"] },
  { group: "DevOps and tools", items: ["Docker", "Git / GitHub", "GitHub Actions", "CI/CD basics", "VS Code", "Jupyter"] },
];

export const alsoBuilt = [
  { title: "Agentic AI workflow in n8n", text: "Automated AI workflows that connect LLM reasoning steps with external tools and APIs, chaining triggers, API calls and AI decision steps into one pipeline that replaces repetitive manual work.", tags: ["n8n", "LLMs", "APIs", "Automation"] },
  { title: "AI chatbot with LangChain", text: "A conversational assistant with multi-turn memory so replies stay consistent with earlier context, plus tool calling so it can complete tasks instead of only generating text.", tags: ["LangChain", "LLM", "Tool calling"] },
  { title: "ML data analysis project", text: "Data cleaning, exploratory analysis and visualization, followed by Scikit-learn experiments that train and evaluate models to compare performance.", tags: ["Pandas", "NumPy", "Matplotlib", "Scikit-learn"] },
];

export const practice = [
  "Reusable Python modules, environment variables and structured project layouts",
  "Git and GitHub for version control",
  "Docker-based packaging for reproducible deployments",
  "CI/CD exploration with GitHub Actions",
  "API-based AI applications, not notebook prototypes",
];

export const education = {
  degree: "Bachelor’s degree (completed)",
  school: "University of Science & Technology, Bannu",
  focus: "Coursework focused on AI and software engineering",
};
