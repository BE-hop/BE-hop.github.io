import {test,expect} from '@playwright/test';
const routes=['/','/behop-ai-product/','/works/','/blog/en/','/forum/','/about/'];
for(const [width,height] of [[390,844],[768,900],[1440,900],[2560,1440]]) test(`compact hero boundaries stay aligned across pages and languages at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height});
  let boundary;
  for(const route of routes){
    await page.goto(route);
    let homeRule;
    let alignment;
    for(const lang of ['zh','en']){
      await page.locator(`[data-lang="${lang}"]`).first().click();
      await expect(page.locator('html')).toHaveAttribute('lang',lang);
      await page.evaluate(()=>document.fonts.ready);
      const hero=page.locator('.landing-hero');
      await expect(hero).toHaveCount(1);
      const box=await hero.boundingBox();
      expect(Math.abs(box.y)).toBeLessThan(1);
      if(route==='/') expect(Math.abs(box.height-height)).toBeLessThan(1);
      else {
        boundary ??= box.height;
        expect(Math.abs(box.height-boundary),route+' '+lang).toBeLessThan(1);
        expect(box.height).toBeLessThan(height*.7);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
      if(lang==='zh') {
        const current = await hero.locator('h1').evaluate(el=>getComputedStyle(el).textAlign);
        if(route.startsWith('/blog')) expect(current).toBe('center');
        else expect(current).toMatch(/^(start|left)$/);
        await expect(hero.locator('h1')).toHaveCSS('font-family',/PingFang SC/);
        expect(await hero.locator('h1').innerText()).not.toMatch(/[。，！？；：]/);
      }
      const currentAlignment = await hero.locator('h1').evaluate(el=>getComputedStyle(el).textAlign);
      alignment ??= currentAlignment;
      expect(currentAlignment).toBe(alignment);
      const content=await hero.locator('h1, .hero-actions, .editorial-links, .tool-hero-mosaic').all();
      for(const element of content){
        const rect=await element.boundingBox();
        if(!rect) continue;
        expect(rect.y,route+' '+lang+' content above nav').toBeGreaterThanOrEqual(72);
        expect(rect.y+rect.height,route+' '+lang+' clipped content').toBeLessThanOrEqual(box.height);
      }
      if(route==='/'){
        const rule=await hero.locator('.hero-editorial-note').boundingBox();
        homeRule ??= rule.y;
        expect(Math.abs(homeRule-rule.y)).toBeLessThan(1);
        const actions=await hero.locator('.hero-actions').boundingBox();
        expect(actions.y+actions.height).toBeLessThanOrEqual(rule.y);
      }
      if(route==='/forum/'){
        await expect(page.locator('.site-nav')).toHaveCSS('background-color','rgba(0, 0, 0, 0)');
        await expect(page.locator('.site-nav')).toHaveCSS('box-shadow','none');
      }
    }
  }
});
