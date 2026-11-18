"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark, Icon, type IconName } from "@/components/workspace/icons";
import s from "@/components/workspace/workspace.module.css";
import { useLanguage } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/locales";

type RouteKey =
  | "command"
  | "investigate"
  | "evidence"
  | "explore"
  | "bridge"
  | "cases"
  | "academy"
  | "research"
  | "calculator";

const routes: Array<{ href: string; key: RouteKey; icon: IconName }> = [
  { href: "/", key: "command", icon: "target" },
  { href: "/investigations", key: "investigate", icon: "search" },
  { href: "/evidence", key: "evidence", icon: "evidence" },
  { href: "/explore", key: "explore", icon: "search" },
  { href: "/bridges", key: "bridge", icon: "bridge" },
  { href: "/cases", key: "cases", icon: "case" },
  { href: "/academy", key: "academy", icon: "academy" },
  { href: "/research", key: "research", icon: "research" },
  { href: "/calculator", key: "calculator", icon: "bank" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { locale, setLocale, t } = useLanguage();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const label = (key: RouteKey) => t(`shell.nav.${key}.label`);
  const detail = (key: RouteKey) => t(`shell.nav.${key}.detail`);
  const matches = routes.filter((route) => `${label(route.key)} ${detail(route.key)}`.toLowerCase().includes(query.toLowerCase()));
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
  const switchLang = (next: Locale) => setLocale(next);
  return <>
    <header className={s.chrome}>
      <Link href="/" className={s.brand} title={t("shell.brandTitle")}><BrandMark /><span><strong>NTS <em>// INTEL</em></strong><small>{t("shell.brandTagline")}</small></span></Link>
      <nav className={s.nav} aria-label={t("shell.navAria")}>{routes.map((route) => <Link key={route.href} href={route.href} aria-current={active(route.href) ? "page" : undefined}><Icon name={route.icon} width={17} height={17} />{label(route.key)}</Link>)}</nav>
      <button className={s.searchButton} onClick={openSearch} aria-label={t("shell.search.buttonAria")}><Icon name="search" width={17} height={17} /><span>{t("shell.search.buttonLabel")}</span><kbd>⌘ K</kbd></button>
      <div className={s.langToggle} role="group" aria-label={t("shell.languageAria")}>
        <button type="button" aria-pressed={locale === "ko"} onClick={() => switchLang("ko")}>KR <span>· 한국어</span></button>
        <button type="button" aria-pressed={locale === "en"} onClick={() => switchLang("en")}>EN <span>· English</span></button>
      </div>
      <details className={s.mobileMenu}><summary aria-label={t("shell.search.mobileMenuAria")}><Icon name="menu" /></summary><div>{routes.map((route) => <Link key={route.href} href={route.href} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} aria-current={active(route.href) ? "page" : undefined}><Icon name={route.icon} />{label(route.key)}</Link>)}</div></details>
      <span className={s.labMark} title={t("shell.labTitle")}>{t("shell.lab")}</span>
    </header>
    <main>{children}</main>
    <dialog ref={dialog} className={s.searchDialog} aria-labelledby="workspace-search-title" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <header><h2 id="workspace-search-title">{t("shell.search.dialogTitle")}</h2><button className={s.iconButton} aria-label={t("shell.search.closeAria")} onClick={() => dialog.current?.close()}><Icon name="close" /></button></header>
      <input autoFocus aria-label={t("shell.search.inputAria")} placeholder={t("shell.search.inputPlaceholder")} value={query} onChange={(event) => setQuery(event.target.value)} />
      <div className={s.searchResults}>{matches.map((route) => <Link key={route.href} href={route.href} onClick={() => dialog.current?.close()}><Icon name={route.icon} /><div>{label(route.key)}<small>{detail(route.key)}</small></div></Link>)}{!matches.length && <p>{t("shell.search.noMatch")}</p>}</div>
    </dialog>
  </>;
}
