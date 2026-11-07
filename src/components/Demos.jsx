import { useState } from "react";

/* 1. Research agent: click a stage to see its role */
const STAGES = [
  ["Planner", "agents/planner.py", "Topic", "A research plan and a list of search queries"],
  ["Researcher", "agents/researcher.py", "Search queries", "A research brief plus real source URLs from Gemini’s Google Search grounding"],
  ["Analyzer", "agents/analyst.py", "Research brief", "A condensed analysis of the findings"],
  ["Fact checker", "agents/fact_checker.py", "Claims in the analysis", "Verified claims, and a list of what could not be confirmed"],
  ["Writer", "agents/writer.py", "Analysis + fact-check notes", "A markdown report with de-duplicated, numbered references"],
];
function ResearchDemo() {
  const [i, setI] = useState(0);
  const [name, file, input, output] = STAGES[i];
  return (
    <>
      <div className="stage-row" role="group" aria-label="Pipeline stages">
        {STAGES.map((s, k) => (
          <button key={s[0]} className={k === i ? "vw on" : "vw"} aria-pressed={k === i} onClick={() => setI(k)}>{s[0]}</button>
        ))}
      </div>
      <dl className="io">
        <div><dt>Agent</dt><dd>{name} <code>{file}</code></dd></div>
        <div><dt>Receives</dt><dd>{input}</dd></div>
        <div><dt>Produces</dt><dd>{output}</dd></div>
      </dl>
    </>
  );
}

/* 2. CSV analyst: question -> pandas -> answer (illustrative) */
const QS = [
  ["What is the average salary?", "df['salary'].mean()", "The average salary is $72,450."],
  ["How many rows have status = 'active'?", "(df['status'] == 'active').sum()", "There are 128 active rows."],
  ["Which employee has the highest salary?", "df.loc[df['salary'].idxmax(), 'name']", "The highest-paid employee is Ayesha Raza."],
];
function CsvDemo() {
  const [i, setI] = useState(0);
  const [q, code, a] = QS[i];
  return (
    <>
      <div className="stage-row">
        {QS.map((s, k) => (
          <button key={s[0]} className={k === i ? "vw on" : "vw"} aria-pressed={k === i} onClick={() => setI(k)}>{s[0]}</button>
        ))}
      </div>
      <ol className="steps3">
        <li><b>Gemini writes a query</b> from the schema and 3 sample rows<pre>{code}</pre></li>
        <li><b>Pandas runs it</b> locally on the full dataset<pre>computed on the real data</pre></li>
        <li><b>Gemini phrases the result</b><pre>{a}</pre></li>
      </ol>
      <p className="fine">Example data and answers are illustrative.</p>
    </>
  );
}

/* 3. Appointment assistant: scripted conversation */
const FIELDS = [
  ["name", "What name should I put the appointment under?"],
  ["purpose", "What is the purpose of your visit?"],
  ["date", "Which date would you like? (for example 2026-12-03)"],
  ["time", "What time works for you? (for example 14:30)"],
];
const START = [{ from: "bot", text: "Hi, how can I help you?" }];
function BookingDemo() {
  const [log, setLog] = useState(START);
  const [vals, setVals] = useState({});
  const [step, setStep] = useState(-1);
  const [text, setText] = useState("");
  const done = step >= FIELDS.length;
  function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || done) return;
    setText("");
    const msgs = [...log, { from: "user", text: t }];
    let v = vals;
    if (step === -1) msgs.push({ from: "bot", text: FIELDS[0][1] });
    else {
      v = { ...vals, [FIELDS[step][0]]: t };
      if (step + 1 < FIELDS.length) msgs.push({ from: "bot", text: FIELDS[step + 1][1] });
      else {
        msgs.push({ from: "tool", text: `book_appointment(${JSON.stringify(v)})` });
        msgs.push({ from: "bot", text: `Booked. ${v.name}, ${v.purpose} on ${v.date} at ${v.time}.` });
      }
    }
    setLog(msgs); setVals(v); setStep(step + 1);
  }
  const reset = () => { setLog(START); setVals({}); setStep(-1); };
  return (
    <>
      <div className="chat" role="log" aria-live="polite">
        {log.map((m, k) => <p key={k} className={`msg ${m.from}`}>{m.text}</p>)}
      </div>
      {!done ? (
        <form className="chat-in" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={step === -1 ? "Type “I want to book an appointment”" : "Type your answer"} aria-label="Your message" />
          <button className="btn btn-primary" type="submit">Send</button>
        </form>
      ) : (
        <>
          <pre className="sql">{`INSERT INTO appointments\n  (name, purpose, appointment_date, appointment_time)\nVALUES ('${vals.name}', '${vals.purpose}', '${vals.date}', '${vals.time}');`}</pre>
          <button className="btn btn-ghost" onClick={reset}>Start over</button>
        </>
      )}
      <p className="fine">A scripted walkthrough of the flow. The real app lets Gemini drive the conversation.</p>
    </>
  );
}

