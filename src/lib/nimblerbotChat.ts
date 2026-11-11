import { chatAllowedOnHost } from "./nimblerbotConfig.ts";

/** Registered once before Alpine.start; all consent/session state is page-local. */
export function nimblerbotChat() {
  return {
    open: false,
    connected: false,
    enabled: false,
    url: "",
    onPageHide: null as (() => void) | null,
    init(this: any) {
      this.enabled = this.$el.dataset.enabled === "true" && chatAllowedOnHost(window.location.hostname);
      this.url = this.enabled ? this.$el.dataset.viewerUrl ?? "" : "";
      this.onPageHide = () => this.end();
      window.addEventListener("pagehide", this.onPageHide);
    },
    get panelClass() { return { hidden: !this.open }; },
    get consentClass() { return { hidden: this.connected || !this.enabled }; },
    get contactOnlyClass() { return { hidden: this.enabled }; },
    get sessionClass() { return { hidden: !this.connected }; },
    get ariaExpanded() { return String(this.open); },
    toggle(this: any) {
      if (this.open) return this.close();
      this.open = true;
      this.$nextTick(() => this.$refs.close.focus());
    },
    close(this: any) {
      if (!this.open) return;
      this.open = false;
      this.$refs.launcher.focus();
    },
    accept(this: any) {
      if (!this.enabled || this.connected || !this.url) return;
      const frame = document.createElement("iframe");
      frame.title = this.$root.dataset.frameTitle ?? "AI assistant";
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
      frame.referrerPolicy = "no-referrer";
      frame.className = "h-full w-full border-0 bg-white";
      frame.src = this.url;
      this.$refs.viewer.append(frame);
      this.connected = true;
      this.$nextTick(() => frame.focus());
      // No load/timeout event can establish the health of a cross-origin LLM.
    },
    end(this: any) {
      this.$refs.viewer.replaceChildren();
      this.connected = false;
    },
    restart(this: any) {
      this.end();
      this.$nextTick(() => this.$refs.accept.focus());
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
