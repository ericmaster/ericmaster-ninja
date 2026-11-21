import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('worker/index.ts');
function instance(fetch,env){const c=vm.createContext({URL,Response,fetch});vm.runInContext(stripTypeScriptTypes(source).replace('export default','globalThis.worker='),c);return (path,method='GET')=>c.worker.fetch(new Request('https://ericmaster.ninja'+path,{method}),env)}
test('retired public CMS never touches network or bindings',async()=>{
 const fail=()=>{throw Error('unexpected access')};const run=instance(fail,new Proxy({},{get:fail}));
 for(const p of ['/admin','/admin/','/admin/config.yml','/api/auth','/api/auth/','/api/auth/callback','/api/auth?code=synthetic'])for(const method of ['GET','HEAD','POST','OPTIONS']){
  const r=await run(p,method);assert.equal(r.status,410);assert.equal(r.headers.get('location'),null);assert.equal(r.headers.get('set-cookie'),null);assert.equal(r.headers.get('cache-control'),'no-store');const text=await r.text();if(method==='HEAD')assert.equal(text,'');assert.doesNotMatch(text,/synthetic|token|<script/);
 }
});
test('asset boundaries and existing proxy preserved',async()=>{
 const calls=[];const run=instance(async u=>{calls.push(u);return new Response('proxy')},{ASSETS:{fetch:()=>new Response('asset')}});
 for(const p of ['/','/blog/','/administrator','/api/authorize','/docs-admin/'])assert.equal(await(await run(p)).text(),'asset');
 assert.equal(await(await run('/ai-cheatsheets')).text(),'proxy');assert.deepEqual(calls,['https://ericmaster.github.io/ai-cheatsheets']);
});
test('CMS files/CSP absent, separate local docs retained, footer wraps and tags conditional',()=>{
 assert.equal(existsSync(new URL('../public/admin',import.meta.url)),false);assert.doesNotMatch(source,/GH_CLIENT|access_token|postMessage/);assert.doesNotMatch(read('public/_headers'),/\/admin\/|unsafe-eval|unpkg.com/);assert.doesNotMatch(read('scripts/check-csp-hashes.mjs'),/join\(DIST, "admin"\)/);
 assert.equal(existsSync(new URL('../public/docs-admin/index.html',import.meta.url)),true);assert.match(read('src/components/Footer.astro'),/flex w-full flex-wrap justify-center gap-2 items-center/);assert.match(read('src/layouts/PageLayout.astro'),/linkedTags.has\(tag\)/);
});
test('legacy EN-only /es/tags/* redirects 301 to /tags/* when EN tag exists',async()=>{
 const calls=[];
 const existing=new Set(['/es/tags/IA/','/tags/Cloudflare/','/tags/AI%20Development/']);
 const run=instance(()=>{throw Error('unexpected fetch')},{
  ASSETS:{
   fetch:(input,init)=>{
    const u=new URL(typeof input==='string'?input:input.url);
    const m=(init?.method||(typeof input==='string'?'GET':input.method)).toUpperCase();
    calls.push([u.pathname,m]);
    return new Response(u.pathname==='/es/tags/IA/'?'es-tag':null,{status:existing.has(u.pathname)?200:404});
   }
  }
 });
 for(const path of ['/es/tags/Cloudflare/','/es/tags/Cloudflare','/es/tags/AI%20Development/']){
  const expected=path.startsWith('/es/tags/Cloudflare')?'/tags/Cloudflare/':'/tags/AI%20Development/';
  for(const method of ['GET','HEAD']){
   const r=await run(path,method);
   assert.equal(r.status,301);
   assert.equal(r.headers.get('location'),expected);
   assert.equal(r.headers.get('cache-control'),'public, max-age=3600');
  }
 }
 const ia=await run('/es/tags/IA/','GET');
 assert.equal(ia.status,200);assert.equal(await ia.text(),'es-tag');
 assert.equal((await run('/es/tags/nonexistent-tag/','GET')).status,404);
 const beforeTraversal=calls.length;
 assert.equal((await run('/es/tags/..%2Fposts/','GET')).status,404);
 assert.equal(calls.length-beforeTraversal,1);
 assert.equal((await run('/es/tags/Cloudflare/','POST')).status,404);
});
