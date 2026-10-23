import {test,expect} from '@playwright/test';
const routes=['/','/behop-ai-product/','/works/','/about/','/forum/'];
for(const width of [390,768,1440,1920,2560]) test(`editorial pages fit ${width}px in both languages`,async({page})=>{
 await page.setViewportSize({width,height:width===1920?1080:900});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of routes){
  await page.goto(route);
  for(const lang of ['zh','en']){
   await page.locator('[data-lang="'+lang+'"]').first().click();
   await expect(page.locator('html')).toHaveAttribute('lang',lang);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' '+lang).toBeTruthy();
   await expect(page.locator('h1')).toBeVisible();
   if(route==='/works/'&&width>=1440){const color=await page.locator('.site-nav__links [data-i18n="nav.projects"]').evaluate(node=>getComputedStyle(node).color);expect(color).toBe('rgb(82, 98, 85)');}
   if(route==='/about/'){await expect(page.locator('[data-about-sidebar-lang="'+lang+'"]')).toBeVisible();}

   if(route==='/'&&width>=1440){const after=await page.evaluate(()=>document.documentElement.scrollHeight-document.querySelector('.editorial-home-hero').getBoundingClientRect().height);expect(after).toBeLessThanOrEqual((width===1920?1080:900)*2.2);}
  }
 }
 expect(errors).toEqual([]);
});
test('catalogs retain every public record and native category destinations',async({page})=>{
 await page.goto('/behop-ai-product/');await expect(page.locator('.catalog-card')).toHaveCount(9);
 await page.locator('[data-static-filter="Learning Research"]').click();await expect(page.locator('.catalog-card')).toHaveCount(2);await expect(page.locator('.catalog-grid')).toContainText('Paperflow');
 await page.locator('[data-static-filter="Personal Productivity"]').click();await expect(page.locator('.catalog-card')).toHaveCount(2);await expect(page.locator('.catalog-grid')).toContainText('Life-Button');
 await page.goto('/works/');await expect(page.locator('.catalog-card')).toHaveCount(7);await expect(page.locator('.portfolio-entry-book')).toHaveCount(3);
 await page.locator('.portfolio-entry-book--landscape').click();await expect(page.locator('[data-reader-counter]')).toHaveText('01 / 17');
 await page.goto('/works/portfolio/?book=unknown');await expect(page.locator('[data-reader-counter]')).toHaveText('01 / 09');
});
test('digest separates historical messages, supports intersecting filters and keeps legacy URLs',async({page})=>{
 const requests=[];page.on('request',request=>requests.push(request.url()));
 await page.goto('/forum/');await expect(page.locator('.forum-static-card')).toHaveCount(5);await expect(page.locator('[data-compose-form]')).toHaveCount(0);
 expect(requests.some(url=>/forum-(?:topics|metrics)-approved|supabase|forum-index\.js/.test(url))).toBeFalsy();
 await page.locator('[data-digest-types] a[href="/forum/type/message/"]').click();await expect(page.locator('.forum-static-card')).toHaveCount(1);await expect(page.locator('.digest-list')).toContainText('openclaw');
 await page.goto('/forum/type/research/year/2026/');await expect(page.locator('.forum-static-card')).toHaveCount(0);await expect(page.locator('.digest-list')).toContainText('No entries');
 await page.goto('/forum/?category=design-rules');await expect(page).toHaveURL(/\/forum\/theme\/design-rules\/$/);await expect(page.locator('.forum-static-card')).toHaveCount(2);
 await page.goto('/forum/?topic=when-ai-gets-a-body-maslow');await expect(page).toHaveURL(/\/forum\/topic\/when-ai-gets-a-body-maslow\/$/);await expect(page.locator('[data-topic-content]')).toContainText('Read the updated essay');await expect(page.locator('[data-topic-comment-form]')).toBeVisible();
});
test('static directory, translated texts and real detail links survive without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
 await page.goto('/');await expect(page.locator('.practice-card')).toHaveCount(6);await expect(page.locator('[data-home-digest] .reading-row')).toHaveCount(3);
 await page.goto('/behop-ai-product/category/learning-research/');await expect(page.locator('.catalog-card')).toHaveCount(2);
 await page.goto('/forum/type/observation/theme/design-rules/year/2026/');await expect(page.locator('.forum-static-card')).toHaveCount(2);
 await page.goto('/forum/topic/when-ai-gets-a-body-maslow/');await expect(page.locator('[data-topic-content] a')).toHaveAttribute('href','/2026/10/16/when-ai-gains-a-body-en/');
 await context.close();
});
test('comments stay pending, deduplicate while in flight, and preserve failed input',async({page})=>{
 let calls=0;let release;
 const barrier=new Promise(resolve=>release=resolve);let mode='pending';const payloads=[];
 await page.route('https://*.supabase.co/**',async route=>{
  if(route.request().method()==='OPTIONS'){await route.fulfill({status:204,headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*'}});return;}
  calls++;payloads.push(route.request().postDataJSON());
  if(mode==='pending')await barrier;
  if(mode==='failure'){await route.abort('failed');return;}
  await route.fulfill({status:201,headers:{'access-control-allow-origin':'*'},contentType:'application/json',body:'[]'});
 });
 await page.goto('/forum/topic/openclaw-tip/');
 await page.locator('[data-topic-comment-message]').fill('Synthetic acceptance comment');
 await page.locator('[data-topic-comment-form]').evaluate(form=>{form.requestSubmit();form.requestSubmit();});
 await expect.poll(()=>calls).toBe(1);expect(payloads[0].status).toBe('pending');expect(payloads[0].page).toContain('/forum/topic/openclaw-tip/');
 await expect(page.locator('[data-topic-comment-submit]')).toBeDisabled();release();await expect(page.locator('[data-topic-comment-feedback]')).toContainText('pending moderation');
 mode='failure';await page.locator('[data-topic-comment-message]').fill('Retryable synthetic comment');await page.locator('[data-topic-comment-submit]').click();await expect(page.locator('[data-topic-comment-feedback]')).toContainText('failed');await expect(page.locator('[data-topic-comment-message]')).toHaveValue('Retryable synthetic comment');expect(calls).toBe(2);
 mode='success';await page.locator('[data-topic-comment-submit]').click();await expect(page.locator('[data-topic-comment-feedback]')).toContainText('pending moderation');expect(calls).toBe(3);
});
