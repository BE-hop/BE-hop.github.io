import {test, expect} from '@playwright/test';

for (const suffix of ['', '-en']) {
  const current = `/2026/10/16/when-ai-gains-a-body${suffix}/`;
  for (const alias of [`/2026/09/03/when-ai-gets-a-body-maslow${suffix}/`, `/2026/10/15/when-ai-gains-a-body${suffix}/`]) {
    test(`article alias ${alias} opens the matching canonical language`, async ({page,request}) => {
      const response = await request.get(alias);
      expect(response.ok()).toBeTruthy();
      const html = await response.text();
      expect(html).toContain(`rel="canonical" href="https://www.behop.cn${current}"`);
      expect(html).toContain(`href="${current}"`);
      await page.goto(alias);
      await expect(page).toHaveURL(new RegExp(current+'$'));
      await expect(page.locator('h1').first()).toContainText(suffix ? 'When AI Gains a Body' : '当 AI 获得身体');
      const other = `/2026/10/16/when-ai-gains-a-body${suffix ? '' : '-en'}/`;
      await expect(page.locator(`.post-container a[href="${other}"]`).first()).toBeVisible();
      await expect(page.locator('.post-container figure img').first()).toBeVisible();
    });
  }
}
