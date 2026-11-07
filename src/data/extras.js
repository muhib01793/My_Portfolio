// Extra detail for each project (problem statement, key numbers, code map, setup commands).
export const extras = {
  "research-agent": {
    category: "Agentic AI · LangGraph",
    problem: "Researching a topic by hand means searching, reading, cross-checking and writing it up. This system automates that chain with specialised agents and keeps every claim traceable to a source.",
    stats: [{ v: "5", l: "cooperating agents" }, { v: "8–10", l: "API calls per run" }, { v: "~3x", l: "faster parallel searches" }, { v: "2", l: "fallback passes per call" }],
    files: [["agents/planner.py", "builds the research plan and search queries"], ["agents/researcher.py", "runs the searches, writes the research brief"], ["agents/analyst.py", "condenses the brief into an analysis"], ["agents/fact_checker.py", "verifies claims against a fresh search"], ["agents/writer.py", "writes the report and appends references"], ["tools/search_tool.py", "the web search tool"], ["llm.py", "Gemini wrapper that returns text and sources"], ["graph.py / state.py", "LangGraph wiring and shared state"]],
    run: ["python -m venv myenv", "pip install -r requirements.txt", "streamlit run app.py"],
    runNote: "Create a .env file with GEMINI_API_KEY first. A command-line runner (main.py) writes reports to the reports folder.",
  },
  "csv-analyst": {
    category: "Data analysis · Flask + Pandas",
    problem: "Language models are fluent but unreliable at arithmetic, and sending a whole spreadsheet to a model is slow and costly. This app lets people ask questions in plain English while the real computation stays in Pandas.",
    stats: [{ v: "3 rows", l: "sample sent, not the file" }, { v: "3", l: "API routes" }, { v: "100%", l: "numbers computed locally" }],
    files: [["backend/app.py", "Flask API: /api/upload, /api/ask, /api/health"], ["backend/csv_handler.py", "loads the CSV, describes the schema, builds the preview"], ["backend/gemini_handler.py", "code generation, sandboxed exec, answer phrasing"], ["frontend/", "HTML, CSS and JavaScript upload and chat interface"]],
    run: ["python -m venv venv", "pip install -r requirements.txt", "python backend/app.py"],
    runNote: "Add GEMINI_API_KEY to a .env file, then open frontend/index.html in your browser.",
  },
  "appointment-agent": {
    category: "Conversational AI · FastAPI + PostgreSQL",
    problem: "Booking forms are rigid and tiring to fill in. This assistant collects the details through natural conversation and still ends with a clean, validated database record.",
    stats: [{ v: "4", l: "fields collected in chat" }, { v: "1", l: "function call: book_appointment" }, { v: "6", l: "columns in the appointments table" }],
    files: [["backend/", "FastAPI server, Gemini integration, PostgreSQL access"], ["frontend/index.html", "static chat interface"], ["frontend/script.js", "sends messages to POST /api/chat with a session id"]],
    run: ["cd backend", "pip install -r requirements.txt", "uvicorn app:app --reload --port 8000"],
    runNote: "Create a PostgreSQL database named appointments_db and fill in GEMINI_API_KEY and DATABASE_URL in backend/.env. The table is created on startup.",
  },
  "rag-chatbot": {
    category: "Retrieval-augmented generation · Streamlit",
    problem: "General chatbots don’t know your documents and may invent answers. RAG grounds the model in passages retrieved from your own PDF and lets it admit when the answer isn’t there.",
    stats: [{ v: "1000 / 200", l: "chunk size / overlap" }, { v: "Top 4", l: "chunks retrieved" }, { v: "70B", l: "Llama 3.3 model on Groq" }],
    files: [["chatbot.py", "Streamlit app: PDF parsing, chunking, ChromaDB, Groq answers"], ["requirements.txt", "dependencies"], ["test.py", "test script"]],
    run: ["pip install streamlit pypdf chromadb sentence-transformers langchain-groq", "streamlit run chatbot.py"],
    runNote: "Set GROQ_API_KEY in your environment, or paste a free key from console.groq.com into the sidebar.",
  },
  "genai-multitool": {
    category: "Generative AI · Streamlit",
    problem: "People juggle separate tools for chat, document questions, summaries and image understanding. This app brings them together in one place.",
    stats: [{ v: "4", l: "AI tools in one interface" }, { v: "Text + image", l: "Gemini inputs" }],
    files: [],
    run: [],
    runNote: "Setup instructions are in the repository.",
  },
};
