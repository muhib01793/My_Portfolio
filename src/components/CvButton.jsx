import { profile } from "../data/portfolio.js";

// In a normal deployment this is a plain download link to /Muhib_Khan_Resume.pdf.
// Inside the claude.ai hosted preview, the file travels inside the page and is
// saved through the viewer's download prompt instead.
export default function CvButton({ className = "btn btn-primary", children = "Download CV" }) {
  async function onClick(e) {
    const b64 = window.__CV_B64__;
    const dl = b64 && window.claude?.use ? await window.claude.use("downloads") : null;
    if (!dl) return; // fall back to the normal link
    e.preventDefault();
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (ch) => ch.charCodeAt(0));
    dl.save({ filename: profile.cvFile, data: bytes }).catch(() => {});
  }
  return (
    <a className={className} href={profile.cvFile} download onClick={onClick}>
      {children}
    </a>
  );
}
