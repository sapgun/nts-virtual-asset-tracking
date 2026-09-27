"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const items = [
  ["/", "Command"],
  ["/investigations", "Investigation Lab"],
  ["/explore", "Graph Explorer"],
  ["/cases", "Case Files"],
  ["/evidence", "Evidence Room"],
  ["/academy", "Academy"],
  ["/research", "Research"],
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">N</span>
          <span>
            <b>NTS // INTEL</b>
            <small>Virtual Asset Workbench</small>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Primary">
          {items.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link key={href} className={active ? "active" : ""} href={href}>
                <span className="nav-dot" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-foot">
          <span className="live-dot" />
          <div>
            <b>SAFE MODE</b>
            <small>Curated + synthetic data</small>
          </div>
        </div>
      </aside>

      <main className="app-main">{children}</main>
    </div>
  );
}
