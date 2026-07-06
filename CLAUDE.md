# pcr_discordbot

Discord bot for a **Princess Connect Re:Dive (PCR) guild** to manage 公會戰 (guild boss battle)
attack reporting. Members call `!` commands in Discord; the bot reads/writes a Google Sheet that
acts as the guild's daily damage-tracking table. There is no local database — the spreadsheet is
the only persistent state.

## Architecture

```
bot.js          entry point: Discord client, command loader, message router, queue dispatch
config.js       ssidlist (guild -> Google Sheet ID) and chlist (Discord channel ID -> sheet ID)
gapi.js         all real Google Sheets I/O (reads credentials.json/token.json at call time)
index.js        ONE-OFF script to mint token.json via OAuth flow. Not used at runtime by the bot.
                Don't confuse this with gapi.js - they look similar but serve different purposes.
src/
  user.js       loads the "成員ID名稱對照表" tab into an in-memory {discordId: [name, sheetId]} map
  queue.js      serializes command execution (see "Why the queue exists" below)
  utils/
    constants.js   objlist (王 name/number aliases), column (A, B, ... BH letters for range building)
    utils.js        shared logic: fillandreply/fillindemage/getstatus etc., used by most fill-* commands
  commands/*.js  one file per command, auto-loaded by bot.js (see "Adding a command")
```

### Adding a command

Every file in `src/commands/` must export `{ name, aliases, description, execute(message, args,
userlist, chlist, gapi) }`. `bot.js` requires every `.js` file in that directory at startup and
registers `name` plus each alias into `client.commands`. No manual registration step needed -
dropping a new file in is enough. Aliases are frequently Chinese (e.g. `aliases: ['分組', '分組說明']`),
since that's how members actually type commands.

Only messages from members present in the loaded user list (`user.getUserList()`) AND sent in a
channel present in `chlist` are processed (see `bot.js`). If a command "does nothing" while
testing, check both of those first.

### Why the queue exists

Filling in damage is a **read-modify-write** against the same spreadsheet row (read current damage
table, decide which cell is empty, write to it). If two members call `!fill` at the same moment,
naive concurrent execution could both read the same empty cell and both write, losing one report.
`src/queue.js` forces every command's `execute()` to run to completion before the next one starts,
trading throughput for correctness. Don't remove/bypass it for a command that touches the sheet.

## The daily damage table (`getDemageTable`, range `<M/D>!A1:AB33`)

The active sheet **tab name is the current date** (`M/D`, no leading zeros), computed by
`getSheetName()` in gapi.js, and rolls over at 05:00 local time (i.e. 00:00-04:59 still writes to
*yesterday's* tab). Server clock/timezone therefore directly determines which tab gets written -
see README's note about setting the VM timezone to Asia/Taipei.

Column layout below is **reverse-engineered from `src/utils/utils.js` and the various commands**,
not from a schema anywhere - if you're about to change fill/status logic, cross-check against an
actual guild's live sheet (template linked in README.md) rather than trusting this blindly.

| index | meaning |
|---|---|
| 0 | 成員名稱 (member name - the join key used everywhere, *not* discord id) |
| 1 | 剩餘刀數 (remaining attacks today) |
| 2 | 閃退旗標 (crashed/disconnected today) |
| 3,4,5,6,7 | 隊伍1: 傷害, 目標, 尾旗標(boss-kill), 殘刀傷害, 殘刀目標 |
| 8,9,10,11,12 | 隊伍2: same 5-column pattern |
| 13,14,15,16,17 | 隊伍3: same 5-column pattern |
| 18 | `'v'` = has an outstanding 殘刀 (compensation attack) owed to them |
| 19 | 組別 (assigned group letter/name, cross-referenced against the group table below) |
| 20,21,22 | remaining seconds for the 殘刀 owed from 隊伍1/2/3's boss kill |
| 23-27 | per-boss (王1-5) "already attacked this boss today" marker, used by `checkboss.js` to skip members - exact value semantics (bool vs count) unconfirmed, only ever compared with `!= 0` |

Each team-block repeats every 5 columns starting at 3 (`j = 3, 8, 13` for team 1/2/3 - see the
`no == 1/2/3` branches in `src/utils/utils.js`). If you ever add a 4th team column block, every
place that hardcodes `j+3`/`j+4`/`column[20..22]` needs updating in lockstep.

## The group-signup table (`getGroup`, range `<M/D>!C41:J51`)

Lower section of the *same* daily tab. Columns (0-indexed from C):

| offset from C | meaning |
|---|---|
| 0 (C) | 組名 |
| 1 (D) | 總名額 (capacity) |
| 2 (E) | 目標 (text label shown in `!分組`) |
| 3 (F) | 已報人數 (signed-up count) |
| 4 (G) | 說明 (free-text notes) |
| 5,6,7 (H,I,J) | up to 3 target boss numbers for this group, compared against `!checkboss`'s argument |

Membership in a group is stored back on the *damage* table (column 19), not here - this table only
holds each group's definition/capacity.

## Known gotchas

- **`gappi` typo bug**: `src/commands/getgroup.js` (aliases `登記`/`領取`) references an undefined
  `gappi` instead of the `gapi` parameter in 3 places - throws on every call, but it's caught by the
  generic try/catch so it fails as a Chinese error reply rather than crashing the process. Flagged as
  a separate task (task_3ccf57b4); don't assume it works.
- **discord.js v11**: old API - `client.on('message', ...)`, no intents, no slash commands. Don't
  reach for v14-style patterns (interactions, `messageCreate`, intent bitfields) when editing.
- **`auth.json` is intentionally committed, unlike the other two credential files.** Only
  `credentials.json`/`token.json` (Google OAuth, minted once via `node index.js`, expires ~6 months)
  are gitignored. `auth.json` is checked in on purpose, holding the placeholder value
  `{"token": "discord bot token"}`, so a fresh clone shows contributors the file/shape it needs to
  fill in (see README's setup instructions). Don't gitignore it and don't assume its committed
  content is ever a real secret - but also don't overwrite it with a real token and commit that
  change.
- **Name-keyed joins, not ID-keyed**: most lookups match on `memberName` (sheet column 0), not
  Discord ID, by scanning the table linearly (`for (i...) if (table[i][0] == memberName) row = i`).
  Duplicate names in the "成員ID名稱對照表" tab will silently break lookups.

## Domain glossary (PCR guild battle terms)

- **刀** - an attack attempt against the boss; each member gets a limited number per day (`剩餘刀數`).
- **尾刀 / 收王** - the killing blow on a boss; the attacker doesn't get to deal full damage and is
  owed a **殘刀** (compensation attack) on the next boss, tracked via the "尾旗標" + remaining-seconds
  columns above.
- **閃退** - disconnected mid-attack; the attack counts as spent but no damage was dealt, tracked
  separately so guild leadership can account for it.
- **一王/二王/三王/四王/五王 (or 1-5)** - the 5 bosses fought in sequence each day; `objlist` in
  `src/utils/constants.js` maps the various ways members type this (digit or Chinese numeral) to a
  canonical label.
- **分組/組別** - guilds split members into sign-up groups (e.g. for scheduling who attacks when);
  unrelated to the 3 "隊伍" (team) slots in the damage table, which are just 3 attack slots per member
  per day.
