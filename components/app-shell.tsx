"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark, Icon, type IconName } from "@/components/workspace/icons";
import s from "@/components/workspace/workspace.module.css";

const routes: Array<{ href: string; label: string; icon: IconName; detail: string }> = [
  { href: "/", label: "Command", icon: "target", detail: "Choose an observation or investigation workflow" },
  { href: "/investigations", label: "Investigate", icon: "search", detail: "Interactive graph and evidence inspector" },
  { href: "/evidence", label: "Evidence", icon: "evidence", detail: "Evidence register and review history" },
  { href: "/explore", label: "Explorer", icon: "search", detail: "Public Ethereum address lookup" },
  { href: "/bridges", label: "Bridge", icon: "bridge", detail: "Bridge correlation learning lab" },
  { href: "/cases", label: "Cases", icon: "case", detail: "Curated case reconstructions" },
  { href: "/academy", label: "Academy", icon: "academy", detail: "Evidence classification exercises" },
  { href: "/research", label: "Research", icon: "research", detail: "Preserved original technical report" },
];
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const matches = routes.filter((route) => `${route.label} ${route.detail}`.toLowerCase().includes(query.toLowerCase()));
  function openSearch() { setQuery(""); if (!dialog.current?.open) dialog.current?.showModal(); }
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); if (dialog.current?.open) dialog.current.close(); else openSearch();
      }
    }
    window.addEventListener("keydown", shortcut); return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return <>
    <header className={s.chrome}>
      <Link href="/" className={s.brand} title="Independent research prototype, not an official government service"><BrandMark /><span><strong>NTS <em>// INTEL</em></strong><small>Evidence-aware chain intelligence</small></span></Link>
      <nav className={s.nav} aria-label="Main navigation">{routes.map((route) => <Link key={route.href} href={route.href} aria-current={active(route.href) ? "page" : undefined}><Icon name={route.icon} width={17} height={17} />{route.label}</Link>)}</nav>
      <button className={s.searchButton} onClick={openSearch} aria-label="Search workspace pages (Control or Command K)"><Icon name="search" width={17} height={17} /><span>Search workspace…</span><kbd>⌘ K</kbd></button>
      <details className={s.mobileMenu}><summary aria-label="All workspace pages"><Icon name="menu" /></summary><div>{routes.map((route) => <Link key={route.href} href={route.href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} aria-current={active(route.href) ? "page" : undefined}><Icon name={route.icon} />{route.label}</Link>)}</div></details>
      <span className={s.labMark} title="Independent research prototype">LAB</span>
    </header>
    <main>{children}</main>
    <dialog ref={dialog} className={s.searchDialog} aria-labelledby="workspace-search-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <header><h2 id="workspace-search-title">Find a workspace</h2><button className={s.iconButton} aria-label="Close workspace search" onClick={() => dialog.current?.close()}><Icon name="close" /></button></header>
      <input autoFocus aria-label="Filter workspace pages" placeholder="Investigate, explorer, research…" value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className={s.searchResults}>{matches.map((route) => <Link key={route.href} href={route.href} onClick={() => dialog.current?.close()}><Icon name={route.icon} /><div>{route.label}<small>{route.detail}</small></div></Link>)}{!matches.length && <p>No matching workspace. Try “research” or “explorer”.</p>}</div>
    </dialog>
  </>;
}
