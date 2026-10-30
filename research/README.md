# Vocabulary research

The Isan rules in `hooks/issan-state.js` are tuned against ~12,000 Central Thai ↔ Isan sentence
pairs from the `<eastern>` split of [Madnesss/dialect-tag](https://huggingface.co/datasets/Madnesss/dialect-tag)
on Hugging Face. The dataset is not redistributed here (it has no license); only the scripts are.

Reproduce:

```bash
curl -L -o train.parquet https://huggingface.co/api/datasets/Madnesss/dialect-tag/parquet/default/train/0.parquet
uv run --with pyarrow python research/extract.py train.parquet isan.json
uv run --with pythainlp python research/align.py isan.json align.json
```

`align.py` tokenizes both sides, aligns them with `difflib`, and counts short word substitutions
(e.g. `ไม่→บ่`, `เพราะ→ญ้อน`, `ทุก→ซู่`). The most frequent pairs became the vocabulary list,
spelling conventions (ย→ญ, ร→ฮ, ช→ซ, เอือ→เอีย) and particle frequencies in the ruleset.

The dataset contains no profanity, so the cuss vocabulary is hand-written; the frustration
phrases (ปวดหัวคัก, เป็นตารำคาญ, เป็นตาเบื่อ, เซา…จักเที่ยแหน่) come from the corpus.
