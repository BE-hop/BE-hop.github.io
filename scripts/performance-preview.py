#!/usr/bin/env python3
"""Local-only repeatable network profile: aggregate 1.6Mbps + 150ms per request."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import argparse,time,threading,json
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--site',required=True);p.add_argument('--port',type=int,default=4005);args=p.parse_args()
lock=threading.Lock();next_byte=0.;rate=200000
metrics='''<script>
(() => {
 let lcp=0,cls=0,longTasks=0;const start=performance.now();
 const snapshot=()=>{document.documentElement.dataset.loadMetrics=JSON.stringify({lcp,cls,longTasks,elapsed:Math.round(performance.now()-start),bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),requests:performance.getEntriesByType('resource').length});};
 for(const [type,fn] of [['largest-contentful-paint',e=>{lcp=e.startTime;}],['layout-shift',e=>{if(!e.hadRecentInput)cls+=e.value;}],['longtask',()=>{longTasks++;}]])try{new PerformanceObserver(list=>{list.getEntries().forEach(fn);snapshot();}).observe({type,buffered:true});}catch{}
 window.addEventListener('load',()=>{snapshot();for(let n=1;n<=6;n++)setTimeout(()=>{snapshot();if(n===6)document.documentElement.dataset.measureComplete='true';},n*1000);});
})();
</script>'''
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=args.site,**kw)
 def end_headers(self):
  self.send_header('Cache-Control','no-store')
  super().end_headers()
 def do_GET(self):
  time.sleep(.15)
  target=Path(self.translate_path(self.path));target=target/'index.html' if target.is_dir() else target
  if target.is_file() and target.suffix=='.html':
   data=target.read_text().replace('</head>',metrics+'</head>').encode();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.send_bytes(data);return
  super().do_GET()
 def send_bytes(self,data):
  global next_byte
  for off in range(0,len(data),8192):
   chunk=data[off:off+8192]
   with lock:
    wait=max(0,next_byte-time.monotonic());next_byte=max(next_byte,time.monotonic())+len(chunk)/rate
   if wait:time.sleep(wait)
   try:self.wfile.write(chunk)
   except (BrokenPipeError,ConnectionResetError):break
 def copyfile(self,source,outputfile):self.send_bytes(source.read())
 def log_message(self,*a):pass
print('Fixed network profile: 1.6Mbps aggregate, 150ms request latency',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
