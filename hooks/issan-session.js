#!/usr/bin/env node
// wowissan — SessionStart hook.
// Emits the Isan ruleset as session context when the mode is on. Always exits 0.

try {
  const { getState, getRuleset } = require('./issan-state');
  const state = getState();
  if (state.enabled) process.stdout.write(getRuleset(state.level));
} catch (e) {
  // Never block session start.
}
process.exit(0);
