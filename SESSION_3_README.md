# Session 3 — Habit CRUD

Matches the checklist from the implementation plan:

- [x] `app/api/habits/route.ts` — GET (list), POST (create)
- [x] `app/api/habits/[id]/route.ts` — PATCH (edit/archive), DELETE
- [x] `/dashboard/habits` page — list habits, "Add habit" form
- [x] `HabitCard` component

## Files in this drop

```
src/
  lib/
    validations/habit.ts      # zod schemas for create/update payloads
  app/
    api/
      habits/
        route.ts              # GET, POST
        [id]/route.ts         # PATCH, DELETE
    dashboard/
      habits/
        page.tsx              # server component, fetches from the DB directly
        fonts.ts               # next/font setup (Fraunces + Public Sans)
  components/
    habits/
      HabitCard.tsx            # per-habit card: inline edit, archive/restore, delete (with confirm)
      AddHabitForm.tsx         # inline "+ Plant a new habit" form
```

This build matches your actual `schema.ts` (the one with `user`/`session`/
`account`/`verification` plus `habits`, `completions`, `gardenState`,
`plants`, `unlockedPlants` already in one file) — nothing to merge. One
consequence of your schema worth knowing: `habits.id` and `completions.id`
are `text("id").primaryKey()` with **no default**, so ids can't be generated
DB-side. `POST /api/habits` handles this by generating the id in the route
with `crypto.randomUUID()` before inserting.

## Before this runs

1. **Install zod** if you haven't already: `npm i zod`.
2. Confirm `@/db` exports a `db` client and `@/lib/auth` exports an `auth`
   instance with `auth.api.getSession(...)` — both come from Sessions 1–2.

## Design notes

The `/dashboard/habits` page and `HabitCard` lean into the garden/field-guide
premise a level below the literal plant art (that's Session 5+): Fraunces for
habit names, a hairline-bordered list instead of shadowed cards, and the
weekly target shown as a row of small filled/unfilled dots rather than a
progress bar. Colors:

| Token | Hex | Use |
|---|---|---|
| Paper | `#FAF7F0` | page background |
| Ink | `#24261F` | primary text |
| Pine | `#2B4635` | headings accent, primary button |
| Moss | `#7C9473` | active-habit border, target dots |
| Gold | `#B98A2E` | edit state, focus accent |
| Hairline | `#D8D2C2` / `#EAE5D6` | dividers, inactive dots |
| Rust | `#A3492E` | delete confirm, errors |

## What's intentionally left for later sessions

- No "mark done today" button or streaks yet — that's Session 4.
- No growth points / garden visuals — Session 5–6.
- Archived habits are hidden behind a `<details>` disclosure rather than a
  separate view; revisit if that stops being enough.
