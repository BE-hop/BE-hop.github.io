import { test, expect } from '@playwright/test';
const routes = ['/', '/works/', '/works/portfolio/', '/behop-ai-product/', '/projects/shilih-lake/', '/behop-ai-product/products/spatial-prompt-lab/', '/blog/en/', '/forum/', '/works/category/landscape/', '/behop-ai-product/category/design-tools/', '/about/', '/works/archive/', '/behop-ai-product/gallery/architectural-visualization/', '/2026/10/16/when-ai-gains-a-body-en/', '/forum/topic/openclaw-tip/'];

for (const width of [390, 768, 1440]) {
  test(`public navigation and layout at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:900});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),route).toBeTruthy();
    }
    expect(errors).toEqual([]);
  });
}

test('rapid reader navigation does not request high resolution or drop input', async ({page}) => {
  const requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/works/portfolio/');
  await page.locator('[data-book-select="planning"]').click();
  await page.evaluate(()=>{
    window.readerFeedback=[];
    document.querySelector('[data-reader-next]').addEventListener('click',()=>{
      const start=performance.now();
      requestAnimationFrame(()=>window.readerFeedback.push(performance.now()-start));
    });
  });
  for (let index=0; index<5; index++) await page.locator('[data-reader-next]').click();
  await expect(page.locator('[data-reader-counter]')).toHaveText('06 / 09');
  await expect.poll(()=>page.evaluate(()=>window.readerFeedback.length)).toBe(5);
  expect(await page.evaluate(()=>Math.max(...window.readerFeedback))).toBeLessThan(200);
  await page.locator('[data-book-select="landscape"]').click();
  await expect(page.locator('[data-reader-counter]')).toHaveText('01 / 17');
  expect(requests.filter(url=>/-(1920|2560)\.webp/.test(url))).toEqual([]);
  const detailURL = await page.locator('[data-reader-full]').getAttribute('href');
  await page.locator('[data-reader-full]').click();
  await expect(page.locator('dialog')).toBeVisible();
  await expect.poll(()=>requests.some(url=>url.endsWith(detailURL))).toBeTruthy();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).not.toBeVisible();
});

test('detail failure keeps a preview and navigation usable', async ({page}) => {
  await page.goto('/projects/shilih-lake/');
  const link = page.locator('a[data-media-view]').first();
  const detailURL = await link.getAttribute('href');
  await page.route('**'+detailURL,route=>route.abort('failed'));
  await link.click();
  await expect(page.locator('dialog')).toBeVisible();
  await expect(page.locator('dialog [role="status"]')).toContainText(/could not|未加载/);
  await expect(page.locator('dialog img')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('h1')).toBeVisible();
});

test('static content and reader entry survive disabled JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4017/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByRole('link',{name:'Explore AI Tools',exact:true}).first()).toBeVisible();
  await page.goto('http://127.0.0.1:4017/works/portfolio/');
  await expect(page.locator('[data-reader-current]')).toBeVisible();
  await expect(page.getByRole('link',{name:'Planning / 规划',exact:true})).toBeVisible();
  await context.close();
});

test('mobile language controls and images preserve their source binding', async ({page}) => {
  await page.goto('/');
  await page.locator('[data-lang="zh"]').first().click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh');
  await expect(page.locator('img[data-original-src]').first()).toHaveAttribute('data-original-src',/img\//);
  await page.goto('/works/portfolio/');
  await expect(page.locator('[data-reader-title]')).toHaveText('规划');
});

for (const version of ['n1','n2','n3']) test(`previous ${version} cache survives retirement without forced reload`,async({page})=>{
  await page.goto('/');
  // Wait for the new-page idle retirement attempt before installing the fixture.
  await page.waitForTimeout(200);
  await page.evaluate(async version=>{
    await navigator.serviceWorker.register('/sw.js?legacy='+version);
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
    localStorage.setItem('portfolioLang','en');
  },version);
  await page.goto('/legacy-proof/');
  await expect(page.locator('h1')).toHaveText('Previous release');
  expect(await page.evaluate(()=>window.previousAssetLoaded)).toBeTruthy();
  let navigations=0;
  page.on('framenavigated',frame=>{if(frame===page.mainFrame())navigations++;});
  await page.goto('/');
  await expect.poll(()=>page.evaluate(async()=>(await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  expect(navigations).toBe(1);
  expect(await page.evaluate(()=>localStorage.getItem('portfolioLang'))).toBe('en');
  expect(await page.evaluate(()=>caches.keys())).toContain('behop-shell-'+version);
});

test('cross-page visits reuse the common HTTP-cached stylesheet',async({page})=>{
  await page.goto('/');
  const shared=await page.locator('link[rel="stylesheet"]').first().getAttribute('href');
  await page.goto('/works/');
  const resource=await page.evaluate(url=>performance.getEntriesByType('resource').find(entry=>entry.name.endsWith(url)),shared);
  expect(resource).toBeTruthy();
  expect(resource.transferSize).toBe(0);
  await expect(page.locator('h1')).toBeVisible();
});

test('heading and native navigation stay usable while enhancement scripts wait',async({page})=>{
  let released=false;
  await page.route('**/assets/bundles/*.js',async route=>{
    await new Promise(resolve=>setTimeout(resolve,2500));
    released=true;
    await route.continue().catch(()=>{});
  });
  await page.goto('/',{waitUntil:'commit'});
  await expect(page.locator('h1')).toBeVisible();
  expect(released).toBe(false);
  await page.getByRole('link',{name:'View Works',exact:true}).first().click();
  await expect(page).toHaveURL(/\/works\/$/);
  await expect(page.locator('h1')).toBeVisible();
});
