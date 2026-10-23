import {test,expect} from '@playwright/test';
const routes=['/','/works/','/behop-ai-product/','/blog/en/','/about/','/forum/','/projects/shilih-lake/'];
for(const [width,height] of [[390,568],[820,1180]]) test(`portrait menu has opaque contrast and a scrollable contact entry at ${width}px`,async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height});
  for(const route of routes){
    await page.goto(route);
    for(const lang of ['zh','en']){
      await page.locator(`[data-lang="${lang}"]`).first().click();
      if(route.startsWith('/blog')) {
        await expect(page).toHaveURL(lang==='zh'?/\/blog\/$/:/\/blog\/en\/$/);
        await page.waitForLoadState('domcontentloaded');
      }
      await expect(page.locator('html')).toHaveAttribute('lang',lang);
      for(const scrolled of [false,true]){
        await page.evaluate(v=>scrollTo(0,v?350:0),scrolled);
        const toggle=page.locator('[data-site-nav-toggle]');
        const panel=page.locator('[data-site-nav-mobile]');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded','true');
        await expect(panel).toBeVisible();
        await expect(panel).toHaveCSS('background-color','rgb(245, 243, 237)');
        await expect(panel.locator('.site-nav__mobile-link').first()).toHaveCSS('color','rgb(36, 58, 48)');
        await expect(panel.locator('.site-nav__mobile-sublink').first()).toHaveCSS('color','rgb(83, 102, 90)');
        const contact=panel.locator('[data-contact-open]');
        await contact.scrollIntoViewIfNeeded();
        await expect(contact).toHaveCSS('color','rgb(255, 255, 255)');
        const bounds=await panel.boundingBox(), entry=await contact.boundingBox();
        expect(bounds.y).toBe(72);
        expect(bounds.height).toBeLessThanOrEqual(height-72);
        expect(entry.y+entry.height).toBeLessThanOrEqual(height+1);
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded','false');
        await expect(toggle).toBeFocused();
        await expect(panel.locator('a').first()).not.toBeVisible();
      }
    }
  }
});
for(const [route,lang] of [['/archive/','zh'],['/archive/en/','en']]){
 test(`archive ${lang} renders, filters encoded tags, and supports back and reload`,async({page})=>{
  await page.goto(route);
  const root=page.locator('[data-archive-lang]');
  const items=root.locator('.js-result .item');
  const total=await items.count();expect(total).toBeGreaterThan(0);
  await expect(items.first()).toBeVisible();
  const tag=root.locator('a.tag-button').filter({hasText:'Design Thinking'}).first();
  await expect(tag).toHaveCSS('color','rgb(83, 102, 90)');
  await tag.click();
  await expect(tag).toHaveCSS('color','rgb(255, 255, 255)');
  await expect(tag).toHaveCSS('background-color','rgb(49, 93, 63)');
  expect(new URL(page.url()).searchParams.get('tag')).toBe('Design Thinking');
  const expected=await items.evaluateAll(nodes=>nodes.filter(n=>n.dataset.tags.split(',').map(v=>decodeURIComponent(v.replace(/\+/g,' '))).includes('Design Thinking')).length);
  expect(expected).toBeGreaterThan(0);
  await expect(root.locator('.js-result .item:visible')).toHaveCount(expected);
  await expect(tag).toHaveAttribute('aria-current','true');
  await page.reload();
  await expect(root.locator('.js-result .item:visible')).toHaveCount(expected);
  await root.locator('.tag-button--all').click();
  await expect(root.locator('.js-result .item:visible')).toHaveCount(total);
  await page.goBack();
  await expect(root.locator('.js-result .item:visible')).toHaveCount(expected);
  await page.goto(route+'?tag=unknown-preview-tag');
  await expect(root.locator('.js-result .item:visible')).toHaveCount(total);
  await expect(root.locator('[data-archive-status]')).toContainText(lang==='zh'?'未找到':'Unknown tag');
 });
 test(`archive ${lang} stays readable without JavaScript`,async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('http://127.0.0.1:4017'+route);
  await expect(page.locator('.js-result .item').first()).toBeVisible();
  expect(await page.locator('.js-result .item').count()).toBeGreaterThan(0);
  await context.close();
 });
}
test('archive keeps Chinese encoded tags across language editions',async({page})=>{
  await page.goto('/archive/');
  const button=page.locator('.tag-button').filter({hasText:'AI，知识库，植物设计'}).first();
  await button.click();
  const tag=new URL(page.url()).searchParams.get('tag');
  expect(tag).toBe('AI，知识库，植物设计');
  await expect(page.locator('.js-result .item:visible')).not.toHaveCount(0);
  await page.locator('[data-lang="en"]').first().click();
  await expect(page).toHaveURL(/\/archive\/en\/\?tag=/);
  expect(new URL(page.url()).searchParams.get('tag')).toBe(tag);
  await expect(page.locator('[data-archive-lang]')).toHaveAttribute('data-archive-lang','en');
  await expect(page.locator('.js-result .item:visible')).not.toHaveCount(0);
  await page.locator('[data-lang="zh"]').first().click();
  await expect(page).toHaveURL(/\/archive\/\?tag=/);
  expect(new URL(page.url()).searchParams.get('tag')).toBe(tag);
});
