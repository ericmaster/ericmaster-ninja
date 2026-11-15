// Run after npm run build. Compare rebuilt output with captured public DOM.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parse, parseFragment } from 'parse5';
const all=(n,fn)=>[...(fn(n)?[n]:[]),...(n.childNodes||[]).flatMap(c=>all(c,fn))];
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
const normalized=s=>s.replace(/\s+/g,' ').trim();
const cls=(n,c)=>attr(n,'class')?.split(/\s+/).includes(c);
const structure=n=>n.tagName?{tag:n.tagName,attrs:Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value])),children:(n.childNodes||[]).filter(c=>c.nodeName!=='#comment'&&(c.nodeName!=='#text'||c.value.trim())).map(structure)}:normalized(text(n));
for(const filename of fs.readdirSync('tests/fixtures/recovered-blog')){
 const ref=JSON.parse(fs.readFileSync('tests/fixtures/recovered-blog/'+filename,'utf8'));const slug=ref.data.slug;
 const doc=parse(fs.readFileSync('dist/posts/'+slug+'/index.html','utf8'));const article=all(doc,n=>n.tagName==='article')[0];
 assert.ok(article,slug+' article exists');
 const expected=parseFragment(ref.body);
 assert.equal(normalized(text(article)),normalized(text(expected)),slug+' full text');
 assert.deepEqual(article.childNodes.filter(c=>c.nodeName!=='#comment'&&(c.nodeName!=='#text'||c.value.trim())).map(structure),expected.childNodes.filter(c=>c.nodeName!=='#comment'&&(c.nodeName!=='#text'||c.value.trim())).map(structure),slug+' structure, links, heading IDs and diagram source');
 assert.equal(text(all(doc,n=>n.tagName==='h1')[0]),ref.data.title,slug+' title');
 assert.equal(text(all(doc,n=>cls(n,'text-right'))[0]),new Date(ref.data.pubDate).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),slug+' visible publication date');
 assert.equal(text(all(doc,n=>cls(n,'text-xl'))[0]),ref.data.description,slug+' description');
 const listing=parse(fs.readFileSync('dist/blog/index.html','utf8'));
 const card=all(listing,n=>n.tagName==='li'&&cls(n,'post-card')).find(n=>all(n,a=>a.tagName==='a'&&attr(a,'href')==='/posts/'+slug).length);
 assert.ok(card,slug+' remains in English blog');assert.equal(attr(all(card,n=>n.tagName==='time')[0],'datetime'),ref.data.pubDate,slug+' original publication timestamp');
 const image=all(doc,n=>n.tagName==='img')[0];assert.equal(attr(image,'src'),ref.data.image.url);assert.equal(attr(image,'alt'),ref.data.image.alt);
 assert.deepEqual(all(all(doc,n=>cls(n,'tags'))[0],n=>n.tagName==='a').map(text),ref.data.tags);
 console.log('PASS',slug,'text, structure, links, metadata, image, tags');
}
