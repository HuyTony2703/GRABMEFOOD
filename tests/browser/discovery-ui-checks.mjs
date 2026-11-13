// Feature-specific checks run in the existing installed-browser CDP harness.
export async function checkDiscoveryUI({ send, evaluate, go, check, capture }) {
  const settle = () =>
    evaluate(
      `new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`,
    )
  const key = async (key, code, value) => {
    for (const type of ["keyDown", "keyUp"]) {
      await send("Input.dispatchKeyEvent", {
        type,
        key,
        code,
        windowsVirtualKeyCode: value,
        // Chrome dispatches a button's Enter activation through keypress.
        text:
          type === "keyDown"
            ? key === "Enter"
              ? "\r"
              : key === " "
                ? " "
                : undefined
            : undefined,
      })
    }
  }
  for (const theme of ["light", "dark"]) {
    await send("Emulation.setEmulatedMedia", {
      features: [
        { name: "prefers-color-scheme", value: theme },
        { name: "prefers-reduced-motion", value: "reduce" },
      ],
    })
    for (const width of [320, 390, 768, 1024, 1440]) {
      await go("/")
      await send("Emulation.setDeviceMetricsOverride", {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      })
      for (const zoom of [100, 200]) {
        await evaluate(
          `document.documentElement.style.fontSize='${
            zoom === 200 ? 32 : 16
          }px'`,
        )
        await settle()
        check(
          `desktop shell and horizontal access ${width}px ${theme} text ${zoom}%`,
          await evaluate(`(() => {
          const header = document.querySelector('header');
          const account = document.querySelector('.account-entry');
          const shell = document.querySelector('.app-frame');
          const nav = document.querySelector('.desktop-navigation');
          account.focus(); account.scrollIntoView({block:'nearest',inline:'nearest'});
          const r = account.getBoundingClientRect();
          return parseFloat(getComputedStyle(shell).minWidth) >= 1024 &&
            getComputedStyle(nav).display === 'flex' && !document.querySelector('.mobile-nav') &&
            document.documentElement.scrollWidth >= shell.getBoundingClientRect().width - 1 &&
            account.getClientRects().length > 0 && r.left < innerWidth && r.right > 0 &&
            [...header.querySelectorAll('input,button,a,.header-area')].every(e => e.getClientRects().length > 0);
        })()`),
        )
      }
    }
  }

  await go("/")
  check(
    "guest account entry opens illustrative profile with honest status",
    await evaluate(`(() => {
    const entry = document.querySelector('.account-entry');
    return entry.getAttribute('href') === '/profile' && entry.innerText.includes('Chưa xác thực') && entry.getAttribute('aria-label').includes('hồ sơ minh họa');
  })()`),
  )
  await evaluate(`document.querySelector('.account-entry').focus()`)
  await key("Enter", "Enter", 13)
  await settle()
  check(
    "account keyboard navigation reaches /profile",
    await evaluate(
      `location.pathname === '/profile' && document.querySelector('main').innerText.includes('Chưa có tài khoản được xác thực')`,
    ),
  )

  await go("/")
  check(
    "three menu dishes have unique scoped destinations and real owners",
    await evaluate(`(() => {
    const cards = [...document.querySelectorAll('[aria-labelledby="menu-dishes-heading"] .discovery-card')];
    return cards.length === 3 && new Set(cards.map(e => e.getAttribute('href'))).size === 3 &&
      cards[0].getAttribute('href') === '/restaurant/5/dish/d1' &&
      cards.every(e => e.innerText.includes('Hủ Tiếu Bé Bơ')) && cards[0].innerText.includes('45.000');
  })()`),
  )
  await evaluate(
    `document.querySelector('[aria-labelledby="menu-dishes-heading"] .discovery-card').click()`,
  )
  await settle()
  check(
    "new menu card resolves matching detail",
    await evaluate(
      `location.pathname === '/restaurant/5/dish/d1' && document.querySelector('main h1').textContent === 'Hủ Tiếu Nam Vang'`,
    ),
  )

  await go("/")
  check(
    "back-to-top initially hidden",
    await evaluate(`document.querySelector('.back-to-top').hidden`),
  )
  await evaluate(`window.scrollTo(0, 400)`)
  await settle()
  check(
    "back-to-top hidden at threshold",
    await evaluate(`document.querySelector('.back-to-top').hidden`),
  )
  await evaluate(`window.scrollTo(0, 600)`)
  await settle()
  check(
    "back-to-top shown above threshold in reserved desktop gutter",
    await evaluate(`(() => {
    const b = document.querySelector('.back-to-top'); const r = b.getBoundingClientRect();
    const main = document.querySelector('main'); const m = main.getBoundingClientRect();
    const contentRight = m.right - parseFloat(getComputedStyle(main).paddingRight);
     return !b.hidden && r.width >= 44 && r.height >= 44 && r.left >= contentRight + 15 && r.bottom <= innerHeight - 15 && !document.querySelector('.mobile-nav');
  })()`),
  )
  for (const [name, code, value] of [
    ["Enter", "Enter", 13],
    [" ", "Space", 32],
  ]) {
    await evaluate(`window.scrollTo(0, 600)`)
    await settle()
    await evaluate(`document.querySelector('.back-to-top').focus()`)
    await key(name, code, value)
    await settle()
    check(
      `back-to-top ${code} restores visible main focus without motion`,
      await evaluate(
        `scrollY === 0 && document.activeElement.id === 'main-content' && document.querySelector('.back-to-top').hidden`,
      ),
    )
  }
  await evaluate(`window.scrollTo(0, document.documentElement.scrollHeight)`)
  await settle()
  check(
    "footer is not covered by back-to-top and has no bottom navigation",
    await evaluate(`(() => {
     const footer = document.querySelector('footer');
     return document.querySelector('.back-to-top').hidden && !document.querySelector('.mobile-nav') && footer.querySelector('.footer-copyright').getBoundingClientRect().bottom <= innerHeight + 1;
  })()`),
  )
  check(
    "footer has only existing links and explicit missing information",
    await evaluate(`(() => {
    const footer = document.querySelector('footer');
    return footer.querySelectorAll('section').length === 6 && footer.innerText.includes('Email — Cần bổ sung') &&
      [...footer.querySelectorAll('a')].every(e => ['/settings/guide','/settings/support','/settings/terms'].includes(e.getAttribute('href')));
  })()`),
  )
   await capture("footer-desktop-dark")
  await evaluate(`window.scrollTo(0,600)`)
  await settle()
  const buttonCenter = await evaluate(
    `(() => { const r = document.querySelector('.back-to-top').getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`,
  )
  for (const type of ["mousePressed", "mouseReleased"]) {
    await send("Input.dispatchMouseEvent", {
      type,
      ...buttonCenter,
      button: "left",
      clickCount: 1,
    })
  }
  await settle()
  check(
    "back-to-top mouse click restores main focus",
    await evaluate(
      `scrollY === 0 && document.activeElement.id === 'main-content'`,
    ),
  )
  for (const path of [
    "/settings/guide",
    "/settings/support",
    "/settings/terms",
  ]) {
    await go("/")
    await evaluate(`document.querySelector('footer a[href="${path}"]').click()`)
    await settle()
    check(
      `footer link navigates ${path}`,
      await evaluate(
        `location.pathname === '${path}' && !!document.querySelector('main h1')`,
      ),
    )
  }

  await go("/")
  await evaluate(
    `window.scrollTo(0,600); [...document.querySelectorAll('main button')].find(e => e.textContent.includes('Bộ lọc')).click()`,
  )
  await settle()
  check(
    "back-to-top hidden while filter dialog is open",
    await evaluate(
      `!!document.querySelector('[role=dialog]') && document.querySelector('.back-to-top').hidden`,
    ),
  )
  await key("Escape", "Escape", 27)
  await settle()

  await go("/")
  await evaluate(
    `document.querySelector('.discovery-card img')?.dispatchEvent(new Event('error'))`,
  )
  await settle()
  check(
    "failed image keeps named 4:3 fallback",
    await evaluate(`(() => {
    const fallback = document.querySelector('.discovery-card .image-unavailable');
    return fallback?.getAttribute('aria-label').includes('Chưa có ảnh:') && getComputedStyle(fallback).aspectRatio === '4 / 3';
  })()`),
  )
  await evaluate(
    `document.querySelector('.discovery-card h3').textContent='Tên món rất dài có dấu tiếng Việt '.repeat(20); document.querySelector('footer p').textContent='Thông tin liên hệ rất dài '.repeat(30)`,
  )
  await settle()
  check(
    "long Vietnamese copy does not cause horizontal overflow",
    await evaluate(`document.documentElement.scrollWidth <= innerWidth + 1`),
  )
  await evaluate(`document.querySelector('.account-entry').focus()`)
  await key("Tab", "Tab", 9)
  check(
    "keyboard focus has a visible outline",
    await evaluate(
      `document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle !== 'none' && parseFloat(getComputedStyle(document.activeElement).outlineWidth) >= 2`,
    ),
  )

  for (const path of [
    "/login",
    "/register",
    "/welcome",
    "/onboarding",
    "/not-a-route",
  ]) {
    await go(path)
    check(
      `no discovery tools on excluded page ${path}`,
      await evaluate(
        `!document.querySelector('.site-footer,.back-to-top,.account-entry')`,
      ),
    )
  }

  await go("/all-restaurants?section=today")
  check(
    "today listing preserves URL but excludes unlinked dishes with recovery",
    await evaluate(`document.querySelectorAll('main .discovery-card').length===0 && document.querySelector('main').innerText.includes('0 kết quả') && !!document.querySelector('.content-state a[href="/search"]')`),
  )
  await go("/", 390)
  check(
    "unlinked today section is hidden without replacing source data",
    await evaluate(`![...document.querySelectorAll('main h2')].some(e=>e.textContent==='Món ngon hôm nay') && !document.querySelector('main a[href^="/dish/"]')`),
  )
  await evaluate(`document.querySelector('.account-entry').focus()`)
  await settle()
  check(
    "focus scrolls desktop account into narrow viewport instead of hiding access",
    await evaluate(`(() => { const e=document.querySelector('.account-entry'); const r=e.getBoundingClientRect(); return document.activeElement===e && r.left<innerWidth && r.right>0 && scrollX>0; })()`),
  )
  await capture("desktop-narrow-account-focus")
  await evaluate(`document.documentElement.style.fontSize='32px'; [...document.querySelectorAll('main button')].find(e=>e.textContent.trim()==='Bộ lọc').click()`)
  await settle()
  check(
    "narrow zoomed filter dialog keeps actions and close control within viewport",
    await evaluate(`(() => {
      const dialog=document.querySelector('[role=dialog]');
      const r=dialog.getBoundingClientRect();
      return r.left>=0 && r.right<=innerWidth+1 && r.top>=0 && r.bottom<=innerHeight+1 &&
        [...dialog.querySelectorAll('button')].every(e=>{const b=e.getBoundingClientRect(); return b.left>=0 && b.right<=innerWidth+1 && b.top>=0 && b.bottom<=innerHeight+1;});
    })()`),
  )
  await key("Escape", "Escape", 27)
  await settle()
  const restored = await evaluate(`(() => {
    const e=document.activeElement; const r=e.getBoundingClientRect();
    return {dialog:document.querySelector('[role=dialog]')?.getAttribute('data-state') ?? null, active:e.outerHTML.slice(0,400), text:e.textContent.trim().slice(0,60), left:r.left, right:r.right, width:innerWidth};
  })()`)
  if (restored.dialog !== null || restored.text !== "Bộ lọc" || restored.right <= 0 || restored.left >= restored.width)
    console.error("Narrow dialog focus diagnostic:", restored)
  check(
    "narrow dialog Escape restores visible desktop trigger",
    restored.dialog === null && restored.text === "Bộ lọc" && restored.right > 0 && restored.left < restored.width,
  )
}
