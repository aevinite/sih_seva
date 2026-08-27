const { chromium, devices } = require('playwright');
const base = 'https://aeviwork-next.vercel.app';
const routes = ['/login/','/','/services/','/booking/','/register/','/dashboard-customer/','/dashboard-worker/','/dashboard-admin/','/aevinite/'];
const SP = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  await ctx.addInitScript(() => { try { localStorage.setItem('aw-session', JSON.stringify({email:'admin@aeviwork.in',role:'federation',name:'Dinesh Kapoor'})); } catch(e){} });
  for (const r of routes) {
    const page = await ctx.newPage();
    try {
      await page.goto(base+r, { waitUntil:'networkidle', timeout:60000 });
      await page.waitForTimeout(1000);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;
        const isContained = (el) => {
          let p = el.parentElement;
          while (p) { const ox = getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true; p = p.parentElement; }
          return false;
        };
        const off = [];
        document.querySelectorAll('body *').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          if ((rect.right > vw + 1 || rect.left < -1) && !isContained(el)) {
            const cls = (typeof el.className === 'string' && el.className.trim()) ? '.'+el.className.trim().split(/\s+/).slice(0,3).join('.') : '';
            off.push(el.tagName.toLowerCase()+cls);
          }
        });
        return { vw, scrollW, pageOverflow: scrollW > vw+1, offenders:[...new Set(off)].slice(0,18) };
      });
      console.log(`\n=== ${r}  vw=${info.vw} scrollW=${info.scrollW} ${info.pageOverflow?'*** PAGE OVERFLOW ***':'ok'}`);
      info.offenders.forEach(o => console.log('    ', o));
      await page.screenshot({ path: `${SP}/shot${r.replace(/\//g,'_')||'_home'}.png`, fullPage:false });
    } catch(e){ console.log(`ERR ${r}: ${e.message.slice(0,80)}`); }
    await page.close();
  }
  await browser.close();
})();
