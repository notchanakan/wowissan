# เว้าอีสาน (wowissan) 🌾

[![ci](https://github.com/notchanakan/wowissan/actions/workflows/ci.yml/badge.svg)](https://github.com/notchanakan/wowissan/actions/workflows/ci.yml)
[![release](https://github.com/notchanakan/wowissan/actions/workflows/release.yml/badge.svg)](https://github.com/notchanakan/wowissan/actions/workflows/release.yml)
[![latest release](https://img.shields.io/github/v/release/notchanakan/wowissan)](https://github.com/notchanakan/wowissan/releases/latest)
[![license](https://img.shields.io/github/license/notchanakan/wowissan)](LICENSE)

Plugin สำหรับ Claude Code ที่ให้ Claude **เว้าภาษาอีสานเท่านั้น** และพอทำอะไรพลาดหรือเจอเรื่องหัวร้อน มันจะ**ด่าเป็นภาษาอีสาน**

```
/issanmode on    # เปิด — Claude สิเว้าอีสานอย่างเดียว
/issanmode off   # ปิด — กลับไปพูดปกติ
/issanmode       # ดูสถานะ
```

- ค่าเริ่มต้น **ปิด**
- เปิดแล้วจะค้างไว้ข้าม session จนกว่าจะสั่ง `/issanmode off`
- ตอนเปิด/ปิด ไม่เสีย token (hook จัดการเองโดยไม่ส่ง prompt ไปให้ model)
- ด่าตอน: ตัวเองทำพลาด, command/test/build พัง, user บ่นว่าทำผิด, เจอ code/config ที่น่าหงุดหงิด
  (ด่าตัวเอง ด่า bug ด่าสถานการณ์ — ไม่ด่า user, ไม่ด่าใน code/commit)
- Code, commit message, file path, error message ยังเขียนตามปกติ ไม่แปลงเป็นอีสาน

## ติดตั้ง

### Claude Code (แนะนำ — เสถียรสุด)

ต้องมี `node` ในเครื่อง

```
/plugin marketplace add notchanakan/wowissan
/plugin install wowissan@wowissan
```

แล้ว restart Claude Code

ทดสอบจาก folder ในเครื่องก่อน publish:

```bash
claude --plugin-dir /path/to/wowissan
```

### claude.ai (web) และ Claude Desktop

1. โหลด `issanmode.zip` จาก [Releases](https://github.com/notchanakan/wowissan/releases/latest)
2. Settings → Capabilities → Skills → Upload skill → เลือก zip (ต้องเปิด code execution, แพลน Pro/Max/Team/Enterprise)
3. ในแชท พิมพ์ `เปิดโหมดอีสาน` หรือ `issanmode on` / ปิดด้วย `ปิดโหมดอีสาน` หรือ `issanmode off`

ต่างจากเวอร์ชัน Claude Code: เปิดได้ทีละแชท (แชทใหม่เริ่มปิด) และไม่มี hook คอยย้ำกฎทุกข้อความ
แชทยาวๆ อาจหลุดกลับมาพูดภาษากลางบ้าง ถ้าหลุดก็สั่งเปิดซ้ำ

### Agent อื่นๆ ผ่าน [skills.sh](https://skills.sh) (Codex, Cursor, OpenCode, ...)

```bash
npx skills add notchanakan/wowissan
```

ตัว skill อยู่ที่ `.agents/skills/issanmode/SKILL.md` — สร้างจาก ruleset เดียวกับ hook
ถ้าแก้ `hooks/issan-state.js` ให้รัน `node scripts/build-skill.js` ด้วย (test จะ fail ถ้าลืม)

## ทำงานยังไง

- `hooks/issan-prompt.js` (UserPromptSubmit): ดัก `/issanmode on|off` แล้วบันทึก state ไว้ที่ `~/.wowissan/state.json`
  ตอนเปิดอยู่ จะแนบกฎภาษาอีสานไปกับทุก prompt เพื่อไม่ให้ model หลุดกลับไปพูดภาษาอื่น
- `hooks/issan-session.js` (SessionStart): ใส่กฎตอนเริ่ม session ถ้าโหมดเปิดอยู่
- `hooks/issan-state.js`: อ่าน/เขียน state และเก็บกฎภาษา (คำศัพท์, คำลงท้าย, คำด่า, ห้ามใช้อักษรลาว)

คำศัพท์และวิธีสะกดเรียนรู้จากประโยคอีสานจริง ~12,000 ประโยค (เช่น `ญ้อน`, `อีหญัง`, `ซู่`, `ขั้น`, `หม้อง`)
ดูวิธีทำและรันซ้ำได้ที่ [research/README.md](research/README.md)

ถ้าใช้คู่กับ plugin ที่เปลี่ยนสไตล์ภาษาตัวอื่น (เช่น pordee) โหมดอีสานจะชนะเรื่องภาษา
แต่ยังตอบสั้นตามสไตล์ของ plugin นั้น

## Test

```bash
node --test tests/*.test.js
```

## License

MIT

## ออก release ใหม่

GitHub Actions จะสร้าง `issanmode.zip` (สำหรับ claude.ai / Claude Desktop) แล้วแนบขึ้น
[Releases](https://github.com/notchanakan/wowissan/releases) ให้อัตโนมัติเมื่อ push tag:

1. แก้ `"version"` ใน `.claude-plugin/plugin.json` เช่น `1.0.1`
2. commit แล้ว push
3. `git tag v1.0.1 && git push origin v1.0.1`

tag ต้องตรงกับ version ใน `plugin.json` ไม่งั้น workflow จะ fail
