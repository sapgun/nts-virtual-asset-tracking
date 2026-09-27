"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const primary = [
  ["/", "Command"],
  ["/investigations", "Investigate"],
  ["/evidence", "Evidence"],
] as const;

const secondary = [
  ["/explore", "Explorer"],
  ["/bridges", "Bridge"],
  ["/cases", "Cases"],
  ["/academy", "Academy"],
  ["/research", "Research"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="shell shell-v2">
      <header className="topbar">
        <Link className="topbar-brand" href="/">
          <span className="brand-sigil">
            <i />
            <b>N</b>
          </span>
          <span>
            <strong>NTS // INTEL</strong>
            <small>Evidence-aware chain intelligence</small>
          </span>
        </Link>

        <nav className="topbar-primary" aria-label="Primary">
          {primary.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>

        <nav className="topbar-secondary" aria-label="Labs and library">
          {secondary.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="topbar-mode">
          <span />
          SAFE MODE
        </div>
      </header>

      <main className="app-main app-main-v2">{children}</main>
    </div>
  );
}
