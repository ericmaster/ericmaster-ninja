import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { nimblerbotChat } from "./nimblerbotChat.ts";

for (const [language, flowLanguage] of [["en", "English"], ["es", "Spanish"]]) {
test(`${language}: opening starts chat once; close preserves it, retry replaces it, end/pagehide clean up`, () => {
  const frames: any[] = [];
  const events = new Map<string, () => void>();
  let focused = "";
  const originalDocument = globalThis.document;
  const originalWindow = globalThis.window;
  globalThis.window = {
    location: { hostname: "ericmaster.ninja", search: "?Language=other&resume=foreign&resultId=foreign&startFrom=call&secret=never-forward" },
    addEventListener: (name: string, fn: () => void) => events.set(name, fn),
    removeEventListener: (name: string) => events.delete(name),
  } as any;
  globalThis.document = {
    createElement: () => ({ setAttribute: mock.fn(), focus: () => { focused = "frame"; } }),
  } as any;
  const component = Object.assign(nimblerbotChat(), {
      $el: { dataset: { enabled: "true", viewerUrl: "https://viewer.nimblerbot.com/ericmaster-ninja-web-canary", language, frameTitle: "Localized title" } },
    $root: { dataset: { frameTitle: "Localized title" } },
    $refs: {
      viewer: { append: (frame: any) => frames.push(frame), replaceChildren: () => frames.splice(0) },
      launcher: { focus: () => { focused = "launcher"; } },
      close: { focus: () => { focused = "close"; } },
    },
    $nextTick: (fn: () => void) => fn(),
  });
  try {
      component.init();
      assert.equal(component.url, `https://viewer.nimblerbot.com/ericmaster-ninja-web-canary?Language=${flowLanguage}`);
    assert.equal(frames.length, 0, "no connection until the visitor opens chat");
    // Alpine's event scope exposes the clicked button as $el, not the data root.
    component.$el = { dataset: {} } as any;
    component.toggle();
    assert.equal(focused, "close");
    assert.equal(frames.length, 1);
    const frame = frames[0];
    assert.equal(events.has("message"), false, "the website has no action bridge");
    assert.equal(frame.src, component.url);
    assert.equal(frame.title, "Localized title");
    assert.equal(frame.referrerPolicy, "no-referrer");
    assert.deepEqual(frame.setAttribute.mock.calls[0].arguments, ["sandbox", "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"]);
    component.connect();
    assert.equal(frames.length, 1);
    component.close();
    assert.equal(focused, "launcher");
    component.toggle();
    assert.equal(frames[0], frame);
    component.restart();
    assert.equal(frames.length, 1);
    assert.equal(component.connected, true);
      assert.notEqual(frames[0], frame);
      assert.equal(frames[0].src, frame.src, "new conversation retains the page language only");
    component.finish();
    assert.equal(frames.length, 0);
    assert.equal(component.open, false);
    component.toggle();
    events.get("pagehide")!();
    assert.equal(frames.length, 0);
    component.destroy();
    assert.equal(events.size, 0);
      component.$el = { dataset: { enabled: "true", viewerUrl: "https://viewer.nimblerbot.com/ericmaster-ninja-web-canary", language } } as any;
    component.init();
    assert.equal(component.connected, false);
    (window.location as any).hostname = "ericmaster.github.io";
    component.init();
    component.toggle();
    assert.equal(component.enabled, false);
    assert.equal(frames.length, 0);
    component.destroy();
  } finally {
    globalThis.document = originalDocument;
    globalThis.window = originalWindow;
  }
  });
}

test("missing or invalid page language never connects or introduces a selector", () => {
  const originalWindow = globalThis.window;
  globalThis.window = { location: { hostname: "ericmaster.ninja" }, addEventListener() {}, removeEventListener() {} } as any;
  try {
    for (const language of [undefined, "", "fr", "EN", "Spanish", "es&resume=foreign", "__proto__"]) {
      const component = Object.assign(nimblerbotChat(), {
        $el: { dataset: { enabled: "true", viewerUrl: "https://viewer.nimblerbot.com/ericmaster-ninja-web-canary", language } },
        $refs: { close: { focus() {} } },
        $nextTick: (fn: () => void) => fn(),
      });
      component.init();
      component.toggle(); // No document/iframe available: connection would fail this test.
      assert.equal(component.enabled, false);
      assert.equal(component.url, "");
      assert.equal(component.connected, false);
      assert.equal(component.contactOnlyClass.hidden, false);
    }
  } finally { globalThis.window = originalWindow; }
});

test("avatar and localized inline notice replace the consent screen", async () => {
  const { readFile } = await import("node:fs/promises");
  const component = await readFile(new URL("../components/AiChatbot.astro", import.meta.url), "utf8");
  const { ui } = await import("../i18n/ui.ts");
  assert.match(component, /src="\/assets\/images\/ai-avatar\.jpg"/);
  assert.match(component, /id="chatbot-notice"/);
    assert.match(component, /getLocalePath\(lang, "\/privacy"\)/);
    assert.match(component, /data-language=\{lang\}/);
  assert.doesNotMatch(component, /chatbot-accept-btn|consentClass|@click="accept"|onerror=/);
  assert.equal(ui.en["chatbot.notice"], "By using this chat, you agree to the");
  assert.equal(ui.es["chatbot.notice"], "Al usar este chat, aceptas el");
});

test("welcome actions belong to the bot, not website controls or messaging", async () => {
  const { readFile } = await import("node:fs/promises");
  const component = await readFile(new URL("../components/AiChatbot.astro", import.meta.url), "utf8");
  const controller = await readFile(new URL("./nimblerbotChat.ts", import.meta.url), "utf8");
  const { ui } = await import("../i18n/ui.ts");
  assert.doesNotMatch(component, /chatbot-quick-actions|chatbot-service|chatbot-about|chatbot-quick-contact/);
  assert.doesNotMatch(controller, /postMessage|nimblerbot-welcome|onWelcomeMessage|sendWelcomeAction/);
  assert.match(component, /id="chatbot-contact"/, "disabled-chat fallback retains direct contact");
  assert.doesNotMatch(component.split("<footer")[1].split("</footer>")[0], /chatbot-contact/);
  for (const locale of [ui.en, ui.es]) {
    assert.equal("chatbot.quickService" in locale, false);
    assert.equal("chatbot.quickAbout" in locale, false);
    assert.equal("chatbot.quickContact" in locale, false);
  }
});

test("notice dismissal persists across mounts and language changes without storing chat data", () => {
  const originalWindow = globalThis.window;
  const values = new Map<string, string>();
  globalThis.window = {
    location: { hostname: "ericmaster.ninja" },
    addEventListener() {}, removeEventListener() {},
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
  } as any;
  const make = (language = "en") => Object.assign(nimblerbotChat(), {
    $el: { dataset: { enabled: "true", viewerUrl: "https://viewer.nimblerbot.com/ericmaster-ninja-web-canary", language } },
    $refs: { close: { focus() {} } },
  });
  try {
    const first = make(); first.init();
    assert.equal(first.noticeClass.hidden, false);
    first.dismissNotice();
    assert.equal(first.noticeClass.hidden, true);
    assert.deepEqual([...values.values()], ["dismissed"]);
    const reopened = make("es"); reopened.init();
    assert.equal(reopened.noticeClass.hidden, true);
    assert.equal(reopened.connected, false);
    Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage denied"); } });
    const unavailable = make(); unavailable.init();
    assert.equal(unavailable.noticeClass.hidden, false);
    unavailable.dismissNotice();
    assert.equal(unavailable.noticeClass.hidden, true);
  } finally { globalThis.window = originalWindow; }
});
