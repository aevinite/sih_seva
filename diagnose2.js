const { chromium } = require('playwright');
const base = 'https://aeviwork-next.vercel.app';
const routes = ['/','/services/','/booking/','/register/','/dashboard-customer/','/dashboard-admin/','/aevinite/'];
const SP = process.argv[2];
const W = parseInt(process.argv[3]||'360',10);
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport:{width:W,height:800}, deviceScaleFactor:2, isMobile:true, hasTouch:true });
  await ctx.addInitScript(() => { try { localStorage.setItem('aw-session', JSON.stringify({email:'admin@aeviwork.in',role:'federation',name:'Dinesh Kapoor'})); } catch(e){} });
  console.log(`\n########## WIDTH ${W} ##########`);
  for (const r of routes) {
    const page = await ctx.newPage();
    try {
      await page.goto(base+r, { waitUntil:'networkidle', timeout:60000 });
      await page.waitForTimeout(900);
      const info = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const isContained = (el) => { let p=el.parentElement; while(p){const ox=getComputedStyle(p).overflowX; if(ox==='auto'||ox==='scroll'||ox==='hidden')return true; p=p.parentElement;} return false; };
        const off = [];
        document.querySelectorAll('body *').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width===0||rect.height===0) return;
          if ((rect.right>vw+1||rect.left<-1) && !isContained(el)) {
            const cls = (typeof el.className==='string'&&el.className.trim())?'.'+el.className.trim().split(/\s+/).slice(0,3).join('.'):'';
            off.push({s: el.tagName.toLowerCase()+cls, r: Math.round(rect.right), l: Math.round(rect.left)});
          }
        });
        const seen=new Set(),u=[]; for(const o of off){if(!seen.has(o.s)){seen.add(o.s);u.push(o);}}
        return { vw, scrollW: document.documentElement.scrollWidth, offenders:u.slice(0,14) };
      });
      const bad = info.scrollW>info.vw+1;
      console.log(`${r}  scrollW=${info.scrollW} ${bad?'*** OVERFLOW ***':'ok'}`);
      info.offenders.forEach(o=>console.log(`     ${o.r>info.vw?'R'+o.r:'L'+o.l}  ${o.s}`));
    } catch(e){ console.log(`ERR ${r}: ${e.message.slice(0,70)}`); }
    await page.close();
  }
  await browser.close();
})();
