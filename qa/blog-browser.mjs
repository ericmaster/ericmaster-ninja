// Public-route-only browser acceptance. No provider, form or authentication requests.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile, mkdir, stat, writeFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require = createRequire('/tmp/blog-browser-tools/package.json');
const {chromium} = require('playwright');
const root = resolve('dist');
const out = resolve('qa-results'); await mkdir(out,{recursive:true});
const headers = await readFile(resolve(root,'_headers'),'utf8');
const csp = headers.match(/^  Content-Security-Policy: (.+)$/m)?.[1]; assert.ok(csp);
const article = '/posts/the-expensive-part-of-an-agent-is-attention/';
const esArticle = '/es/posts/lo-caro-de-un-agente-es-la-atencion/';
const pages = new Set(['/', '/es/', '/blog/', '/es/blog/', article, esArticle,
 '/es'+article, '/posts/lo-caro-de-un-agente-es-la-atencion/']);
// Select actual tag links from the built public listing, not guessed names.
for (const prefix of ['', '/es']) {
 const html=await readFile(resolve(root,'.'+prefix+'/blog/index.html'),'utf8');
 const tag=html.match(/href="([^" ]*\/tags\/[^" ]+)"/); assert.ok(tag);
 pages.add(tag[1].replace(/\/?$/, '/'));
}
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon'};
const served=new Set();
const server=createServer(async(req,res)=>{
 try {
  if(!['GET','HEAD'].includes(req.method)) {res.writeHead(405).end();return;}
  let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(path.includes('..')||path.includes('\\')) {res.writeHead(404).end();return;}
  const normalized=path.replace(/\/?$/,'/');
  const asset=/^\/(?:_astro|assets)\//.test(path) && ['.js','.css','.svg','.png','.jpg','.jpeg','.webp','.woff','.woff2','.ico'].includes(extname(path));
  if(!pages.has(normalized)&&!asset&&path!='/favicon.svg') {res.writeHead(404).end();return;}
  if(pages.has(normalized)) path=normalized+'index.html';
  const file=resolve(root,'.'+path); assert.ok(file.startsWith(root+sep));
  const info=await stat(file); assert.ok(info.isFile());
  const bytes=await readFile(file); served.add(path);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true}); const results=[];
try {
 for(const width of [390,1440]) {
  const ctx=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block',reducedMotion:'reduce'});
  const blocked=[]; await ctx.route('**/*',route=>{
   const req=route.request(); if(!req.url().startsWith(origin+'/')||!['GET','HEAD'].includes(req.method())) {blocked.push(new URL(req.url()).origin);return route.abort();} return route.continue();
  });
  const page=await ctx.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  for(const path of pages) {
   const response=await page.goto(origin+path,{waitUntil:'networkidle'}); assert.equal(response.status(),200,path);
   await page.evaluate(()=>document.fonts.ready);
   assert.ok(await page.locator('main').count(),path+' main');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
   if(overflow){
    await page.screenshot({path:resolve(out,'overflow-'+width+'.png'),fullPage:false});
    const offenders=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,id:e.id,cls:e.className?.baseVal??e.className,rect:e.getBoundingClientRect().toJSON()})).filter(e=>e.rect.right>innerWidth+1||e.rect.left< -1));
    await writeFile(resolve(out,'overflow-'+width+'.json'),JSON.stringify({path,width,offenders},null,2));
   }
   assert.equal(overflow,false,path+' horizontal overflow '+width);
   const title=await page.locator('h1').first().textContent();
   const name=(path==='/'?'home':path.replaceAll('/','_'))+'-'+width;
   await page.screenshot({path:resolve(out,name+'.png'),fullPage:false});
   results.push({path,width,title,overflow});
  }
  // Exercise real mobile menu toggles, locale round-trips and history.
  await page.goto(origin+'/',{waitUntil:'networkidle'});
  if(width<1024){
   const menu=page.getByRole('button',{name:'Toggle navigation menu'});
   for(let n=0;n<2;n++){await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'false');}
  }
  const language=()=>page.getByRole('button',{name:'Select language'});
  await language().click(); await page.locator('[role="menuitem"][href="/es/"]').click(); await page.waitForURL(origin+'/es/');
  await language().click(); await page.locator('[role="menuitem"][href="/"]').click(); await page.waitForURL(origin+'/');
  await page.goBack({waitUntil:'networkidle'}); assert.equal(new URL(page.url()).pathname,'/es/');
  await page.goForward({waitUntil:'networkidle'}); assert.equal(new URL(page.url()).pathname,'/');
  await page.goto(origin+article,{waitUntil:'networkidle'});
  await language().click(); await page.locator('[role="menuitem"][href="/es'+article+'"]').click();
  await page.waitForURL(origin+'/es'+article);
  results.push({width,articleLanguageSwitch:{path:new URL(page.url()).pathname,heading:await page.locator('h1').first().textContent(),limitation:'Existing prefix-only switch, translated slug mapping not implemented.'}});
  await page.goBack({waitUntil:'networkidle'}); assert.equal(new URL(page.url()).pathname,article);
  const theme=page.locator('#themeToggle'); await theme.click(); assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),true); await theme.click();
  // Selected-language listing must not mix these known paired articles.
  await page.goto(origin+'/blog/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.post-card h3 a[href*="lo-caro-de-un-agente"]').count(),0);
  assert.equal(await page.locator('.post-card h3 a[href*="the-expensive-part"]').count(),1);
  await page.goto(origin+'/es/blog/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.post-card h3 a[href*="the-expensive-part"]').count(),0);
  assert.equal(await page.locator('.post-card h3 a[href*="lo-caro-de-un-agente"]').count(),1);
  assert.deepEqual(errors,[], 'uncaught browser errors');
  results.push({width,interactions:'pass',externalRequestsBlocked:[...new Set(blocked)]}); await ctx.close();
 }
 const manifest={}; for(const p of [...served].sort())manifest[p]=createHash('sha256').update(await readFile(resolve(root,'.'+p))).digest('hex');
 await writeFile(resolve(out,'report.json'),JSON.stringify({results,manifest,scope:'Public static build only. No Worker auth/API or production acceptance.'},null,2));
} finally {await browser.close();await new Promise(r=>server.close(r));}
