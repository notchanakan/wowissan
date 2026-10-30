const { test } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const HOOKS = path.join(__dirname, '..', 'hooks');

function run(script, home, stdin = '') {
  return execFileSync(process.execPath, [path.join(HOOKS, script)], {
    input: stdin,
    encoding: 'utf8',
    env: { ...process.env, WOWISSAN_HOME: home }
  });
}

const prompt = (p, home) => run('issan-prompt.js', home, JSON.stringify({ prompt: p }));

function freshHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'wowissan-test-'));
}

test('default is off: no context injected', () => {
  const home = freshHome();
  assert.strictEqual(run('issan-session.js', home), '');
  assert.strictEqual(prompt('hello', home), '');
});

test('/issanmode on enables, blocks, and injects on later prompts', () => {
  const home = freshHome();
  const out = JSON.parse(prompt('/issanmode on', home));
  assert.strictEqual(out.decision, 'block');
  assert.match(out.reason, /เปิดแล้ว/);

  const next = JSON.parse(prompt('fix the bug', home));
  assert.match(next.hookSpecificOutput.additionalContext, /ISSAN MODE ACTIVE/);
  assert.match(run('issan-session.js', home), /ISSAN MODE ACTIVE/);
});

test('/issanmode off disables', () => {
  const home = freshHome();
  prompt('/issanmode on', home);
  const out = JSON.parse(prompt('/wowissan:issanmode OFF', home));
  assert.strictEqual(out.decision, 'block');
  assert.strictEqual(prompt('hello', home), '');
});

test('bare /issanmode reports status without changing it', () => {
  const home = freshHome();
  assert.match(JSON.parse(prompt('/issanmode', home)).reason, /OFF/);
  assert.strictEqual(prompt('hello', home), '');
});

test('similar text is not treated as the command', () => {
  const home = freshHome();
  assert.strictEqual(prompt('what does /issanmode on do?', home), '');
  assert.strictEqual(prompt('/issanmodex on', home), '');
});
