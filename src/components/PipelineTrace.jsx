import { useEffect, useState } from "react";

const STAGES = [
  { name: "Planner", note: "Breaks the topic into a plan and search queries" },
  { name: "Researcher", note: "Runs searches with Google Search grounding" },
  { name: "Analyzer", note: "Condenses the findings into an analysis" },
  { name: "Fact checker", note: "Re-checks claims against a fresh search" },
  { name: "Writer", note: "Writes the report with numbered references" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PipelineTrace() {
  const reduced = prefersReducedMotion();
  const [step, setStep] = useState(reduced ? STAGES.length : 0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (STAGES.length + 2)), 1400);
    return () => clearInterval(id);
  }, [reduced]);

  const finished = step >= STAGES.length;

  return (
    <figure className="trace" aria-label="Example run of my AI Research Agent">
      <figcaption className="trace-head">
        <span className="trace-title">ai-research-agent</span>
        <span className={finished ? "badge badge-ok" : "badge"}>
          {finished ? "Report ready" : "Running"}
        </span>
      </figcaption>
      <p className="trace-topic">Topic: the future of AI in healthcare</p>
      <ol className="trace-list">
        {STAGES.map((s, i) => {
          const state = i < step ? "done" : i === step ? "active" : "wait";
          return (
            <li key={s.name} className={`trace-row ${state}`}>
              <span className="dot" aria-hidden="true" />
              <span className="trace-name">{s.name}</span>
              <span className="trace-note">{s.note}</span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
