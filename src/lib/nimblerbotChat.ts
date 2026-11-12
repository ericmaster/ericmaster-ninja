import { chatAllowedOnHost } from "./nimblerbotConfig.ts";

/** Registered once before Alpine.start; connect only when opened, with page-local state. */
export function nimblerbotChat() {
  return {
    open: false,
    connected: false,
    enabled: false,
    url: "",
    welcomeToken: "",
    welcomeDismissed: false,
    onWelcomeMessage: null as ((event: MessageEvent) => void) | null,
    onPageHide: null as (() => void) | null,
    init(this: any) {
      const language = this.$el.dataset.language;
      this.enabled = this.$el.dataset.enabled === "true" && chatAllowedOnHost(window.location.hostname)
        && (language === "en" || language === "es");
      this.url = "";
      if (this.enabled) {
        // Only page-owned context, never the visitor's URL or conversation identifiers.
        const url = new URL(this.$el.dataset.viewerUrl);
        url.search = new URLSearchParams({ Language: language === "es" ? "Spanish" : "English" }).toString();
        this.url = url.href;
      }
      this.onPageHide = () => this.end();
      window.addEventListener("pagehide", this.onPageHide);
      this.onWelcomeMessage = (event: MessageEvent) => {
        const frame = this.$refs.viewer.firstElementChild;
        if (!this.connected || !this.url || event.origin !== new URL(this.url).origin
          || event.source !== frame?.contentWindow) return;
        const data = event.data;
        if (!data || data.type !== "nimblerbot-welcome" || typeof data.token !== "string"
          || !/^[0-9a-f-]{36}$/.test(data.token)) return;
        if (data.event === "ready" && !this.welcomeDismissed) this.welcomeToken = data.token;
        if (data.event === "submitted" && data.token === this.welcomeToken) {
          this.welcomeDismissed = true;
          this.welcomeToken = "";
        }
      };
      window.addEventListener("message", this.onWelcomeMessage);
    },
    get panelClass() { return { hidden: !this.open }; },
    get contactOnlyClass() { return { hidden: this.enabled }; },
    get sessionClass() { return { hidden: !this.connected }; },
    get ariaExpanded() { return String(this.open); },
    get quickActionsClass() { return { hidden: !this.connected || this.welcomeDismissed }; },
    get quickActionsDisabled() { return !this.welcomeToken || this.welcomeDismissed; },
    requestService() { this.sendWelcomeAction("service"); },
    learnAboutEric() { this.sendWelcomeAction("about"); },
    sendWelcomeAction(this: any, action: string) {
      if (this.quickActionsDisabled || !this.connected || !this.open
        || (action !== "service" && action !== "about")) return;
      const frame = this.$refs.viewer.firstElementChild;
      if (!frame?.contentWindow) return;
      const token = this.welcomeToken;
      this.welcomeDismissed = true;
      this.welcomeToken = "";
      frame.contentWindow.postMessage({ type: "nimblerbot-welcome", event: "submit", token, action }, new URL(this.url).origin);
      frame.focus();
    },
    toggle(this: any) {
      if (this.open) return this.close();
      this.open = true;
      this.connect();
      this.$nextTick(() => this.$refs.close.focus());
    },
    close(this: any) {
      if (!this.open) return;
      this.open = false;
      this.$refs.launcher.focus();
    },
    connect(this: any) {
      if (!this.open || !this.enabled || this.connected || !this.url) return;
      const frame = document.createElement("iframe");
      frame.title = this.$root.dataset.frameTitle ?? "AI assistant";
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
      frame.referrerPolicy = "no-referrer";
      frame.className = "h-full w-full border-0 bg-white";
      frame.src = this.url;
      this.$refs.viewer.append(frame);
      this.connected = true;
      // No load/timeout event can establish the health of a cross-origin LLM.
    },
    end(this: any) {
      this.$refs.viewer.replaceChildren();
      this.connected = false;
      this.welcomeToken = "";
      this.welcomeDismissed = false;
    },
    restart(this: any) {
      this.end();
      this.connect();
    },
    finish() {
      this.end();
      this.close();
    },
    destroy() {
      this.end();
      if (this.onPageHide) window.removeEventListener("pagehide", this.onPageHide);
      if (this.onWelcomeMessage) window.removeEventListener("message", this.onWelcomeMessage);
    },
  };
}
