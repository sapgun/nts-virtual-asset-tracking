import type { SVGProps } from "react";

export type IconName = "target" | "search" | "case" | "evidence" | "bridge" | "academy" |
  "research" | "arrow" | "close" | "plus" | "minus" | "fit" | "layers" | "play" |
  "pause" | "previous" | "next" | "copy" | "export" | "eth" | "bank" | "wallet" |
  "mixer" | "contract" | "clock" | "menu" | "check";

const paths: Record<IconName, string> = {
  target: "M12 2v4m0 12v4M2 12h4m12 0h4M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  case: "M3 7h18v14H3zM8 7V3h8v4M8 12v4m8-4v4",
  evidence: "M6 2h9l4 4v16H6zM14 2v5h5M9 12h7m-7 4h7",
  bridge: "M3 21V8m18 13V8M3 11Q12 2 21 11M3 16h18M8 8v8m8-8v8M1 21h4m14 0h4",
  academy: "M1 8l11-5 11 5-11 5zM5 11v6q7 5 14 0v-6M23 8v9",
  research: "M4 3h7q1 0 1 2 0-2 1-2h7v17h-7q-1 0-1 2 0-2-1-2H4zM12 5v15",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  close: "M6 6l12 12M6 18 18 6",
  plus: "M12 4v16M4 12h16", minus: "M4 12h16",
  fit: "M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6",
  layers: "M2 8l10-6 10 6-10 6zM2 12l10 6 10-6M2 16l10 6 10-6",
  play: "M8 4l12 8-12 8z", pause: "M8 4v16M16 4v16",
  previous: "M5 5v14M19 5 8 12l11 7z", next: "M19 5v14M5 5l11 7-11 7z",
  copy: "M8 8h13v13H8zM4 16H2V2h14v2",
  export: "M12 15V2m-5 5 5-5 5 5M4 13v8h16v-8",
  eth: "M12 1 5 12l7 4 7-4zM5 14l7 9 7-9M12 1v15",
  bank: "M2 8l10-6 10 6H2zM4 21h16M2 18h20M6 10v8m6-8v8m6-8v8",
  wallet: "M3 6h17v15H3zM3 6V3h14v3M14 11h7v5h-7z",
  mixer: "M20 6c-5-8-17-2-17 6s12 12 17 5S20 3 13 5s-9 12-3 13 11-8 5-10-8 8-3 6",
  contract: "M6 2h9l4 4v16H6zM10 10l-2 2 2 2m5-4 2 2-2 2",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l4 2",
  menu: "M4 6h16M4 12h16M4 18h16", check: "M4 12l5 5L20 6",
};
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d={paths[name]} />
  </svg>;
}
export function BrandMark() {
  return <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" fill="none">
    <path d="M18 3 4 17l4 4L21 8M37 18 23 4l-4 4 13 13M22 37l14-14-4-4-13 13M3 22l14 14 4-4L8 19" fill="currentColor" />
    <path d="m20 13 7 7-7 7-7-7z" stroke="currentColor" strokeWidth="2" />
  </svg>;
}
