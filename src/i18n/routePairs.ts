import pairs from "./routePairs.json";
export type Locale = "en" | "es";
export interface TranslationPair { en: string; es: string }
const normalize = (pathname: string) => pathname === "/" ? "/" : `${pathname.replace(/\/+$/, "")}/`;
/** Explicit verified translations only. Never infer a counterpart from a prefix. */
export function getTranslationPair(pathname: string): TranslationPair | undefined {
  const path = normalize(pathname);
  return pairs.find((pair) => pair.en === path || pair.es === path);
}
export function localeHome(locale: Locale): string { return locale === "es" ? "/es/" : "/"; }
