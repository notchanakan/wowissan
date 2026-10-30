# เว้าอีสาน (wowissan) 🌾

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
node --test tests/
```

## License

MIT
