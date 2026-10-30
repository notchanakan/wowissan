---
description: เปลี่ยนระดับโหมดอีสาน (soft = ด่าโตเองกับ bug, hard = ด่า user ได้ แต่บ่ถึงพ่อแม่)
argument-hint: soft|hard
---

The wowissan plugin hook normally handles this command before it reaches you. If you are
reading this, the hook did not run. Tell the user, in one short line, that the wowissan hook
is not active and they should check that the plugin is enabled (`/plugin`) and that `node`
is installed. Requested argument: `$ARGUMENTS`.
