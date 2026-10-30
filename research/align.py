import sys, json, difflib, collections
from pythainlp.tokenize import word_tokenize
d = json.load(open(sys.argv[1]))
pairs = collections.Counter(); isan_only = collections.Counter()
for x in d:
    a = word_tokenize(x['central'], keep_whitespace=False)
    b = word_tokenize(x['isan'], keep_whitespace=False)
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'replace' and (i2-i1) <= 2 and (j2-j1) <= 2:
            pairs[(''.join(a[i1:i2]), ''.join(b[j1:j2]))] += 1
        elif op == 'insert' and (j2-j1) == 1:
            isan_only[b[j1]] += 1
json.dump({'pairs': [[c, i, n] for (c, i), n in pairs.most_common(400)],
           'inserted': isan_only.most_common(60)}, open(sys.argv[2], 'w'), ensure_ascii=False)
