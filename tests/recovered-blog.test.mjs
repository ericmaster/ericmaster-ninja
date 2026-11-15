import {it} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {load} from 'js-yaml';
for(const filename of fs.readdirSync(new URL('./fixtures/recovered-blog',import.meta.url))){
 const ref=JSON.parse(fs.readFileSync(new URL('./fixtures/recovered-blog/'+filename,import.meta.url),'utf8'));
 it('preserves recovered public content: '+ref.data.slug,()=>{
 const source=fs.readFileSync(new URL('../src/pages/posts/'+ref.data.slug+'.md',import.meta.url),'utf8');const parts=source.split('---');const data=load(parts[1]);
 assert.deepEqual({...data,pubDate:data.pubDate.toISOString()},ref.data);assert.equal(parts.slice(2).join('---').trim(),ref.body.trim());assert.equal(data.lang,'en');assert.equal(data.published,true);assert.ok(!/<script\b|\son\w+\s*=|javascript:/i.test(ref.body),'no executable markup added to recovered body');assert.ok(!source.includes('[Truncated]'));assert.ok(!source.includes('[RENDERED_MERMAID_DIAGRAM]'));
 });
}
