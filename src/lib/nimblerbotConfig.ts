/** Public build configuration only. Never accept a destination from visitor input. */
export function nimblerbotConfig(env: Record<string, unknown>) {
  const flag = env.PUBLIC_NIMBLERBOT_ENABLED;
  if (flag === undefined || flag === "" || flag === "false") return { enabled: false, url: "" };
  if (flag !== "true") throw new Error("PUBLIC_NIMBLERBOT_ENABLED must be true or false");

  const origin = env.PUBLIC_NIMBLERBOT_VIEWER_ORIGIN;
  const id = env.PUBLIC_NIMBLERBOT_PUBLIC_ID;
  // Only the accepted production Viewer and owned bot are qualified for this site.
  if (origin !== "https://viewer.nimblerbot.com" || id !== "ericmaster-ninja-web-canary") {
    throw new Error("Enabled Nimblerbot requires the qualified production origin and public ID");
  }
  return { enabled: true, url: `${origin}/${id}` };
}

export function chatAllowedOnHost(hostname: string) {
  return hostname === "ericmaster.ninja";
}
