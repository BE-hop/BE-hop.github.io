import { test, expect } from '@playwright/test';
// Fixed lab conditions; this is not a geographic or real-visitor p75 measurement.
const routes=['/','/works/','/works/portfolio/','/behop-ai-product/','/projects/shilih-lake/','/blog/en/','/forum/'];
for(const route of routes) test(`mobile cold performance ${route}`,async({browser},testInfo)=>{
  test.setTimeout(90000);
  const samples=[];
  for(let index=0;index<5;index++) {
    const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
    await context.addInitScript(()=>{
      window.__siteMetrics={lcp:0,cls:0,longTasks:0};
      new PerformanceObserver(list=>{for(const item of list.getEntries())window.__siteMetrics.lcp=item.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const item of list.getEntries())if(!item.hadRecentInput)window.__siteMetrics.cls+=item.value;}).observe({type:'layout-shift',buffered:true});
      new PerformanceObserver(list=>{window.__siteMetrics.longTasks+=list.getEntries().length;}).observe({type:'longtask',buffered:true});
    });
    const page=await context.newPage();
    const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
    await page.goto((process.env.BEHOP_TEST_BASE_URL || 'http://127.0.0.1:4017')+route,{waitUntil:'load'});
    await page.waitForTimeout(1000);
    samples.push(await page.evaluate(()=>({...window.__siteMetrics,bytes:performance.getEntriesByType('resource').filter(entry=>entry.startTime<=window.__siteMetrics.lcp).reduce((sum,entry)=>sum+entry.transferSize,0)+performance.getEntriesByType('navigation')[0].transferSize})));
    await context.close();
  }
  const median=key=>samples.map(row=>row[key]).sort((a,b)=>a-b)[2];
  const result={route,network:'local, 1.6Mbps/150ms, CPU 4x, DPR2, cold context',samples,median:{lcp:median('lcp'),cls:median('cls'),bytes:median('bytes')}};
  await testInfo.attach('metrics',{body:JSON.stringify(result,null,2),contentType:'application/json'});
  console.log(JSON.stringify(result));
  if(process.env.BEHOP_BASELINE === '1') return;
  expect(median('lcp')).toBeGreaterThan(0);
  expect(median('lcp')).toBeLessThanOrEqual(2500);
  expect(median('cls')).toBeLessThanOrEqual(.1);
  expect(median('bytes')).toBeLessThanOrEqual(400*1024);
});
