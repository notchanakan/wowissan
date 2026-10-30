#!/usr/bin/env node
// wowissan — UserPromptSubmit hook.
// Handles `/issanmode on|off` and `/issanclass soft|hard` (plus the namespaced `/wowissan:...`
// forms) directly, blocking the prompt so toggling costs no model turn. For every other prompt,
// re-injects the ruleset while the mode is on so the model never drifts. Always exits 0.

const { getState, setState, logError, getRuleset } = require('./issan-state');

function parseCommand(prompt) {
  const m = prompt.trim().match(/^\/(?:wowissan:)?(issanmode|issanclass)(?:\s+(\S+))?\s*$/i);
  if (!m) return null;
  const name = m[1].toLowerCase();
  const arg = (m[2] || '').toLowerCase();
  if (name === 'issanmode' && (arg === 'on' || arg === 'off')) return { enabled: arg === 'on' };
  if (name === 'issanclass' && (arg === 'soft' || arg === 'hard')) return { level: arg };
  return { status: true };
}

const LEVEL_LABEL = { soft: 'soft — ด่าโตเอง ด่า bug', hard: 'hard — ด่าเจ้านำ 🌶️' };

function statusMessage(state) {
  const mode = state.enabled ? 'เปิดอยู่' : 'ปิดอยู่ (OFF)';
  return `โหมดอีสาน: ${mode} · ระดับ: ${LEVEL_LABEL[state.level]}\n` +
    'เปิด/ปิด: /issanmode on|off · เปลี่ยนระดับ: /issanclass soft|hard';
}

function changeMessage(cmd, state) {
  if (cmd.enabled === true) {
    return `โหมดอีสาน: เปิดแล้วเด้อ 🌾 นับแต่นี้ไป ข้อยสิเว้าอีสานอย่างเดียว (ระดับ ${LEVEL_LABEL[state.level]})\n` +
      'ปิดได้ด้วย /issanmode off · เปลี่ยนระดับ: /issanclass soft|hard';
  }
  if (cmd.enabled === false) {
    return 'Isan mode: OFF — กลับมาพูดภาษาปกติแล้ว (เปิดอีกครั้งด้วย /issanmode on)';
  }
  const note = state.enabled ? '' : '\n(โหมดอีสานญังปิดอยู่ — เปิดด้วย /issanmode on)';
  return state.level === 'hard'
    ? `ระดับ hard แล้วเด้ 🌶️ เจ้าเฮ็ดผิดเมื่อใด ข้อยสิด่าเจ้าโลด (บ่ถึงพ่อแม่ดอก)${note}`
    : `ระดับ soft แล้วเด้ ข้อยสิด่าแต่โตเองกับ bug${note}`;
}

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input || '{}');
    const cmd = parseCommand((data.prompt || '').toString());

    if (cmd && cmd.status) {
      respond({ decision: 'block', reason: statusMessage(getState()) });
    } else if (cmd) {
      const state = setState(cmd) || getState();
      respond({ decision: 'block', reason: changeMessage(cmd, state) });
    } else {
      const state = getState();
      if (state.enabled) {
        respond({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: getRuleset(state.level) } });
      }
    }
  } catch (e) {
    logError(`prompt hook: ${e.message}`);
  }
  process.exit(0);
});
