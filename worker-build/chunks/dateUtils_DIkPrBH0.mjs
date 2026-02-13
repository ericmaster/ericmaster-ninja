globalThis.process ??= {}; globalThis.process.env ??= {};
function formatLocalizedDate(dateStr, locale, options = { year: "numeric", month: "long", day: "numeric" }) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, options);
}

export { formatLocalizedDate as f };
