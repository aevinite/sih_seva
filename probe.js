const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{width:360,height:800}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  await ctx.addInitScript(() => { try { localStorage.setItem('aw-session', JSON.stringify({email:'aarav@aeviwork.in',role:'customer',name:'Aarav Nair'})); } catch(e){} });
  const page = await ctx.newPage();
  await page.goto('https://aeviwork-next.vercel.app/dashboard-customer/', { waitUntil:'networkidle', timeout:60000 });
  await page.waitForTimeout(1000);
  const out = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const rows = [];
    document.querySelectorAll('body *').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width===0) return;
      if (rect.right > vw+1) {
        let oxAncestor=false,p=el.parentElement;
        while(p){const ox=getComputedStyle(p).overflowX; if(ox==='auto'||ox==='scroll'){oxAncestor=true;break;} p=p.parentElement;}
        const cls=(typeof el.className==='string')?el.className.trim().split(/\s+/).slice(0,4).join('.'):'';
        rows.push({t:el.tagName.toLowerCase(),c:cls,w:Math.round(rect.width),r:Math.round(rect.right),scroll:oxAncestor});
      }
    });
    // only the ones NOT inside a scroll container = real page overflow
    return { vw, real: rows.filter(r=>!r.scroll).slice(0,20), anyScrollWrapped: rows.filter(r=>r.scroll).length };
  });
  console.log('vw', out.vw, 'scroll-wrapped offenders:', out.anyScrollWrapped);
  console.log('REAL offenders (cause page overflow):');
  out.real.forEach(r=>console.log(`  w=${r.w} right=${r.r}  ${r.t}.${r.c}`));
  await browser.close();
})();
