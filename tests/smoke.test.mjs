import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("exports a complete Chinese HTML document", () => {
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /<html lang="zh-CN"/);
  assert.match(html, /<title>凡人修仙传：人界篇开放世界模拟器<\/title>/);
  assert.match(html, /id="fanren-human-world"/);
});

test("keeps the core human-world rules", () => {
  assert.match(html, /化神大圆满/);
  assert.match(html, /寻找飞升灵界的通道/);
  assert.match(html, /人界强行动用天地灵力/);
  assert.match(html, /一百余岁/);
  assert.match(html, /两千余岁/);
});

test("keeps choices and local saves", () => {
  assert.match(html, /顺应 · 稳妥/);
  assert.match(html, /逆反 · 搞事/);
  assert.match(html, /观望 · 探索/);
  assert.match(html, /自由行动/);
  assert.match(html, /fanren_human_world_v1/);
  assert.match(html, /localStorage\.setItem/);
});

test("all inline scripts parse", () => {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
  assert.ok(scripts.length > 0, "expected at least one inline script");
  for (const [index, match] of scripts.entries()) {
    assert.doesNotThrow(
      () => new vm.Script(match[1], { filename: `inline-script-${index + 1}.js` }),
      `inline script ${index + 1} should parse`,
    );
  }
});
