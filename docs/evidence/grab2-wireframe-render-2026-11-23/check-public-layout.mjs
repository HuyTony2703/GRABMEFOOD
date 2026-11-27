// Run from frontend/ after building. Uses only Node built-ins and installed Chrome.
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const base = "http://127.0.0.1:4236";
const app = spawn(process.execPath, ["server.mjs", "--production"], { env: { ...process.env, PORT: "4236" } });
const profile = mkdtempSync(join(process.env.LOCALAPPDATA, "Temp", "opencode", "layout-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless", "--disable-gpu", "--force-device-scale-factor=1", "--remote-debugging-port=9280",
  "--window-size=1280,900", `--user-data-dir=${profile}`, "about:blank",
]);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
async function until(fn) {
  for (let i = 0; i < 80; i++) {
    try { const result = await fn(); if (result) return result; } catch {}
    await wait(80);
  }
  throw Error("Timed out waiting for " + fn);
}

// Compare each text fragment against the viewport and its actual clipping ancestors.
function inspect() {
  const failures = [];
  let count = 0;
  for (const e of document.querySelectorAll("a,label,input,select,button,h1,h2,h3,address,.dish-detail__price")) {
    if (!e.getClientRects().length) continue;
    count++;
    const bounds = e.getBoundingClientRect();
    if (bounds.left < -1 || bounds.right > document.documentElement.clientWidth + 1) failures.push(`${e.tagName}: viewport`);
    const texts = document.createTreeWalker(e, NodeFilter.SHOW_TEXT);
    for (let node; (node = texts.nextNode());) {
      if (!node.textContent.trim() || e.matches("select")) continue;
      const r = document.createRange(); r.selectNodeContents(node);
      for (const box of r.getClientRects()) {
        if (!box.width) continue;
        if (box.left < -1 || box.right > document.documentElement.clientWidth + 1) failures.push(`${e.tagName}: text outside viewport`);
        for (let a = node.parentElement; a && a !== document.body; a = a.parentElement) {
          const b = a.getBoundingClientRect(), css = getComputedStyle(a);
          if ((css.overflowX !== "visible" && (box.left < b.left-1 || box.right > b.right+1)) ||
              (css.overflowY !== "visible" && (box.top < b.top-1 || box.bottom > b.bottom+1))) failures.push(`${e.tagName}: clipped by ${a.className}`);
        }
      }
    }
    if (e.matches("input,select")) {
      const css = getComputedStyle(e), ctx = document.createElement("canvas").getContext("2d");
      ctx.font = `${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
      const available = e.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight) - (e.matches("select") ? 20 : 0);
      const values = e.matches("select") ? [...e.options].map(o => o.text) : [e.placeholder];
      if (values.some(v => ctx.measureText(v).width > available + 1)) failures.push(`${e.tagName}: label width`);
    }
  }
  return { count, failures: [...new Set(failures)] };
}
try {
  await until(async () => (await fetch(base)).ok);
  const target = await until(async () => (await (await fetch("http://127.0.0.1:9280/json/list")).json()).find(t => t.type === "page"));
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => socket.onopen = r);
  let id = 0;
  const jobs = new Map();
  socket.onmessage = e => { const m = JSON.parse(e.data); if (jobs.has(m.id)) { jobs.get(m.id)(m); jobs.delete(m.id); } };
  async function send(method, params = {}) {
    const m = await new Promise(r => { jobs.set(++id, r); socket.send(JSON.stringify({ method, params, id })); });
    if (m.error) throw Error(m.error.message);
    return m.result;
  }
  async function js(expression) {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.text);
    return r.result.value;
  }
  async function nav(url) {
    await send("Page.navigate", { url });
    await until(() => js(`location.href===${JSON.stringify(url)} && document.readyState==='complete'`));
  }
  let total = 0, failed = 0, focused = 0;
  if (process.argv.includes("--dialog")) {
    await nav("chrome://settings/appearance");
    await js("chrome.settingsPrivate.setDefaultZoom(2)");
    await send("Page.bringToFront");
    const key = async (key, code, windowsVirtualKeyCode, modifiers = 0) => {
      for (const type of ["keyDown", "keyUp"]) await send("Input.dispatchKeyEvent",
        { type, key, code, windowsVirtualKeyCode, nativeVirtualKeyCode: windowsVirtualKeyCode, modifiers,
          ...(type === "keyDown" && key === "Enter" ? { text: "\r" } : {}) });
    };
    const tab = (reverse = false) => key("Tab", "Tab", 9, reverse ? 8 : 0);
    const enter = () => key("Enter", "Enter", 13);
    const space = () => key(" ", "Space", 32);
    for (const locale of ["vi", "en"]) for (const path of ["/quan/bep-lau-tre", "/quan/bep-lau-tre/mon/bun-nam"]) {
      const en = locale === "en";
      const opener = en ? "Choose a collection (demo)" : "Chọn bộ sưu tập (demo)";
      const cancel = en ? "Cancel" : "Hủy";
      await nav(base + path + (en ? "?lang=en" : ""));
      await wait(500); // Let the production client hydrate before sending keys.
      assert.equal(await js("devicePixelRatio"), 2);
      for (let i = 0; i < 10 && !await js("document.activeElement.matches('.collection-demo > button')"); i++) await tab();
      assert.equal(await js("document.activeElement.textContent"), opener);
      const closedTree = await send("Accessibility.getFullAXTree");
      assert.ok(closedTree.nodes.some(n => !n.ignored && n.role?.value === "button" && n.name?.value === opener));
      await enter();
      await until(() => js("document.activeElement.matches('dialog[open] input:first-of-type')"));
      const tree = await send("Accessibility.getFullAXTree");
      for (const [role, name] of [
        ["dialog", en ? "Choose one collection" : "Chọn một bộ sưu tập"],
        ["button", cancel],
        ["button", en ? "Confirm demo selection" : "Xác nhận lựa chọn demo"],
      ]) assert.ok(tree.nodes.some(n => !n.ignored && n.role?.value === role && n.name?.value === name), name);
      await tab(true);
      assert.equal(await js("document.activeElement.textContent"), cancel);
      await tab();
      assert.equal(await js("document.activeElement.matches('dialog[open] input')"), true);
      await space(); // Select a radio, enabling confirm.
      await until(() => js("!document.querySelector('dialog button[type=submit]').disabled"));
      await tab(true);
      assert.equal(await js("document.activeElement.matches('dialog button[type=submit]')"), true);
      await tab();
      assert.equal(await js("document.activeElement.matches('dialog[open] input:checked')"), true);
      await key("Escape", "Escape", 27);
      await until(() => js("!document.querySelector('dialog').open && document.activeElement.matches('.collection-demo > button')"));
      await space();
      await until(() => js("document.activeElement.matches('dialog[open] input')"));
      await tab();
      assert.equal(await js("document.activeElement.textContent"), cancel);
      await enter();
      await until(() => js("!document.querySelector('dialog').open && document.activeElement.matches('.collection-demo > button')"));
      console.log("PASS zoom 200% keyboard and AX names", locale, path);
    }
    process.exitCode = 0;
  } else {
  for (const [mode, width, font, zoom] of [["desktop",1280,16,1],["mobile",390,16,1],["mobile-text",390,32,1],["desktop-zoom",1280,16,2]]) {
    await send("Emulation.clearDeviceMetricsOverride");
    await nav("chrome://settings/appearance");
    await js(`chrome.settingsPrivate.setPref('webkit.webprefs.default_font_size',${font})`);
    await js(`chrome.settingsPrivate.setDefaultZoom(${zoom})`);
    if (zoom === 1) await send("Emulation.setDeviceMetricsOverride",{width,height:844,deviceScaleFactor:1,mobile:width<500});
    for (const locale of ["vi","en"]) for (const path of ["/","/quan/goc-bep-mua","/quan/goc-bep-mua/mon/com-nuong"]) {
      await nav(base + path + (locale==="en"?"?lang=en":""));
      assert.equal(await js("document.documentElement.lang"),locale);
      assert.equal(await js("devicePixelRatio"),zoom);
      assert.equal(await js("parseFloat(getComputedStyle(document.documentElement).fontSize)"),font);
      if (path.endsWith("goc-bep-mua")) assert.ok(await js("document.querySelector('address').textContent.length>80"));
      const result = await js(`(${inspect})()`);
      const targets = await js("document.querySelectorAll('a[href],input,select,button').length - document.querySelectorAll('dialog:not([open]) input,dialog:not([open]) button').length");
      await send("Page.bringToFront");
      const seen = new Set();
      for(let i=0;i<targets;i++){
        for(const type of ["keyDown","keyUp"]) await send("Input.dispatchKeyEvent",{type,key:"Tab",code:"Tab",windowsVirtualKeyCode:9});
        const f = await js(`(()=>{const e=document.activeElement,r=e.getBoundingClientRect(),c=getComputedStyle(e), hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {id:[...document.querySelectorAll('a[href],input,select,button')].indexOf(e),visible:e.contains(hit)&&c.outlineStyle!=='none'&&parseFloat(c.outlineWidth)>0}})()`);
        if(f.id<0||seen.has(f.id)||!f.visible)result.failures.push("focus "+f.id);
        seen.add(f.id); focused++;
      }
      total+=result.count;failed+=result.failures.length;
      console.log(mode,locale,path,result.count,result.failures.join(";")||"OK");
    }
  }
  console.log({total,focused,failed});assert.equal(failed,0);
  }
} finally { socket?.close(); chrome.kill(); app.kill(); }
