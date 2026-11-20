"""Validate generated files, not production indexing. Run after a clean build."""
import json,re,subprocess
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote,urljoin
from xml.etree import ElementTree as ET
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.meta={};self.lang=None;self.anchors=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='link':self.links.append(a)
  if tag=='meta':self.meta[a.get('name',a.get('property',a.get('http-equiv')))]=a.get('content','')
  if tag=='a':self.anchors.append(a)
 def canonical(self):return next((a['href'] for a in self.links if a.get('rel')=='canonical'),None)
r=Path('dist');pages={('/'+str(p.relative_to(r)).removesuffix('index.html')):Page(p.read_text()) for p in r.rglob('index.html')}
pairs=json.loads(Path('src/i18n/routePairs.json').read_text()); mapped={p[lang]:(p,lang) for p in pairs for lang in ['en','es']}
base='https://ericmaster.ninja';count=0
for path,page in pages.items():
 alternates=[a for a in page.links if a.get('rel')=='alternate' and a.get('hreflang')]
 if path in mapped:
  pair,lang=mapped[path];assert page.lang==lang,(path,page.lang,lang)
  expected={l:base+pair[l] for l in ['en','es']};expected['x-default']=expected['en']
  assert {a['hreflang']:a['href'] for a in alternates}==expected,path
  for l in ['en','es']:
   target=pages[pair[l]];assert target.lang==l and target.canonical()==base+pair[l],pair[l]
   assert 'noindex' not in target.meta.get('robots','') and 'refresh' not in target.meta,pair[l]
  count+=len(alternates)
 else:assert not alternates,('unverified-alternate',path)
# Parse the unchanged source frontmatter with the project's existing YAML dependency.
script="""import fs from 'node:fs';import yaml from 'js-yaml';console.log(JSON.stringify(fs.readdirSync('src/pages/posts').filter(x=>x.endsWith('.md')).map(x=>({name:x,...yaml.load(fs.readFileSync('src/pages/posts/'+x,'utf8').split('---')[1])}))));"""
posts=json.loads(subprocess.check_output(['node','--input-type=module','-e',script],text=True))
checked=0
for post in posts:
 if not str(post.get('layout','')).endswith('/MarkdownPostLayout.astro'):continue
 checked+=1
 path='/posts/'+post['name'][:-3]+'/';page=pages[path]
 assert page.canonical()==base+path,path
 assert page.lang==post.get('lang','en'),path
 assert page.meta.get('og:type')=='article',path
 if post.get('description'):assert page.meta.get('description')==post['description'],path
 if post.get('image',{}).get('url'):
  expected_image=urljoin(base+'/',post['image']['url'].strip())
  assert page.meta['og:image']==expected_image,(path,page.meta.get('og:image'),expected_image)
 for a in page.anchors:
  href=a.get('href','')
  if href.startswith(('/tags/','/es/tags/')):
   target=unquote(urlsplit(href).path).strip('/')
   assert (r/target/'index.html').is_file(),(path,href)
sitemap_index=ET.parse(r/'sitemap-index.xml').getroot()
assert sitemap_index.tag.endswith('}sitemapindex')
sitemap_urls=[]
for loc in sitemap_index.findall('./{*}sitemap/{*}loc'):
 assert loc.text and loc.text.startswith(base+'/'),loc.text
 child=loc.text.removeprefix(base+'/')
 assert re.fullmatch(r'sitemap-\d+\.xml',child),child
 sitemap_urls.extend(n.text for n in ET.parse(r/child).getroot().findall('./{*}url/{*}loc'))
assert sitemap_urls and len(sitemap_urls)==len(set(sitemap_urls)), 'empty-or-duplicate-sitemap'
listed=set(sitemap_urls)
aliases={p:v for p,v in pages.items() if p=='/es/posts' or p.startswith('/es/posts/')}
assert aliases,'expected-Astro-fallbacks'
legacy_without_canonical={'/posts/devops-with-gitlab/','/posts/vscode-with-docker/'}
for path,page in aliases.items():
 # Fail loudly if a future real localized post is added under this prefix.
 target=path.removeprefix('/es')
 assert target in pages,(path,target)
 destination=pages[target]
 assert not ('refresh' in destination.meta or 'noindex' in destination.meta.get('robots','')),('bad-alias-target',path,target)
 assert destination.canonical()==base+target or (target in legacy_without_canonical and destination.canonical() is None),(path,target)
 assert 'refresh' in page.meta and 'noindex' in page.meta.get('robots',''),('real-es-route',path)
 assert page.canonical()==base+target and page.meta['refresh'].endswith(';url='+target),(path,page.canonical())
 assert base+target in listed and base+path not in listed,('sitemap-alias-or-missing-canonical',path)
for path in ['/es/','/es/blog/','/es/work/','/posts/lo-que-nadie-entiende-nadie-lo-mantiene-parte-1/','/posts/what-no-one-understands-no-one-maintains-part-1/']:
 assert base+path in listed,('sitemap-missing-protected-url',path)
print(f'PASS: {len(listed)} unique sitemap entries; {len(aliases)} preserved noindex post aliases excluded.')
assert 'Sitemap: '+base+'/sitemap-index.xml' in Path('dist/robots.txt').read_text()
print(f'PASS: {len(pages)} index pages; {count} alternate links; {len(pairs)} reciprocal pairs; {checked} MarkdownPostLayout articles metadata/lang/tags; sitemap.')
