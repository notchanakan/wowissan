import sys, re, json, pyarrow.parquet as pq
t = pq.read_table(sys.argv[1], columns=['input','output']).to_pylist()
out = []
for r in t:
    m = re.match(r'<eastern>(.*)</eastern>', r['input'] or '', re.S)
    if m: out.append({'isan': m.group(1).strip(), 'central': (r['output'] or '').strip()})
json.dump(out, open(sys.argv[2],'w'), ensure_ascii=False)
print(len(t), 'rows,', len(out), 'eastern')
