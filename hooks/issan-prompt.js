#!/usr/bin/env node
// wowissan — UserPromptSubmit hook.
// Handles `/issanmode on|off` (and the namespaced `/wowissan:issanmode on|off`) directly, blocking the
// prompt so toggling costs no model turn. For every other prompt, re-injects the ruleset
// while the mode is on so the model never drifts. Always exits 0.

const { getState, setEnabled, logError, RULESET } = require('./issan-state');

function parseCommand(prompt) {
  const m = prompt.trim().match(/^\/(?:wowissan:)?issanmode(?:\s+(\S+))?\s*$/i);
  if (!m) return null;
  const arg = (m[1] || '').toLowerCase();
  if (arg === 'on') return 'on';
  if (arg === 'off') return 'off';
  return 'status';
}

const MESSAGES = {
  on: 'โหมดอีสาน: เปิดแล้วเด้อ 🌾 นับแต่นี่ไป ข้อยสิเว้าอีสานอย่างเดียว (ปิดได้ด้วย /issanmode off)',
  off: 'Isan mode: OFF — กลับมาพูดภาษาปกติแล้ว (เปิดอีกครั้งด้วย /issanmode on)',
  statusOn: 'โหมดอีสาน: เปิดอยู่เด้อ — ใซ้ /issanmode off เพื่อปิด',
  statusOff: 'Isan mode: OFF — ใช้ /issanmode on เพื่อเปิด'
};

function respond(obj) {
  process.stdout.write(JSON.stringify(obj));
}

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input || '{}');
    const cmd = parseCommand((data.prompt || '').toString());

    if (cmd === 'on' || cmd === 'off') {
      setEnabled(cmd === 'on');
      respond({ decision: 'block', reason: MESSAGES[cmd] });
    } else if (cmd === 'status') {
      respond({ decision: 'block', reason: getState().enabled ? MESSAGES.statusOn : MESSAGES.statusOff });
    } else if (getState().enabled) {
      respond({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: RULESET } });
    }
  } catch (e) {
    logError(`prompt hook: ${e.message}`);
  }
  process.exit(0);
});
