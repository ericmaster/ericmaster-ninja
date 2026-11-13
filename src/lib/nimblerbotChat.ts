import { chatAllowedOnHost } from "./nimblerbotConfig.ts";

const noticePreferenceKey = "ericmaster-chat-notice-v1";

/** Registered once before Alpine.start; connect only when opened, with page-local state. */
export function nimblerbotChat() {
  return {
    open: false,
    connected: false,
    enabled: false,
    noticeDismissed: false,
    url: "",
    onPageHide: null as (() => void) | null,
    init(this: any) {
      try {
        this.noticeDismissed = window.localStorage.getItem(noticePreferenceKey) === "dismissed";
      } catch { /* Storage may be disabled; dismissal still works for this page. */ }
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
    },
    get panelClass() { return { hidden: !this.open }; },
    get contactOnlyClass() { return { hidden: this.enabled }; },
    get sessionClass() { return { hidden: !this.connected }; },
    get noticeClass() { return { hidden: !this.enabled || this.noticeDismissed }; },
    get ariaExpanded() { return String(this.open); },
    dismissNotice(this: any) {
      this.noticeDismissed = true;
      try { window.localStorage.setItem(noticePreferenceKey, "dismissed"); }
      catch { /* A UI preference must never prevent use of the chat. */ }
      this.$refs.close.focus();
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
      // Bot-owned direct-contact links open separately; never allow top navigation.
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
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
    },
  };
}
