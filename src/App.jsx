import { useEffect, useState } from "react";
import PipelineTrace from "./components/PipelineTrace.jsx";
import Projects from "./components/Projects.jsx";
import CvButton from "./components/CvButton.jsx";
import { profile, skills, alsoBuilt, practice, education } from "./data/portfolio.js";

const ext = { target: "_blank", rel: "noreferrer" };

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch { /* storage unavailable */ }
  }, [theme]);
  const [form, setForm] = useState({ name: "", message: "" });
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(form.message)}`;
  };
  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top">{profile.name}</a>
          <nav aria-label="Primary">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
            <button className="theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </nav>
        </div>
      </header>

      <main id="top" className="wrap">
        <section className="hero">
          <div>
            <span className="pill">{profile.status}</span>
            <p className="role">{profile.role}</p>
            <h1>{profile.headline}</h1>
            <p className="meta">{profile.location}</p>
            <p className="intro">{profile.intro}</p>
            <div className="actions">
              <CvButton />
              <a className="btn btn-ghost" href="#projects">View projects</a>
              <a className="btn btn-ghost" href={profile.github} {...ext}>GitHub</a>
              <a className="btn btn-ghost" href={profile.linkedin} {...ext}>LinkedIn</a>
            </div>
          </div>
          <PipelineTrace />
        </section>

        <section id="about" className="section">
          <h2>About me</h2>
          <div className="about">
            <div>
              <p>{profile.intro}</p>
              <p>{profile.objective}</p>
              <div className="edu">
                <h3>Education</h3>
                <p><strong>{education.degree}</strong>, {education.school}. {education.focus}.</p>
              </div>
            </div>
            <div>
              <h3>How I work</h3>
              <ul className="ticks">{practice.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          </div>
        </section>

        <Projects />

        <section className="section">
          <h2>Also built</h2>
          <p className="lead">More hands-on work across automation, conversational AI and machine learning.</p>
          <div className="also">
            {alsoBuilt.map((a) => (
              <article key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <ul className="chips">{a.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <h2>Technical skills</h2>
          <div className="skills">
            {skills.map((g) => (
              <div key={g.group}>
                <h3>{g.group}</h3>
                <ul>{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <h2>Let’s work together</h2>
          <p className="lead">I’m looking for an AI/ML internship. If you have a project involving LLMs, RAG or automation, send me a message or download my CV.</p>
          <div className="actions">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <CvButton className="btn btn-ghost">Download CV</CvButton>
            <a className="btn btn-ghost" href={profile.linkedin} {...ext}>LinkedIn</a>
            <a className="btn btn-ghost" href={profile.github} {...ext}>GitHub</a>
          </div>
          <form className="contact-form" onSubmit={send}>
            <label className="lbl">Your name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="lbl">Message<textarea required rows="4" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
            <button className="btn btn-primary" type="submit">Send message</button>
            <p className="fine">This opens your email app with the message ready to send.</p>
          </form>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-links">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.location}</span>
        </div>
      </footer>
    </>
  );
}
