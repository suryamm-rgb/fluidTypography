import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { LogoMark } from "./Icons";

export default function Header({ title = "Fluid Typography" }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label={`${title}, all tools`}>
          <span className="brand__mark">
            <LogoMark />
          </span>
          <span className="brand__name">{title}</span>
        </Link>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
