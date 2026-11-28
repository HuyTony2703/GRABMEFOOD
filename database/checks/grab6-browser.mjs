// Run from frontend/ after npm run build; read-only requests to Supabase.
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";

const origin = "http://127.0.0.1:4240";
assert(process.env.GMF_SUPABASE_URL && process.env.GMF_SUPABASE_PUBLISHABLE_KEY);
const referenceResponse = await fetch(
  process.env.GMF_SUPABASE_URL + "/rest/v1/restaurants?select=id&slug=eq.demo-reference-ngo-quyen-3",
  { headers: { apikey: process.env.GMF_SUPABASE_PUBLISHABLE_KEY } },
);
assert.equal(referenceResponse.status, 200);
const [reference] = await referenceResponse.json();
assert(reference?.id, "Seeded reference restaurant exists");
const referencePath = `/quan/${reference.id}?lang=en`;
const app = spawn(process.execPath, ["server.mjs", "--production"], {
  env: { ...process.env, PORT: "4240", GMF_PUBLIC_SITE_ORIGIN: origin }, stdio: "ignore",
});
const profile = mkdtempSync(join(process.env.LOCALAPPDATA, "Temp", "opencode", "grab6-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless", "--disable-gpu", "--no-first-run", "--remote-debugging-port=9369",
  `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });
const wait = ms => new Promise(r => setTimeout(r, ms));
let ws;
const results = [];
const mapResponses = [];
const providerErrors = [];
const providerContexts = [];
let blockedRequests = 0;
const iframeSessions = new Set();
const evidence = resolve("../docs/evidence/grab6-public-ssr-2026-11-27");
mkdirSync(evidence, { recursive: true });
try {
  let page;
  for (let i = 0; i < 80; i++) {
    try {
      page = (await (await fetch("http://127.0.0.1:9369/json/list")).json()).find(p => p.type === "page");
      const r = await fetch(origin);
      if (page && r.status === 200) break;
    } catch {}
    await wait(100);
  }
  assert(page, "Browser and app ready");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  let id = 0;
  const pending = new Map();
  const browserErrors = [];
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.executionContextCreated"
      && msg.params.context.origin?.includes("google.com")) {
      providerContexts.push({ id: msg.params.context.id, sessionId: msg.sessionId });
    }
    if (msg.method === "Target.attachedToTarget" && msg.params.targetInfo.type === "iframe") {
      iframeSessions.add(msg.params.sessionId);
      void cdp("Runtime.enable", {}, msg.params.sessionId).catch(() => {});
      void cdp("Network.enable", {}, msg.params.sessionId).catch(() => {});
    }
    if (msg.method === "Fetch.requestPaused") {
      blockedRequests++;
      void cdp("Fetch.failRequest", { requestId: msg.params.requestId, errorReason: "BlockedByClient" },
        msg.sessionId).catch(() => {});
    }
    if (msg.method === "Network.loadingFailed" && msg.sessionId) {
      providerErrors.push({ error: msg.params.errorText, reason: msg.params.blockedReason });
    }
    if (msg.method === "Network.loadingFailed" && msg.params.blockedReason) blockedRequests++;
    if (msg.method === "Network.responseReceived"
      && /^https:\/\/www\.google\.com\/maps/.test(msg.params.response.url)) {
      mapResponses.push({ status: msg.params.response.status });
    }
    if (msg.method === "Runtime.exceptionThrown") browserErrors.push("Uncaught browser exception");
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      const errors = msg.sessionId ? providerErrors : browserErrors;
      errors.push(msg.params.args.map(a => a.value ?? a.description ?? "").join(" "));
    }
    if (pending.has(msg.id)) {
      const { ok, fail, timer } = pending.get(msg.id);
      clearTimeout(timer);
      pending.delete(msg.id);
      if (msg.error || msg.result?.exceptionDetails) fail(new Error("CDP failed"));
      else ok(msg.result);
    }
  };
  function cdp(method, params = {}, sessionId) {
    return new Promise((ok, fail) => {
      const callId = ++id;
      const timer = setTimeout(() => { pending.delete(callId); fail(new Error("CDP timeout")); }, 20000);
      pending.set(callId, { ok, fail, timer });
      ws.send(JSON.stringify({ id: callId, method, params, sessionId }));
    });
  }
  const evalJs = async expression => (await cdp("Runtime.evaluate", {
    expression, awaitPromise: true, returnByValue: true,
  })).result.value;
  await cdp("Runtime.enable");
  await cdp("Network.enable");
  await cdp("Target.setAutoAttach", { autoAttach: true, waitForDebuggerOnStart: false, flatten: true });
  const routes = [
    ["/", 200], ["/?lang=en&q=pho", 200], ["/bai-viet?lang=en", 200],
    ["/bai-viet/bai-demo?lang=en", 200], ["/bai-viet/bai-an", 404],
    ["/tuyen-chon?lang=en", 200], ["/tuyen-chon/tuyen-chon-demo?lang=en", 200],
    ["/quan/20000000-0000-0000-0000-000000000003", 404],
    ["/?lang=en&q=pho", 200],
    ["/?q=" + encodeURIComponent("phở"), 200],
    ["/?area=10000000-0000-0000-0000-000000000001", 200],
    ["/quan/20000000-0000-0000-0000-000000000001?lang=en", 200],
    ["/quan/20000000-0000-0000-0000-000000000001/mon/30000000-0000-0000-0000-000000000001?lang=en", 200],
    ["/quan/20000000-0000-0000-0000-000000000002/mon/30000000-0000-0000-0000-000000000001", 404],
    ["/quan/20000000-0000-0000-0000-000000000001/mon/30000000-0000-0000-0000-000000000002", 404],
    ["/quan/20000000-0000-0000-0000-000000000002", 200],
    [referencePath, 200],
  ];
  for (const [path, status] of routes) {
    const response = await fetch(origin + path);
    const html = await response.text();
    assert.equal(response.status, status, path);
    assert(html.includes('property="og:title"'), "SSR metadata");
    if (status === 200) assert(html.includes(`href="${origin}`), "Configured canonical in HTML");
    if (path.includes("q=pho")) {
      assert(html.includes("Pho Place A"));
      assert(!html.includes("Rice Place B"));
      assert(html.includes("q=pho&amp;lang=") || html.includes("q=pho"), "Query retained");
    }
    if (path.includes(encodeURIComponent("phở"))) {
      assert(html.includes("Quán Phở A"), "Vietnamese accented search finds matching restaurant");
      assert(!html.includes("Quán Cơm B"), "Vietnamese accented search excludes non-matching restaurant");
    }
    if (path.includes("?area=")) {
      assert(html.includes("Quán Phở A"));
      assert(!html.includes("Quán Cơm B"));
    }
    assert(!html.includes("<!--ssr-head-->"), "Head injected");
    if (status === 200) assert(html.includes('rel="canonical"'), "Canonical emitted");
    if (path === referencePath) {
      assert(html.includes('property="og:image"'), "Reference has preview image");
      assert(html.includes("<iframe"), "Reference has map embed");
      assert(html.includes("14711144814665560466"), "Map link targets referenced place");
    }
    results.push({ path, status, ssrMetadata: true });
  }
  for (const width of [1280, 390]) {
    await cdp("Emulation.setDeviceMetricsOverride", {
      width, height: 900, deviceScaleFactor: 1, mobile: width < 600,
    });
    for (const [name, path] of [["discovery", "/"], ["article", "/bai-viet/bai-demo?lang=en"],
      ["selection", "/tuyen-chon/tuyen-chon-demo?lang=en"],
      ["restaurant", "/quan/20000000-0000-0000-0000-000000000001?lang=en"],
      ["dish", "/quan/20000000-0000-0000-0000-000000000001/mon/30000000-0000-0000-0000-000000000001?lang=en"],
      ["no-dishes", "/quan/20000000-0000-0000-0000-000000000002"],
      ["reference-map", referencePath]]) {
      const mapStart = mapResponses.length;
      await cdp("Page.navigate", { url: origin + path });
      let state;
      for (let attempt = 0; attempt < 80; attempt++) {
        await wait(100);
        state = await evalJs(`({
          path: location.pathname,
          ready: document.readyState === "complete" && !!document.querySelector("h1"),
          overflow: document.documentElement.scrollWidth > innerWidth,
          heading: document.querySelector("h1")?.textContent,
          lang: document.documentElement.lang,
          searchForm: !!document.querySelector('form[method="get"]')
        })`);
        if (state.ready && state.path === new URL(origin + path).pathname) break;
      }
      assert(state.ready, "Browser page ready");
      assert(!state.overflow, `${width} ${name} horizontal overflow`);
      if (name === "discovery") assert(state.searchForm);
      if (name === "reference-map") {
        assert.equal(await evalJs(`document.querySelectorAll(".restaurant-detail__dishes a").length`), 2,
          "Reference restaurant exposes both demo dishes");
        await evalJs(`document.querySelector("iframe").scrollIntoView({block:"center"})`);
        await wait(5000);
        for (const context of providerContexts) {
          try {
            const info = await cdp("Runtime.evaluate", { contextId: context.id,
              expression: `({url:location.href,text:document.body.innerText.slice(0,600),frames:document.querySelectorAll('canvas').length})`,
              returnByValue: true }, context.sessionId);
            if (info.result?.value?.text?.includes("Map data")) {
              results.push({ width, mapDocument: { attributionVisible: true } });
            }
          } catch {}
        }
      }
      if (name === "reference-map") {
        await evalJs(`(() => {
          const frame = document.querySelector("iframe");
          frame.loading = "eager"; frame.scrollIntoView();
          return true;
        })()`);
        for (let i = 0; i < 100 && !mapResponses.slice(mapStart).some(r => r.status === 200); i++) await wait(100);
        assert(mapResponses.slice(mapStart).some(r => r.status === 200), `${width} Google map embed returned 200`);
        await evalJs("scrollTo(0, 0)");
      }
      const media = await evalJs(`Promise.all([...document.images].map(async img => {
        img.loading = "eager";
        try { await img.decode(); } catch {}
        return { loaded: img.naturalWidth > 0, src: new URL(img.src).pathname };
      }))`);
      assert(media.every(img => img.loaded), "All page images decode");
      if (name === "reference-map") {
        await evalJs(`document.querySelector("iframe").scrollIntoView({block:"center"})`);
        await wait(1500);
        const viewport = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        writeFileSync(join(evidence, `map-viewport-${width}.png`), Buffer.from(viewport.data, "base64"));
      }
      const image = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      writeFileSync(join(evidence, `${name}-${width}.png`), Buffer.from(image.data, "base64"));
      results.push({ width, name, ...state, media });
    }
  }
  await cdp("Page.navigate", { url: origin + "/?lang=en" });
  for (let i = 0; i < 100; i++) {
    await wait(100);
    const state = await cdp("Runtime.evaluate", { expression:
      `document.readyState === "complete" && document.documentElement.lang === "en" && !!document.querySelector('input[name="q"]')`,
    returnByValue: true });
    if (state.result.value) break;
  }
  await cdp("Runtime.evaluate", { expression: `(() => {
    const input = document.querySelector('input[name="q"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'pho');
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.form.requestSubmit();
  })()` });
  let submitted;
  for (let i = 0; i < 100; i++) {
    await wait(100);
    const state = await cdp("Runtime.evaluate", { expression: `({
      ready: document.readyState === "complete" && new URLSearchParams(location.search).get("q") === "pho",
      count: document.querySelectorAll(".restaurant").length,
      localeLink: document.querySelector('a[lang="vi"]')?.getAttribute("href")
    })`, returnByValue: true });
    submitted = state.result.value;
    if (submitted.ready) break;
  }
  assert(submitted.ready && submitted.count === 1, "Browser GET form filters real data");
  assert(submitted.localeLink.includes("q=pho"), "Locale link keeps query");
  results.push({ interaction: "GET search form and locale preservation", ...submitted });
  await cdp("Network.setBlockedURLs", { urls: ["*://www.google.com/maps*"] });
  await cdp("Page.navigate", { url: origin + referencePath });
  let fallback;
  for (let i = 0; i < 100; i++) {
    await wait(100);
    fallback = await evalJs(`({
      ready: document.readyState === "complete" && location.pathname === ${JSON.stringify(new URL(origin + referencePath).pathname)},
      help: document.body.textContent.includes("If the map is blank or blocked"),
      link: [...document.querySelectorAll("a")].find(a => a.textContent === "View on Google Maps")?.href
    })`);
    if (fallback.ready && fallback.help) break;
  }
  await evalJs(`document.querySelector("iframe")?.scrollIntoView({block:"center"})`);
  const blockPatterns = { patterns: [{ urlPattern: "*google.com/maps*", requestStage: "Request" }] };
  await cdp("Fetch.enable", blockPatterns);
  for (const session of iframeSessions) {
    try { await cdp("Fetch.enable", blockPatterns, session); } catch {}
  }
  await evalJs(`(() => {
    const frame = document.querySelector("iframe");
    frame.loading = "eager"; frame.src = frame.src + "&grab6-blocked-check=1";
  })()`);
  for (let i = 0; i < 30 && blockedRequests === 0; i++) await wait(100);
  assert(blockedRequests > 0, "Google iframe request actually blocked");
  assert(fallback.help && fallback.link?.includes("14711144814665560466"),
    "Map fallback guidance and correct place link remain available");
  const blockedImage = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(join(evidence, "map-blocked-390.png"), Buffer.from(blockedImage.data, "base64"));
  results.push({ interaction: "Blocked map fallback", help: fallback.help, blockedRequests,
    correctPlaceLink: fallback.link.includes("14711144814665560466") });
  await cdp("Network.setBlockedURLs", { urls: [] });
  assert.deepEqual(browserErrors, [], "No hydration errors or uncaught exceptions");
  results.push({ interaction: "Runtime console and hydration", errors: browserErrors.length });
  results.push({ interaction: "Google consumer embed", responses: mapResponses, providerErrors });
  console.log(JSON.stringify({ providerErrors }));
  writeFileSync(join(evidence, "browser-results.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ checks: results.length, failures: 0 }));
} finally {
  ws?.close();
  chrome.kill();
  app.kill();
}
