# Changelog

Preserve published release entries here, grouped by actual version and release date.
Earlier unrecorded history remains in Git; do not invent releases or dates.

## [Unreleased]

### Added

- Bilingual Nimblerbot chat with privacy disclosure and native direct contact; noncanonical hosts remain contact-only.

### Changed

- Reconstruct the approved mobile homepage/navigation/card refresh from its saved preview.
- Preserve four publicly deployed English articles missing from main through provenance-backed reconstruction and output-fidelity checks.

- Make the English blog locale explicit and prevent cross-language fallback in post listings.

- Remove the duplicate chat-footer WhatsApp link, remember notice dismissal in this browser, and keep Eric's native prompt at the bottom while messages scroll above it.
- Move localized welcome actions into the bot conversation, retaining free typing and direct contact without the website action bridge.
- Restore the compact avatar-led chat appearance and open the Viewer directly from the launcher, replacing the consent screen with a small linked EN/ES AI/data notice.
- Allow `CHANGELOG.md` to retain release history while keeping specs and other non-ADR docs current-state only.
- Point `robots.txt` to canonical `/sitemap-index.xml` and exclude `/es/posts/*` fallback aliases from the sitemap.
- Retire public `/admin/*` and `/api/auth/*` endpoints with `410` responses, add `ASSETS` binding in `wrangler.jsonc`, and exclude local `/docs-admin/` via `.assetsignore`.
- Align bilingual canonicals, `hreflang` links, navigation/footer locales, URL-encoded tag links in `PostTeaser`, keyboard navigation on `LanguageSwitcher`, and mobile wrapping/touch targets on `ResourcesNav`.
- Preserve legacy English-only `/es/tags/*` routes via `301` redirect to `/tags/*` when the target tag page exists.
