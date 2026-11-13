// Uses only Node built-ins and an already installed Chrome/Edge. Never downloads tooling.
import { spawn } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import assert from "node:assert/strict"
import { checkDiscoveryUI } from "./discovery-ui-checks.mjs"

const root = process.env.LOCALAPPDATA
  ? join(process.env.LOCALAPPDATA, "Temp", "opencode")
  : process.env.TEMP
const output = join(root, "grabmefood-verification")
mkdirSync(output, { recursive: true })
const chrome = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find(existsSync)
if (!chrome)
  throw new Error("No installed Chrome/Edge; no browser checks executed.")
const profile = mkdtempSync(join(root, "grabmefood-cdp-"))
const port = 19333
const child = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--remote-debugging-address=127.0.0.1",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let socket
let sequence = 0
const pending = new Map()
function rawSend(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(`CDP timeout: ${method}`))
    }, 20000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function send(method, params = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await rawSend(method, params)
    } catch (error) {
      if (
        attempt >= 4 ||
        !/navigated|context was destroyed|Cannot find context/i.test(
          error.message,
        )
      )
        throw error
      await delay(250)
    }
  }
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.text +
        ": " +
        result.exceptionDetails.exception?.description,
    )
  return result.result.value
}
const routes = [
  "/",
  "/welcome",
  "/onboarding",
  "/map",
  "/random",
  "/favorites",
  "/profile",
  "/login",
  "/register",
  "/restaurant/1",
  "/restaurant/5",
  "/restaurant/1/dish/1",
  "/restaurant/5/dish/d1",
  "/dish/1",
  "/dish/11",
  "/dish/pho-ga",
  "/search",
  "/notifications",
  "/all-restaurants",
  "/all-restaurants?section=today",
  "/profile/reviews",
  "/settings",
  "/settings/account",
  "/settings/address",
  "/settings/notifications",
  "/settings/language",
  "/settings/theme",
  "/settings/support",
  "/settings/terms",
  "/settings/guide",
  "/not-a-route",
]
const results = []
const failures = []
const interactions = []
let currentCheck = "browser startup"
function contrastAudit() {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  const rgba = (color) => {
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)
    return [...ctx.getImageData(0, 0, 1, 1).data]
  }
  const luminance = (rgb) => {
    const a = rgb.slice(0, 3).map((v) => {
      v /= 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
  }
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const issues = []
  let checked = 0
  let imageBackgrounds = 0
  while (walker.nextNode()) {
    const text = walker.currentNode
    const e = text.parentElement
    if (
      !text.textContent.trim() ||
      !e ||
      e.closest("script,style,noscript,[disabled],[aria-disabled=true]")
    )
      continue
    const s = getComputedStyle(e)
    if (
      !e.getClientRects().length ||
      s.visibility !== "visible" ||
      Number(s.opacity) === 0
    )
      continue
    const chain = []
    let node = e
    let unsupported = false
    while (node) {
      const style = getComputedStyle(node)
      if (style.backgroundImage !== "none") unsupported = true
      chain.push(style)
      node = node.parentElement
    }
    if (unsupported) {
      imageBackgrounds++
      continue
    }
    let background = [255, 255, 255]
    for (const style of chain.reverse()) {
      const color = rgba(style.backgroundColor)
      const alpha = color[3] / 255
      background = background.map((v, i) => color[i] * alpha + v * (1 - alpha))
    }
    const color = rgba(s.color)
    const alpha = color[3] / 255
    const foreground = background.map(
      (v, i) => color[i] * alpha + v * (1 - alpha),
    )
    const l1 = luminance(foreground),
      l2 = luminance(background)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const large =
      parseFloat(s.fontSize) >= 24 ||
      (parseFloat(s.fontSize) >= 18.66 && parseFloat(s.fontWeight) >= 700)
    checked++
    if (ratio + 0.01 < (large ? 3 : 4.5))
      issues.push({
        text: text.textContent.trim().slice(0, 70),
        ratio: Number(ratio.toFixed(2)),
        size: s.fontSize,
        color: s.color,
        background,
      })
  }
  return { checked, issues, imageBackgrounds }
}
try {
  let ready = false
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`)
      if (response.ok) {
        ready = true
        break
      }
    } catch {}
    await delay(250)
  }
  if (!ready)
    throw new Error(
      "Installed browser did not expose local DevTools; checks not executed.",
    )
  const page = await (
    await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
      method: "PUT",
    })
  ).json()
  socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true })
    socket.addEventListener("error", reject, { once: true })
  })
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data)
    const entry = pending.get(message.id)
    if (!entry) return
    pending.delete(message.id)
    clearTimeout(entry.timer)
    message.error
      ? entry.reject(new Error(JSON.stringify(message.error)))
      : entry.resolve(message.result)
  })
  await send("Page.enable")
  await send("Runtime.enable")
  const zoomOnly = process.argv.includes("--zoom-only")
  const smoke = process.argv.includes("--smoke") || zoomOnly
  const quick = process.argv.includes("--quick")
  const matrix = process.argv.includes("--interactions-only") ? [] : zoomOnly ? ["/search"] : smoke ? ["/"] : routes
  const widths = zoomOnly
    ? [390]
    : smoke
      ? [390, 1440]
      : quick
        ? [390, 1440]
        : [320, 390, 768, 1024, 1440]
  for (const theme of ["light", "dark"]) {
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: theme }],
    })
    for (const width of widths) {
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      })
      for (const route of matrix) {
        currentCheck = `${theme} ${width}px ${route}`
        await send("Page.navigate", { url: `http://localhost:8443${route}` })
        await delay(350) // Let navigation replace the previous execution context.
        await evaluate(
          `new Promise((resolve,reject)=>{let n=0;const t=setInterval(()=>{if(document.querySelector('main')?.textContent.trim()){clearInterval(t);resolve(true)}else if(++n>80){clearInterval(t);reject(new Error('No main content'))}},50)})`,
        )
        await delay(100)
        if (zoomOnly) {
          await evaluate(`document.documentElement.style.fontSize='32px'`)
          await delay(100)
        }
        const snapshot = await evaluate(`(() => {
          const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
          const name = e => e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.innerText?.trim() || e.labels?.[0]?.innerText?.trim() || e.getAttribute('title');
          return {route:location.pathname, width:innerWidth, theme:document.documentElement.classList.contains('dark')?'dark':'light',
             overflow:document.documentElement.scrollWidth>innerWidth+1,
             desktopLayout:parseFloat(getComputedStyle(document.querySelector('.app-frame')).minWidth)>=1024 && getComputedStyle(document.querySelector('.desktop-navigation')).display==='flex' && !document.querySelector('.mobile-nav'),
            overflowElements:[...document.querySelectorAll('main *')].filter(e=>visible(e)&&e.getBoundingClientRect().right>innerWidth+2).slice(0,6).map(e=>e.tagName+'.'+e.className),
            missingNames:[...document.querySelectorAll('button,input:not([type=hidden]),textarea,select')].filter(e=>visible(e)&&!e.disabled&&!name(e)).map(e=>e.outerHTML.slice(0,140)),
            h1:document.querySelector('main h1')?.textContent.trim(),
            primary:getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
            bodyText:document.querySelector('main')?.innerText.slice(0,120)};
        })()`)
        snapshot.contrast = await evaluate(`(${contrastAudit.toString()})()`)
        snapshot.smallButtons = await evaluate(
          `([...document.querySelectorAll('button,[role=tab]')].filter(e=>e.getClientRects().length&&!e.disabled).map(e=>({name:e.getAttribute('aria-label')||e.innerText,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})).filter(e=>e.width<43||e.height<43))`,
        )
        results.push(snapshot)
        if (
          !snapshot.desktopLayout ||
          (width >= 1024 && !zoomOnly && snapshot.overflow) ||
          snapshot.missingNames.length ||
          snapshot.contrast.issues.length ||
          snapshot.smallButtons.length
        )
          failures.push(snapshot)
        if (
          ["/", "/search", "/settings/theme"].includes(route) &&
          [390, 1440].includes(width)
        ) {
          const shot = await send("Page.captureScreenshot", {
            format: "png",
            captureBeyondViewport: false,
          })
          writeFileSync(
            join(
              output,
              `${
                route === "/" ? "home" : route.slice(1).replaceAll("/", "-")
              }-${width}-${theme}.png`,
            ),
            Buffer.from(shot.data, "base64"),
          )
        }
      }
    }
  }
  if (!smoke) {
    async function go(path, width = 1440) {
      currentCheck = `interaction ${path}`
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 850,
        deviceScaleFactor: 1,
        mobile: false,
      })
      await send("Page.navigate", { url: `http://localhost:8443${path}` })
      await delay(500)
      await evaluate(
        `new Promise(resolve=>{const t=setInterval(()=>{if(document.querySelector('main')?.textContent.trim()){clearInterval(t);resolve(true)}},50)})`,
      )
    }
    const check = (name, value) => {
      interactions.push({ name, passed: !!value })
      if (!value) throw new Error(`Interaction failed: ${name}`)
    }
    await checkDiscoveryUI({
      send,
      evaluate,
      go,
      check,
      capture: async (name) => {
        const shot = await send("Page.captureScreenshot", {
          format: "png",
          captureBeyondViewport: false,
        })
        writeFileSync(
          join(output, `${name}.png`),
          Buffer.from(shot.data, "base64"),
        )
      },
    })
    await go("/search?q=pho&tab=dishes&price=0-50")
    check(
      "search query and range affect actual cards",
      await evaluate(
        `document.querySelectorAll('main .discovery-card').length===0 && document.querySelector('.content-state').innerText.includes('Không có kết quả')`,
      ),
    )
    await evaluate(
      `([...document.querySelectorAll('main button')].find(e=>e.textContent.trim()==='Bộ lọc')).click()`,
    )
    await delay(100)
    check(
      "accessible filter dialog opens",
      await evaluate(
        `!!document.querySelector('[role=dialog][aria-labelledby]')`,
      ),
    )
    let contained = true
    for (let i = 0; i < 28; i++) {
      await send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Tab",
        code: "Tab",
        windowsVirtualKeyCode: 9,
      })
      await send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Tab",
        code: "Tab",
        windowsVirtualKeyCode: 9,
      })
      contained =
        contained &&
        (await evaluate(`!!document.activeElement.closest('[role=dialog]')`))
    }
    check("modal keyboard traversal stays in protected dialog", contained)
    await evaluate(
      `document.querySelector('[role=dialog] input[name=price][value="100-200"]').click()`,
    )
    await delay(100)
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    })
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    })
    await delay(250)
    check(
      "Escape cancels draft and restores focus",
      await evaluate(
        `!document.querySelector('[role=dialog]')&&location.search.includes('price=0-50')&&document.activeElement.textContent.includes('Bộ lọc')`,
      ),
    )
    await evaluate(
      `([...document.querySelectorAll('main button')].find(e=>e.textContent.trim()==='Bộ lọc')).click()`,
    )
    await delay(100)
    check(
      "reopen restores applied filter",
      await evaluate(
        `document.querySelector('[role=dialog] input[name=price][value="0-50"]').checked`,
      ),
    )
    await evaluate(
      `document.querySelector('[role=dialog] input[name=price][value="50-100"]').click()`,
    )
    await delay(100)
    await evaluate(
      `document.querySelector('[role=dialog] button[type=submit]').click()`,
    )
    await delay(250)
    check(
      "Apply updates URL, query and results",
      await evaluate(
        `location.search.includes('price=50-100')&&location.search.includes('q=pho')&&document.querySelectorAll('main .discovery-card').length===2`,
      ),
    )
    const criteriaBefore = await evaluate(`location.search`)
    await evaluate(`document.querySelector('main .discovery-card').click()`)
    await delay(300)
    check(
      "search result opens matching dish",
      await evaluate(
        `location.pathname==='/restaurant/1/dish/1'&&document.querySelector('main h1').textContent==='Phở Bò Tái'`,
      ),
    )
    await evaluate(
      `document.querySelector('main a[aria-label="Quay lại danh sách trước"]').click()`,
    )
    await delay(250)
    check(
      "detail back restores applied criteria",
      (await evaluate(`location.search`)) === criteriaBefore,
    )
    await go("/search?q=zzzz-no-match")
    check(
      "real empty results explain recovery",
      await evaluate(
        `document.querySelectorAll('main .discovery-card').length===0&&document.querySelector('.content-state').innerText.includes('Không có kết quả')`,
      ),
    )
    for (const path of [
      "/dish/unknown",
      "/dish/constructor",
      "/restaurant/unknown",
      "/restaurant/5/dish/1",
    ]) {
      await go(path)
      check(
        `unknown identity stays not-found: ${path}`,
        await evaluate(
           `/Không tìm thấy|Không xác định được/.test(document.querySelector('main h1').textContent) && !!document.querySelector('main a[href="/search"]')`,
        ),
      )
    }
    await go("/dish/11")
    check(
      "unlinked legacy dish explains unavailable relationship instead of guessing owner",
      await evaluate(
        `document.querySelector('main h1').textContent==='Không xác định được món tại quán' && !!document.querySelector('main a[href="/search"]') && !document.querySelector('main button[aria-pressed]')`,
      ),
    )
    await go("/restaurant/5/dish/d1")
    check(
      "scoped menu resolves correct owner and dish",
      await evaluate(
        `document.querySelector('main h1').textContent==='Hủ Tiếu Nam Vang'&&document.querySelector('main').innerText.includes('Hủ Tiếu Bé Bơ')`,
      ),
    )
    await go("/settings/theme")
    await evaluate(`document.querySelector('input[value=light]').click()`)
    await delay(100)
    check(
      "theme radio applies light",
      await evaluate(`!document.documentElement.classList.contains('dark')`),
    )
    await evaluate(`document.querySelector('input[value=dark]').click()`)
    await delay(100)
    check(
      "theme radio applies dark and brand stays red",
      await evaluate(
        `document.documentElement.classList.contains('dark')&&getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()==='#DC2626'`,
      ),
    )
    await evaluate(`document.querySelector('input[value=system]').click()`)
    await go("/random")
    await evaluate(
      `([...document.querySelectorAll('main button')].find(e=>e.textContent.startsWith('Chọn ngẫu nhiên'))).click()`,
    )
    await delay(100)
    check(
      "random result has a real detail destination",
      await evaluate(
        `!!document.querySelector('main .discovery-card[href^="/restaurant/"][href*="/dish/"]') && !document.querySelector('main .discovery-card[href^="/dish/"]')`,
      ),
    )
    await go("/favorites")
    check(
      "unlinked bare-ID favorites are hidden and excluded from counts",
      await evaluate(`document.querySelector('[role=tab][data-state=active]').textContent==='Món ăn (0)' && document.querySelectorAll('main .discovery-card').length===0 && document.querySelector('.content-state').innerText.includes('Chưa có mục lưu')`),
    )
    await go("/restaurant/5/dish/d1")
    await evaluate(`document.querySelector('main button[aria-pressed]').click()`)
    await delay(100)
    await evaluate(`document.querySelector('.desktop-navigation a[href="/favorites"]').click()`)
    await delay(200)
    check(
      "saved scoped dish retains owner, price and unique favorite identity",
      await evaluate(`document.querySelectorAll('main .discovery-card').length===1 && document.querySelector('main .discovery-card').getAttribute('href')==='/restaurant/5/dish/d1' && document.querySelector('main .discovery-card').innerText.includes('Hủ Tiếu Bé Bơ')`),
    )
    await evaluate(`document.querySelector('.desktop-navigation a[href="/random"]').click()`)
    await delay(150)
    await evaluate(`[...document.querySelectorAll('input[name="random-mode"]')][1].click()`)
    await delay(100)
    check(
      "random saved pool starts empty until a scoped favorite is selected",
      await evaluate(`document.querySelectorAll('main input[type=checkbox]').length===1 && [...document.querySelectorAll('main button')].find(e=>e.textContent.startsWith('Chọn ngẫu nhiên')).disabled && document.querySelector('main input[type=checkbox]').closest('label').innerText.includes('Hủ Tiếu Bé Bơ')`),
    )
    await evaluate(`document.querySelector('main input[type=checkbox]').click()`)
    await delay(100)
    await evaluate(`[...document.querySelectorAll('main button')].find(e=>e.textContent.startsWith('Chọn ngẫu nhiên')).click()`)
    await delay(100)
    check(
      "random from selected favorites preserves exact restaurant-dish destination",
      await evaluate(`document.querySelector('main .discovery-card').getAttribute('href')==='/restaurant/5/dish/d1'`),
    )
    await evaluate(`document.querySelector('.desktop-navigation a[href="/favorites"]').click()`)
    await delay(150)
    await evaluate(
      `([...document.querySelectorAll('main button')].find(e=>e.textContent==='Chỉnh sửa danh sách')).click()`,
    )
    await delay(100)
    await evaluate(
      `([...document.querySelectorAll('main button')].find(e=>e.textContent==='Chọn tất cả')).click()`,
    )
    await delay(100)
    check(
      "favorite bulk selection uses current kind",
      await evaluate(
        `[...document.querySelectorAll('main button')].some(e=>e.textContent==='Xóa 1 mục đã chọn'&&!e.disabled)`,
      ),
    )
    await evaluate(
      `document.querySelector('[role=tab][data-state=inactive]').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))`,
    )
    await delay(100)
    check(
      "switching favorite kind clears edit and selection",
      await evaluate(
        `![...document.querySelectorAll('main button')].some(e=>e.textContent.startsWith('Xóa '))&&document.querySelectorAll('main .discovery-card').length===7`,
      ),
    )
    await evaluate(`document.querySelector('main .discovery-card').click()`)
    await delay(200)
    await evaluate(
      `document.querySelector('button[aria-label="Bỏ lưu quán"]').click()`,
    )
    await delay(100)
    await evaluate(
      `document.querySelector('main a[aria-label="Quay lại danh sách trước"]').click()`,
    )
    await delay(200)
    await evaluate(
      `document.querySelector('[role=tab][data-state=inactive]').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))`,
    )
    await delay(100)
    check(
      "detail favorite change survives navigation in same session",
      await evaluate(
        `document.querySelectorAll('main .discovery-card').length===6`,
      ),
    )
    await evaluate(`document.querySelector('[role=tab][data-state=inactive]').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,button:0}))`)
    await delay(100)
    await evaluate(`[...document.querySelectorAll('main button')].find(e=>e.textContent.startsWith('Bỏ lưu Hủ Tiếu Nam Vang')).click()`)
    await delay(100)
    check(
      "scoped favorite removal requires confirmation",
      await evaluate(`!!document.querySelector('[role=alertdialog]') && document.querySelectorAll('main .discovery-card').length===1`),
    )
    await evaluate(`[...document.querySelectorAll('[role=alertdialog] button')].find(e=>e.textContent==='Bỏ lưu').click()`)
    await delay(150)
    check(
      "confirmed scoped favorite removal updates cards and count",
      await evaluate(`document.querySelectorAll('main .discovery-card').length===0 && document.querySelector('[role=tab][data-state=active]').textContent==='Món ăn (0)'`),
    )
    for (const path of ["/login", "/register", "/settings/support"]) {
      await go(path)
      check(
        `missing service honestly unavailable: ${path}`,
        await evaluate(
          `document.querySelector('main').innerText.toLowerCase().includes('chưa')&&[...document.querySelectorAll('main button')].some(e=>e.disabled)`,
        ),
      )
    }
    await go("/")
    await evaluate(`document.activeElement.blur();document.body.focus()`)
    await send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Tab",
      code: "Tab",
      windowsVirtualKeyCode: 9,
    })
    await send("Input.dispatchKeyEvent", {
      type: "keyUp",
      key: "Tab",
      code: "Tab",
      windowsVirtualKeyCode: 9,
    })
    check(
      "keyboard first stop is skip link",
      await evaluate(`document.activeElement.classList.contains('skip-link')`),
    )
    for (const path of [
      "/",
      "/search",
      "/settings",
      "/register",
      "/restaurant/1",
    ]) {
      await go(path, 390)
      await evaluate(`document.documentElement.style.fontSize='32px'`)
      await delay(100)
      check(
        `desktop content remains reachable with 200% text at 390px: ${path}`,
        await evaluate(`(() => {
          const controls = [...document.querySelectorAll('main a[href],main button:not(:disabled),main input:not(:disabled),main select,main textarea')].filter(e=>e.getClientRects().length);
          return controls.every(e=>{ e.focus(); e.scrollIntoView({block:'nearest',inline:'nearest'}); const r=e.getBoundingClientRect(); return document.activeElement===e && r.right>0 && r.left<innerWidth && r.bottom>0 && r.top<innerHeight; }) && !document.querySelector('.mobile-nav') && getComputedStyle(document.querySelector('.desktop-navigation')).display==='flex';
        })()`),
      )
      await evaluate(`document.documentElement.style.fontSize=''`)
    }
  }
  writeFileSync(
    join(output, smoke ? "smoke.json" : "matrix.json"),
    JSON.stringify({ results, failures, interactions }, null, 2),
  )
  console.log(
    JSON.stringify(
      {
        checks: results.length,
        failures: failures.length,
        interactions,
        evidence: output,
        examples: failures.slice(0, 5),
      },
      null,
      2,
    ),
  )
  if (process.argv.includes("--strict"))
    assert.equal(
      failures.length,
      0,
      "Browser layout/name failures; see matrix evidence",
    )
} catch (error) {
  writeFileSync(
    join(output, "interrupted.json"),
    JSON.stringify(
      { currentCheck, error: error.message, results, failures },
      null,
      2,
    ),
  )
  console.error(
    `Browser check interrupted at ${currentCheck}: ${error.message}`,
  )
  throw error
} finally {
  try {
    if (socket?.readyState === WebSocket.OPEN) await send("Browser.close")
  } catch {}
  socket?.close()
  // Only the isolated browser process launched by this script is terminated.
  if (child.exitCode === null) child.kill()
}
