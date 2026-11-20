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
