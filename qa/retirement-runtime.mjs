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
 assert.equal(calls,4);console.log(JSON.stringify({passed:true,retiredRequests:count,assetRequests:calls,workerNetworkPassthrough:false,clientRedirects:'manual'}));
}finally{if(mf)await mf.dispose();await mock.close()}
