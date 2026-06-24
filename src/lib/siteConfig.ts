// src/lib/siteConfig.ts
// Centralized site configuration — single source of truth for metadata,
// social links, and external service identifiers.

/** Canonical site URL (no trailing slash) */
export const SITE_URL = "https://ericmaster.ninja";

/** Site display name */
export const SITE_NAME = {
  en: "Eric Aguayo (Ericmaster)",
  es: "Eric Aguayo (Ericmaster)",
};

/** Default meta description for pages that don't set their own */
export const DEFAULT_META_DESCRIPTION = {
  en: "Eric Aguayo — Full-Stack Developer, AI Solutions Architect, and Tech Blogger. Expert AI consulting, technical interviewing, and turnkey automation.",
  es: "Eric Aguayo — Desarrollador Full-Stack, Arquitecto de Soluciones de IA, y Blogger Tecnológico. Consultoría experta en IA, entrevistas técnicas y automatización llave en mano.",
};

/** WhatsApp number for CTAs (international format, no +) */
export const WHATSAPP_NUMBER = "593983337611";

/** Social media profiles — used by Footer and anywhere social links appear */
export const SOCIAL_LINKS = [
  { platform: "x", username: "ericmaster" },
  { platform: "github", username: "ericmaster" },
  { platform: "youtube", username: "djericmaster" },
  { platform: "linkedin", username: "eric-aguayo" },
  { platform: "whatsapp", username: "593983337611" },
] as const;

/** Twitter/X handle for meta cards */
export const TWITTER_HANDLE = "@ericmaster";

/** Default OG image path (relative to site root) */
export const DEFAULT_OG_IMAGE = "/assets/images/og-default.jpg";
