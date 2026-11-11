import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { ui } from "../i18n/ui.ts";
import { nimblerbotConfig, chatAllowedOnHost } from "./nimblerbotConfig.ts";

const valid = {
  PUBLIC_NIMBLERBOT_ENABLED: "true",
  PUBLIC_NIMBLERBOT_VIEWER_ORIGIN: "https://viewer.nimblerbot.com",
  PUBLIC_NIMBLERBOT_PUBLIC_ID: "ericmaster-ninja-web-canary",
};

test("absent or disabled configuration is contact-only, even with invalid unused fields", () => {
  for (const flag of [undefined, "", "false"]) {
    assert.deepEqual(nimblerbotConfig({ PUBLIC_NIMBLERBOT_ENABLED: flag, PUBLIC_NIMBLERBOT_VIEWER_ORIGIN: "bad" }), { enabled: false, url: "" });
  }
});
test("only the exact qualified HTTPS production destination is accepted", () => {
  assert.deepEqual(nimblerbotConfig(valid), { enabled: true, url: "https://viewer.nimblerbot.com/ericmaster-ninja-web-canary" });
  for (const origin of [undefined, "http://viewer.nimblerbot.com", "https://viewer.nimblerbot.com/", "https://viewer.dev.nimblerbot.com", "https://evil.example", "https://viewer.nimblerbot.com.evil.example", "https://user@viewer.nimblerbot.com", "https://viewer.nimblerbot.com?x=1"]) {
    assert.throws(() => nimblerbotConfig({ ...valid, PUBLIC_NIMBLERBOT_VIEWER_ORIGIN: origin }));
  }
  for (const id of [undefined, "", "../other", "other", "ericmaster-ninja-web-canary?resume=x", "ericmaster-ninja-web-canary#x"]) {
    assert.throws(() => nimblerbotConfig({ ...valid, PUBLIC_NIMBLERBOT_PUBLIC_ID: id }));
  }
  for (const flag of [true, "1", "TRUE", "yes"]) assert.throws(() => nimblerbotConfig({ ...valid, PUBLIC_NIMBLERBOT_ENABLED: flag }));
});
test("mirrors, localhost and lookalike hosts are contact-only (no implicit preview override)", () => {
  assert.equal(chatAllowedOnHost("ericmaster.ninja"), true);
  for (const host of ["ericmaster.github.io", "localhost", "127.0.0.1", "preview.example", "ericmaster.ninja.evil.example"]) assert.equal(chatAllowedOnHost(host), false);
});

test("both notices preserve the independently supplied P1 wording and privacy fragments", () => {
  for (const [lang, digest, file] of [
    ["en", "9dd0d228e5a28810625d0a8500cf4c5965d9bfcf94e25c89a436d688cb957e09", "privacy-content.md"],
    ["es", "e8840e5456d9e9cb8f777469f92c7eae75a4d145435a89a6f95948e7c2bc6745", "privacy-content.es.md"],
  ] as const) {
    const notice = ui[lang]["chatbot.notice"];
    assert.equal(createHash("sha256").update(notice).digest("hex"), digest);
    assert.ok(readFileSync(new URL(`../pages/content/pages/${file}`, import.meta.url), "utf8").includes(notice));
  }
});
