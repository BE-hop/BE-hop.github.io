import {test, expect} from '@playwright/test';

const routes = ['/', '/works/', '/behop-ai-product/', '/blog/en/', '/about/', '/forum/'];
for (const lang of ['zh', 'en']) test(`shared contact and blog labels in ${lang}`, async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.addInitScript(lang => {
    for (const key of ['portfolioLang','blogLang','behopAiLang']) localStorage.setItem(key,lang);
  },lang);
  const qrRequests=[];
  page.on('request',request=>{if(request.url().includes('/img/contact/')) qrRequests.push(request.url());});
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang',lang);
    await expect(page.locator('.site-nav__links [data-i18n="nav.blog"]')).toHaveText(lang==='zh'?'博客':'Blog');
    const trigger=page.locator('[data-contact-desktop]');
    await expect(trigger).toHaveText(lang==='zh'?'联系我':'Contact');
    await expect(page.locator('.site-nav__lang [data-lang="zh"]')).toHaveText('中文');
    const count=qrRequests.length;
    await expect(page.locator('#site-contact img')).not.toHaveAttribute('src');
    await trigger.click();
    await expect(page.locator('#site-contact')).toBeVisible();
    await expect(page.locator('#site-contact img')).toHaveAttribute('src',/wechat.jpg$/);
    await expect.poll(()=>page.locator('#site-contact img').evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
    expect(qrRequests.length).toBeGreaterThan(count);
    await expect(page.locator('#site-contact')).toContainText('Behooooop');
    await page.locator('[data-contact-tab="email"]').click();
    await expect(page.locator('#contact-panel-email')).toContainText('liuruyuan73@gmail.com');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test('contact on mobile: lazy QR failure, copy feedback, language and focus',async({page,context})=>{
  const qrRequests=[];
  page.on('request',request=>{if(request.url().includes('/img/contact/')) qrRequests.push(request.url());});
  await page.route('**/img/contact/wechat.jpg',route=>route.abort());
  await page.goto('/');
  expect(qrRequests).toEqual([]);
  await page.locator('[data-lang="zh"]').first().click();
  await page.locator('[data-site-nav-toggle]').click();
  await page.locator('.site-nav__mobile [data-contact-open]').click();
  const dialog=page.locator('#site-contact');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-contact-error]')).toBeVisible();
  await expect(dialog.locator('[data-contact-close]')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('[data-contact-copy="Behooooop"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.locator('[data-contact-close]')).toBeFocused();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await dialog.locator('[data-contact-copy="Behooooop"]').click();
  await expect(dialog.locator('.site-contact__status')).toHaveText('已复制');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('Behooooop');
  await dialog.locator('[data-contact-tab="email"]').click();
  await dialog.locator('[data-contact-copy*="gmail"]').click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('liuruyuan73@gmail.com');
  await dialog.locator('[data-contact-tab="qr"]').click();
  await page.evaluate(()=>{Object.defineProperty(navigator.clipboard,'writeText',{configurable:true,value:()=>Promise.reject(new Error('Denied'))});});
  await dialog.locator('[data-contact-copy="Behooooop"]').click();
  await expect(dialog.locator('.site-contact__status')).toContainText('复制失败');
  await page.evaluate(()=>document.documentElement.lang='en');
  await expect(dialog.locator('h2')).toHaveText('Contact');
  await dialog.locator('[data-contact-close]').click();
  await expect(page.locator('[data-site-nav-toggle]')).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/site-contact-open/);
  await page.locator('[data-site-nav-toggle]').click();
  await page.locator('.site-nav__mobile [data-contact-open]').click();
  await page.mouse.click(2,2);
  await expect(dialog).not.toBeVisible();
});

 test('contact button alignment and color survive light, dark and scrolled navigation', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  for (const route of routes) {
    await page.goto(route);
    const contact=page.locator('[data-contact-desktop]');
    const about=page.locator('.site-nav__links [data-i18n="nav.about"]');
    for (const scrolled of [false,true]) {
      await page.evaluate(scrolled=>window.scrollTo(0,scrolled?350:0),scrolled);
      await expect(page.locator('[data-site-nav]')).toHaveClass(scrolled ? /is-scrolled/ : /^(?!.*is-scrolled)/);
      const a=await about.boundingBox();
      const b=await contact.boundingBox();
      const language=await page.locator(".site-nav__lang").boundingBox();
      expect(language.x+language.width).toBeLessThan(b.x);
      expect(Math.abs(language.x-a.x-a.width-20)).toBeLessThanOrEqual(1);
      expect(Math.abs(b.x-language.x-language.width-20)).toBeLessThanOrEqual(1);
      for (const button of await page.locator(".site-nav__lang button").all()) {
        const bounds=await button.boundingBox();
        expect(Math.abs(bounds.y+bounds.height/2-b.y-b.height/2)).toBeLessThanOrEqual(1);
        await expect(button).toHaveCSS("font-family",await contact.evaluate(el=>getComputedStyle(el).fontFamily));
      }
      expect(Math.abs(a.y+a.height/2-b.y-b.height/2)).toBeLessThanOrEqual(1);
      await expect(contact).toHaveCSS('color','rgb(255, 255, 255)');
      await contact.hover();
      await expect(contact).toHaveCSS('color','rgb(255, 255, 255)');
      await page.mouse.move(0,800);
      await expect(contact).toHaveCSS('background-color','rgb(25, 59, 70)');
    }
  }
});


test('email tabs preserve drafts, support keyboard, and submit once with recoverable failure', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/blog/en/');
  await page.locator('[data-contact-desktop]').click();
  await page.locator('#contact-tab-qr').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#contact-tab-email')).toBeFocused();
  await expect(page.locator('#contact-panel-email')).toBeVisible();
  const form = page.locator('#contact-form');
  await form.locator('[name="name"]').fill('Preview Visitor');
  await form.locator('[name="email"]').fill('preview@example.com');
  await form.locator('[name="message"]').fill('Synthetic preview message; do not deliver.');
  await form.locator('[name="project_type"]').selectOption('research');
  await page.locator('#contact-tab-qr').click();
  await page.keyboard.press('End');
  await expect(page.locator('#contact-tab-email')).toHaveAttribute('aria-selected','true');
  await expect(form.locator('[name="message"]')).toHaveValue('Synthetic preview message; do not deliver.');
  await page.keyboard.press('Escape');
  await page.locator('[data-contact-desktop]').click();
  await expect(form.locator('[name="name"]')).toHaveValue('Preview Visitor');
  let requests = 0;
  await page.route('https://formsubmit.co/**', async route => {
    requests++;
    const data = route.request().postDataJSON();
    expect(data.email).toBe('preview@example.com');
    expect(data.project_type).toBe('research');
    expect(data._template).toBe('table');
    expect(data._captcha).toBe('false');
    expect(data._honey).toBe('');
    await route.fulfill({status:503,contentType:'application/json',body:'{"success":false}'});
  });
  await form.locator('[type="submit"]').click();
  await expect(page.locator('#contact-form-status')).toContainText(/Could not|未成功/);
  expect(requests).toBe(1);
  await expect(form.locator('[name="message"]')).toHaveValue('Synthetic preview message; do not deliver.');
  await page.unroute('https://formsubmit.co/**');
  let release;
  const pending = new Promise(resolve => {release=resolve});
  await page.route('https://formsubmit.co/**', async route => {
    requests++;
    await pending;
    await route.fulfill({contentType:'application/json',body:'{"success":"true"}'});
  });
  await form.locator('[type="submit"]').click();
  await expect(form.locator('[type="submit"]')).toBeDisabled();
  await form.evaluate(el => el.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  release();
  await expect(page.locator('#contact-form-status')).toContainText(/Message sent|已发送/);
  expect(requests).toBe(2);
  await expect(form.locator('[name="message"]')).toHaveValue('');
});

test('shared navigation edges and paired tool hero images align across desktop widths', async ({page}) => {
  for (const width of [768,1440,2560]) {
    await page.setViewportSize({width,height:1000});
    let edges;
    for (const route of routes) {
      await page.goto(route);
      const box=await page.locator('.site-nav__inner').boundingBox();
      if (!edges) edges=box;
      expect(Math.abs(box.x-edges.x)).toBeLessThan(1);
      expect(Math.abs(box.width-edges.width)).toBeLessThan(1);
      if(route==='/behop-ai-product/') {
        const cards=await page.locator('.tool-hero-mosaic>a').all();
        const a=await cards[0].boundingBox(), b=await cards[1].boundingBox();
        expect(Math.abs(a.y-b.y)).toBeLessThan(1);
        expect(Math.abs(a.height-b.height)).toBeLessThan(1);
        const ai=await cards[0].locator("img").boundingBox(), bi=await cards[1].locator("img").boundingBox();
        expect(Math.abs(ai.y-bi.y)).toBeLessThan(1);
        expect(Math.abs(ai.height-bi.height)).toBeLessThan(1);
      }
      if(['/works/','/behop-ai-product/','/forum/'].includes(route)) {
        await expect.poll(()=>page.locator('.catalog-hero-backdrop').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();
      }
    }
  }
});


test('legacy project scripts do not submit the shared email form twice', async ({page}) => {
  await page.setViewportSize({width:1440,height:900});
  let requests=0;
  await page.route('https://formsubmit.co/**', async route => {
    requests++;
    await route.fulfill({contentType:'application/json',body:'{"success":true}'});
  });
  await page.goto('/projects/shilih-lake/');
  await page.locator('[data-contact-desktop]').click();
  await page.locator('#contact-tab-email').click();
  const form=page.locator('#contact-form');
  await form.locator('[name="name"]').fill('Synthetic visitor');
  await form.locator('[name="email"]').fill('preview@example.com');
  await form.locator('[name="message"]').fill('Synthetic test only.');
  await form.locator('[type="submit"]').click();
  await expect(page.locator('#contact-form-status')).toContainText(/Message sent|已发送/);
  expect(requests).toBe(1);
});
