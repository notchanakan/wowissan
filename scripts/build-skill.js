#!/usr/bin/env node
// wowissan — generates the portable SKILL.md (claude.ai, Claude Desktop, `npx skills`) from the
// same RULESET the Claude Code hooks inject, so the two never drift apart.
// Usage: node scripts/build-skill.js          (write)
//        node scripts/build-skill.js --check  (exit 1 if out of date)

const fs = require('fs');
const path = require('path');
const { RULESET, HARD_RULES } = require('../hooks/issan-state');

const OUT = path.join(__dirname, '..', '.agents', 'skills', 'issanmode', 'SKILL.md');

const FRONTMATTER = [
  '---',
  'name: issanmode',
  'description: >-',
  '  เว้าอีสาน (wowissan) — Isan (Northeastern Thai) dialect mode, off by default. Use ONLY when the',
  '  user explicitly turns it on: "/issanmode on", "issanmode on", "เปิดโหมดอีสาน", "เว้าอีสาน".',
  '  Once on, every reply for the rest of the conversation is in Isan only, with Isan cussing when',
  '  things go wrong. Also use to turn it off ("/issanmode off", "ปิดโหมดอีสาน", "พูดปกติ") and to',
  '  change its class ("/issanclass soft", "/issanclass hard" — hard roasts the user too).',
  '---',
  ''
].join('\n');

const TOGGLE = [
  '# เว้าอีสาน (issanmode)',
  '',
  '## Toggle',
  '- Default is OFF. Do nothing Isan-related until the user explicitly turns it on.',
  '- ON: "/issanmode on", "issanmode on", "เปิดโหมดอีสาน", "เว้าอีสาน" → reply with exactly',
  '  "โหมดอีสาน: เปิดแล้วเด้อ 🌾 นับแต่นี้ไป ข้อยสิเว้าอีสานอย่างเดียว (ปิดได้ด้วย /issanmode off)"',
  '  and follow the rules below for EVERY later reply in this conversation.',
  '- OFF: "/issanmode off", "issanmode off", "ปิดโหมดอีสาน", "พูดปกติ" → reply with exactly',
  '  "Isan mode: OFF — กลับมาพูดภาษาปกติแล้ว" and go back to normal language.',
  '- Class: "/issanclass soft" (default — cuss only yourself, bugs and tools) or "/issanclass hard"',
  '  (also roast the user, see the HARD section). Reply with one short Isan line confirming the class.',
  '  The class is remembered when the mode is turned off and on again in this conversation.',
  '- "/issanmode" or "/issanclass" alone → say whether the mode is on or off and which class is active.',
  '- The mode lasts for this conversation only; a new chat starts OFF and soft.',
  '',
  '## Rules while ON',
  ''
].join('\n');

// The hook ruleset says only `/issanmode off` disables it; the skill also accepts the Thai phrases.
const body = RULESET.replace('Only `/issanmode off` turns this off.', 'Only the OFF phrases above turn this off.');
const hard = '\n\n' + HARD_RULES.replace('## โหมดแรง (HARD) — ด่า user ได้',
  '## โหมดแรง (HARD) — ด่า user ได้ (ONLY after "/issanclass hard")');
const content = FRONTMATTER + TOGGLE + body + hard + '\n';

if (process.argv.includes('--check')) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== content) {
    console.error('SKILL.md is out of date — run: node scripts/build-skill.js');
    process.exit(1);
  }
  process.exit(0);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, content);
console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
