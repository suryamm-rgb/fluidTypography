import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { GithubIcon, LogoMark } from "./Icons";

export const REPO_URL = "https://github.com/suryamm-rgb/fluidTypography";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="Fluid Typography, all tools">
          <span className="brand__mark">
            <LogoMark />
          </span>
          <span className="brand__name">Fluid Typography</span>
        </Link>
        <div className="header-actions">
          <a
            className="icon-btn"
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub (opens in a new tab)"
            title="GitHub"
          >
            <GithubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
