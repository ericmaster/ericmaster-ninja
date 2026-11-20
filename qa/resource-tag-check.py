from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import yaml
class Tags(HTMLParser):
 def __init__(self):super().__init__();self.active=0;self.depth=0;self.labels=[];self.links=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if self.active:self.depth+=1
  elif t=='div' and 'tags' in a.get('class','').split():self.active=1;self.depth=1
  if self.active and t=='a':self.links.append(a.get('href'))
 def handle_endtag(self,t):
  if self.active:
   self.depth-=1
   if not self.depth:self.active=0
 def handle_data(self,s):
  if self.active and s.strip():self.labels.append(s.strip())
count=0
for source in Path('src/pages/resources').glob('*.md'):
 fm=yaml.safe_load(source.read_text().split('---',2)[1]);tags=fm.get('tags',[])
 if not tags:continue
 p=Path('dist/resources')/source.stem/'index.html';h=Tags();h.feed(p.read_text());assert h.labels==tags,(source,h.labels,tags)
 expected=['/tags/'+tag+'/' for tag in tags if (Path('dist/tags')/tag/'index.html').is_file()]
 assert [unquote(urlsplit(link).path) for link in h.links]==expected,(source,h.links,expected)
 count+=1
assert count>0
print('PASS',count,'resource pages: source tag labels/order preserved, only resolving links')
