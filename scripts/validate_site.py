from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]/'dist'
errors=[]
class Document(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.duplicates=[];self.links=[];self.assets=[];self.controls=[];self.tabs=[];self.panels=[];self.h1=0;self.titles=0;self.main=0;self.description=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if a.get('id'):
            if a['id'] in self.ids:self.duplicates.append(a['id'])
            self.ids.add(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='title':self.titles+=1
        if tag=='main':self.main+=1
        if tag=='meta' and a.get('name')=='description' and a.get('content'):self.description=True
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='img':
            if 'alt' not in a:errors.append('Image missing alt text')
            self.assets.append(a.get('src',''))
        if tag=='script' and a.get('src'):self.assets.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet':self.assets.append(a.get('href',''))
        if a.get('aria-controls'):self.controls.append(a['aria-controls'])
        if a.get('role')=='tab':self.tabs.append(a)
        if a.get('role')=='tabpanel':self.panels.append(a)

for file in sorted(root.rglob('*.html')):
    d=Document();d.feed(file.read_text());name=str(file.relative_to(root))
    if d.h1!=1:errors.append(f'{name}: expected one main heading, got {d.h1}')
    if d.main!=1 or not d.description:errors.append(f'{name}: missing main or description')
    if d.duplicates:errors.append(f'{name}: duplicate IDs {d.duplicates}')
    for ref in d.assets+d.links:
        u=urlsplit(ref)
        if u.scheme or u.netloc:continue
        if u.path:
            path=root/u.path.lstrip('/') if u.path.startswith('/') else file.parent/u.path
            if path.is_dir():path=path/'index.html'
            if not path.exists():errors.append(f'{name}: missing local target {ref}')
        if u.fragment and not u.path and u.fragment not in d.ids:errors.append(f'{name}: missing anchor {ref}')
    for target in d.controls:
        if target not in d.ids:errors.append(f'{name}: missing controlled element {target}')
    if d.tabs:
        if sum(t.get('aria-selected')=='true' for t in d.tabs)!=1:errors.append(f'{name}: no unique selected tab')
        if len(d.tabs)!=len(d.panels):errors.append(f'{name}: tab/panel mismatch')
        for panel in d.panels:
            if panel.get('aria-labelledby') not in d.ids:errors.append(f'{name}: panel label missing')
for asset in root.glob('assets/*.svg'):ET.parse(asset)
ET.parse(root/'sitemap.xml')
assert not errors,'\n'.join(errors)
print(f'Validated {len(list(root.rglob("*.html")))} HTML files: local routes, assets, anchors, main headings, metadata, navigation controls and accessible use-case tabs.')
