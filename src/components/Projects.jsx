import { useState } from "react";
import { projects } from "../data/portfolio.js";
import { extras } from "../data/extras.js";
import { Demo } from "./Demos.jsx";

const VIEWS = ["Overview", "Engineering", "Try it"];

function Cmd({ text }) {
  const [ok, setOk] = useState(false);
  const copy = () =>
    navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1400); }).catch(() => {});
  return (
    <div className="cmd"><code>{text}</code><button onClick={copy} aria-label={`Copy ${text}`}>{ok ? "Copied" : "Copy"}</button></div>
  );
}

function Panel({ p }) {
  const [view, setView] = useState(0);
  const x = extras[p.id] || {};
  return (
    <article id="project-panel" role="tabpanel" aria-labelledby={`tab-${p.id}`} className="panel">
      <p className="cat">{x.category}</p>
      <h3>{p.title}</h3>
      <div className="views" role="group" aria-label="Project sections">
        {VIEWS.map((v, i) => (
          <button key={v} className={i === view ? "vw on" : "vw"} aria-pressed={i === view} onClick={() => setView(i)}>{v}</button>
        ))}
      </div>

      {view === 0 && (
        <>
          <h4>The problem</h4>
          <p className="panel-summary">{x.problem}</p>
          <h4>What I built</h4>
          <p className="panel-summary">{p.summary}</p>
          {x.stats && (
            <ul className="stats">{x.stats.map((s) => <li key={s.l}><b>{s.v}</b><span>{s.l}</span></li>)}</ul>
          )}
          <ul className="chips" aria-label="Technologies">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          {p.flow && (
            <>
              <h4>How it works</h4>
              <ol className="flow">{p.flow.map((s) => <li key={s}>{s}</li>)}</ol>
            </>
          )}
          {p.features && (
            <>
              <h4>What’s inside</h4>
              <ul className="features">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
            </>
          )}
        </>
      )}

      {view === 1 && (
        <>
          {p.decisions ? (
            <>
              <h4>Engineering decisions</h4>
              <dl className="decisions">
                {p.decisions.map((d) => <div key={d.title}><dt>{d.title}</dt><dd>{d.text}</dd></div>)}
              </dl>
            </>
          ) : (
            <p className="panel-summary">A detailed engineering write-up for this project is available in the repository.</p>
          )}
          {x.files?.length > 0 && (
            <>
              <h4>Code map</h4>
              <ul className="files">{x.files.map(([f, d]) => <li key={f}><code>{f}</code><span>{d}</span></li>)}</ul>
            </>
          )}
        </>
      )}

      {view === 2 && (
        <>
          <Demo id={p.id} />
          {x.run?.length > 0 && (
            <>
              <h4>Run it locally</h4>
              {x.run.map((c) => <Cmd key={c} text={c} />)}
              <p className="fine">{x.runNote}</p>
            </>
          )}
          {!x.run?.length && <p className="panel-summary">{x.runNote}</p>}
        </>
      )}

      <a className="btn btn-ghost src" href={p.repo} target="_blank" rel="noreferrer">View source on GitHub</a>
    </article>
  );
}

export default function Projects() {
  const [active, setActive] = useState(0);
  const p = projects[active];
  return (
    <section id="projects" className="section">
      <h2>Projects</h2>
      <p className="lead">Five GenAI applications built to answer from real data. Pick a project, then explore how it works, the engineering behind it, and a live demo of its core idea.</p>
      <div className="projects">
        <div className="project-tabs" role="tablist" aria-label="Projects">
          {projects.map((item, i) => (
            <button key={item.id} role="tab" id={`tab-${item.id}`} aria-selected={i === active} aria-controls="project-panel" className={i === active ? "tab on" : "tab"} onClick={() => setActive(i)}>
              <span className="tab-title">{item.title}</span>
              <span className="tab-kind">{item.kind}</span>
            </button>
          ))}
        </div>
        <Panel key={p.id} p={p} />
      </div>
    </section>
  );
}
