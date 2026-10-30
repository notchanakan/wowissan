#!/usr/bin/env node
// wowissan — SessionStart hook.
// Emits the Isan ruleset as session context when the mode is on. Always exits 0.

try {
  const { getState, RULESET } = require('./issan-state');
  if (getState().enabled) process.stdout.write(RULESET);
} catch (e) {
  // Never block session start.
}
process.exit(0);
