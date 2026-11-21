import {Miniflare,createFetchMock} from 'miniflare';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
const mock=createFetchMock();mock.disableNetConnect();
let calls=0,mf;
try{
 mf=new Miniflare({modules:true,script:stripTypeScriptTypes(readFileSync('worker/index.ts','utf8')),cf:false,host:'127.0.0.1',port:0,compatibilityDate:'2025-05-28',compatibilityFlags:[],fetchMock:mock,serviceBindings:{ASSETS:()=>{calls++;return new Response('asset')}}});
 let count=0;
 for(const path of ['/admin','/admin/','/admin/config.yml','/api/auth','/api/auth/','/api/auth/callback','/api/auth?code=synthetic'])for(const method of ['GET','HEAD','POST','OPTIONS']){
  const r=await mf.dispatchFetch('https://ericmaster.ninja'+path,{method,redirect:'manual'});assert.equal(r.status,410);assert.equal(r.headers.get('location'),null);assert.equal(r.headers.get('set-cookie'),null);if(method==='HEAD')assert.equal(await r.text(),'');count++;
 }
 assert.equal(calls,0);
 for(const p of ['/','/blog/','/administrator','/api/authorize'])assert.equal(await(await mf.dispatchFetch('https://ericmaster.ninja'+p,{redirect:'manual'})).text(),'asset');
 assert.equal(calls,4);
 await mf.dispose();mf=null;
 const existing=new Set(['/tags/Cloudflare/','/tags/AI%20Development/']);
 mf=new Miniflare({modules:true,script:stripTypeScriptTypes(readFileSync('worker/index.ts','utf8')),cf:false,host:'127.0.0.1',port:0,compatibilityDate:'2025-05-28',compatibilityFlags:[],fetchMock:mock,serviceBindings:{ASSETS:(req)=>{const p=new URL(req.url).pathname;return new Response(null,{status:existing.has(p)?200:404});}}});
 for(const [p,expected] of [['/es/tags/Cloudflare/','/tags/Cloudflare/'],['/es/tags/AI%20Development/','/tags/AI%20Development/']]){
  const r=await mf.dispatchFetch('https://ericmaster.ninja'+p,{redirect:'manual'});
  assert.equal(r.status,301);assert.equal(r.headers.get('location'),expected);
 }
 assert.equal((await mf.dispatchFetch('https://ericmaster.ninja/es/tags/nonexistent-tag/',{redirect:'manual'})).status,404);
 console.log(JSON.stringify({passed:true,retiredRequests:count,assetRequests:calls,legacyEsTagRedirects:2,workerNetworkPassthrough:false,clientRedirects:'manual'}));
}finally{if(mf)await mf.dispose();await mock.close()}