/* 4. RAG: chunking + retrieval, using the same chunking logic as the app */
const SAMPLE = "Northwind Clinic is open Monday to Friday from 8 a.m. to 6 p.m. and on Saturday from 9 a.m. to 1 p.m. The clinic is closed on Sundays and public holidays.\n\nPatients should arrive 15 minutes before their appointment to complete registration. Please bring a valid photo ID and your insurance card. Appointments can be cancelled free of charge up to 24 hours in advance.\n\nParking is available behind the building and costs nothing for the first two hours. Visitors with limited mobility can use the reserved bays next to the main entrance.\n\nLab results are usually ready within three working days. They are shared through the patient portal, and a nurse will call you if any result needs follow-up.";
const chunk = (t, size, ov) => { const out = []; for (let s = 0; s < t.length; s += Math.max(1, size - ov)) out.push({ start: s, text: t.slice(s, s + size) }); return out; };
function RagDemo() {
  const [text, setText] = useState(SAMPLE);
  const [size, setSize] = useState(400);
  const [ov, setOv] = useState(80);
  const [q, setQ] = useState("parking cost");
  const chunks = chunk(text, size, ov);
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  const scored = chunks.map((c, i) => ({ i, s: words.reduce((n, w) => n + (c.text.toLowerCase().split(w).length - 1), 0) }));
  const top = scored.filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4).map((x) => x.i);
  return (
    <>
      <label className="lbl">Document text<textarea rows="5" value={text} onChange={(e) => setText(e.target.value)} /></label>
      <div className="sliders">
        <label className="lbl">Chunk size: {size}<input type="range" min="100" max="1000" step="50" value={size} onChange={(e) => { const v = +e.target.value; setSize(v); if (ov > v - 50) setOv(v - 50); }} /></label>
        <label className="lbl">Overlap: {ov}<input type="range" min="0" max={size - 50} step="10" value={ov} onChange={(e) => setOv(+e.target.value)} /></label>
        <button className="btn btn-ghost" onClick={() => { setSize(1000); setOv(200); }}>Use my app’s 1000 / 200</button>
      </div>
      <label className="lbl">Ask a question<input type="text" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <p className="fine">{chunks.length} chunks created. Chunks that match your question are highlighted (a keyword stand-in for the embedding search in the real app); the shaded start of a chunk is the overlap shared with the previous one.</p>
      <ol className="chunks">
        {chunks.map((c, i) => {
          const hit = top.indexOf(i);
          return (
            <li key={i} className={hit >= 0 ? "hit" : ""}>
              <span className="cn">Chunk {i + 1}{hit >= 0 && <b> · retrieved #{hit + 1}</b>}</span>
              {i > 0 ? <><mark>{c.text.slice(0, ov)}</mark>{c.text.slice(ov)}</> : c.text}
            </li>
          );
        })}
      </ol>
    </>
  );
}

const DEMOS = { "research-agent": ResearchDemo, "csv-analyst": CsvDemo, "appointment-agent": BookingDemo, "rag-chatbot": RagDemo };
export function Demo({ id }) {
  const D = DEMOS[id];
  return D ? <div className="demo"><D /></div> : null;
}
