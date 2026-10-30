# เว้าอีสาน (wowissan) 🌾

[![ci](https://github.com/notchanakan/wowissan/actions/workflows/ci.yml/badge.svg)](https://github.com/notchanakan/wowissan/actions/workflows/ci.yml)
[![release](https://github.com/notchanakan/wowissan/actions/workflows/release.yml/badge.svg)](https://github.com/notchanakan/wowissan/actions/workflows/release.yml)
[![latest release](https://img.shields.io/github/v/release/notchanakan/wowissan)](https://github.com/notchanakan/wowissan/releases/latest)
[![license](https://img.shields.io/github/license/notchanakan/wowissan)](LICENSE)

Plugin สำหรับ Claude Code ที่ให้ Claude **เว้าภาษาอีสานเท่านั้น** และพอทำอะไรพลาดหรือเจอเรื่องหัวร้อน มันจะ**ด่าเป็นภาษาอีสาน**

```
/issanmode on      # เปิด — Claude สิเว้าอีสานอย่างเดียว
/issanmode off     # ปิด — กลับไปพูดปกติ
/issanclass soft   # ระดับปกติ (ค่าเริ่มต้น) — ด่าโตเอง ด่า bug
/issanclass hard   # ระดับแรง — ด่า user ได้นำ 🌶️
/issanmode         # ดูสถานะ
```

- ค่าเริ่มต้น **ปิด** และระดับ **soft**
- เปิดแล้วจะค้างไว้ข้าม session จนกว่าจะสั่ง `/issanmode off` ระดับก็จำไว้เหมือนกัน
- ตอนเปิด/ปิด/เปลี่ยนระดับ ไม่เสีย token (hook จัดการเองโดยไม่ส่ง prompt ไปให้ model)

| | soft | hard |
|---|---|---|
| ด่าตัวเองตอนทำพลาด, ด่า bug/test/build ที่พัง | ✓ | ✓ |
| ด่า user ตอนพิมพ์ผิด, ถามซ้ำ, ไม่ฟังที่บอก, deploy วันศุกร์ | | ✓ |

ทั้งสองระดับ **ไม่ด่าถึงพ่อแม่/ครอบครัว** ไม่มีเรื่องเพศ รูปร่างหน้าตา ศาสนา เชื้อชาติ ภูมิภาค
ด่าแค่ประโยคเดียวแล้วช่วยต่อเต็มที่ และจะหยุดด่าเองถ้า user เครียดจริงหรือเจอเรื่องหนัก (prod ล่ม, ข้อมูลหาย)

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
3. ในแชท พิมพ์ `เปิดโหมดอีสาน` หรือ `issanmode on` / ปิดด้วย `ปิดโหมดอีสาน` หรือ `issanmode off` / ระดับแรง `issanclass hard`

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

GitHub Actions สร้าง `issanmode.zip` (สำหรับ claude.ai / Claude Desktop) แล้วแนบขึ้น
[Releases](https://github.com/notchanakan/wowissan/releases) ให้อัตโนมัติ

**แบบกดปุ่ม (แนะนำ):** [Actions → release → Run workflow](https://github.com/notchanakan/wowissan/actions/workflows/release.yml)
แล้วเลือก `patch` / `minor` / `major` หรือพิมพ์ version เอง workflow จะแก้ version ใน `plugin.json`,
commit (ขึ้น Verified), สร้าง tag และ release ให้ครบ หรือสั่งจาก terminal:

```bash
gh workflow run release.yml -f bump=patch      # 1.0.0 → 1.0.1
gh workflow run release.yml -f version=2.0.0   # กำหนดเอง
```

อย่าลืม `git pull` หลังจากนั้น เพราะ workflow commit version ใหม่ขึ้น `main`

**แบบ push tag เอง:** แก้ `"version"` ใน `.claude-plugin/plugin.json` → commit + push →
`git tag v1.0.1 && git push origin v1.0.1` (tag ต้องตรงกับ version ไม่งั้น workflow จะ fail)
