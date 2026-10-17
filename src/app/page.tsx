import Link from "next/link";
import Header, { REPO_URL } from "../components/Header";

const tools = [
  {
    href: "/fluid-typography",
    label: "Fluid Typography",
    description: "Generate CSS clamp() formulas that scale smoothly between screen sizes.",
    tag: "CSS utility",
  },
  {
    href: "/fluid-spacing",
    label: "Fluid Spacing",
    description: "Generate clamp() values for padding, margin and gap, with a live curve.",
    tag: "CSS utility",
  },
];

export default function Home() {
  return (
    <div className="ft">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header title="CSS Utilities" />
      <main id="main" tabIndex={-1}>
        <div className="container">
          <section className="intro" aria-labelledby="page-title">
            <p className="eyebrow">Developer tools</p>
            <h1 id="page-title">
              Small tools for <em>fluid</em> CSS.
            </h1>
            <p>A collection of small tools to make your frontend workflow faster.</p>
          </section>

          <ul className="tool-grid">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="tool-card">
                  <span className="eyebrow">{tool.tag}</span>
                  <span className="tool-card__title">{tool.label}</span>
                  <span className="tool-card__desc">{tool.description}</span>
                  <span className="tool-card__go" aria-hidden="true">
                    Open →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container">
          <span>Built by Surya M M</span>
          <a className="link-tap" href={REPO_URL} target="_blank" rel="noopener noreferrer">
            Source on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
