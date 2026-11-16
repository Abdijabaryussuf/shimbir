"""Build demo.html: inlines src/harness.js, the sample data and the logo into one file."""
import json, re, pathlib
r = pathlib.Path(__file__).parent
src = (r / 'demo.src.html').read_text()
h = (r / 'src/harness.js').read_text()
h = re.sub(r'^export (default )?', '', h, flags=re.M)  # drop ES-module exports for inline use
logo = ''
for p in [r / 'logo.svg', r.parent / 'ionos/logo.svg']:
    if p.exists():
        logo = re.sub(r'<\?xml.*?\?>', '', p.read_text()); break
room = json.dumps(json.loads((r / 'data/sample-classroom.json').read_text()))
mis = json.dumps(json.loads((r / 'data/misconceptions.json').read_text()))
out = src.replace('/*LOGO*/', logo).replace('/*HARNESS*/', h).replace('/*ROOM*/', room).replace('/*MIS*/', mis)
(r / 'demo.html').write_text(out)
print('demo.html', len(out), 'bytes')
