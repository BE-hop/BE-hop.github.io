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
    await expect(page.locator('.site-nav__lang [data-lang="zh"]')).toHaveText(lang==='zh'?'中文':'Chinese');
    const count=qrRequests.length;
    await expect(page.locator('#site-contact img')).not.toHaveAttribute('src');
    await trigger.click();
    await expect(page.locator('#site-contact')).toBeVisible();
    await expect(page.locator('#site-contact img')).toHaveAttribute('src',/wechat.jpg$/);
    await expect.poll(()=>page.locator('#site-contact img').evaluate(img=>img.complete && img.naturalWidth>0)).toBeTruthy();
    expect(qrRequests.length).toBeGreaterThan(count);
    await expect(page.locator('#site-contact')).toContainText('Behooooop');
    await expect(page.locator('#site-contact')).toContainText('liuruyuan73@gmail.com');
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
  await expect(dialog.locator('[data-contact-copy*="gmail"]')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialog.locator('[data-contact-close]')).toBeFocused();
  expect(await dialog.evaluate(el=>el.scrollWidth<=el.clientWidth)).toBeTruthy();
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await dialog.locator('[data-contact-copy="Behooooop"]').click();
  await expect(dialog.locator('.site-contact__status')).toHaveText('已复制');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('Behooooop');
  await dialog.locator('[data-contact-copy*="gmail"]').click();
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('liuruyuan73@gmail.com');
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
