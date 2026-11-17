import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/lib/i18n/provider";
import { dictionaries } from "@/lib/i18n";
import { LANG_COOKIE, isLocale, type Locale } from "@/lib/i18n/locales";
import "./globals.css";

async function initialLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLocale(value) ? value : "en";
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await initialLocale();
  return {
    title: dictionaries[locale].meta.title,
    description: dictionaries[locale].meta.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await initialLocale();
  return (
    <html lang={locale}>
      <body>
        <LanguageProvider initialLocale={locale}>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
