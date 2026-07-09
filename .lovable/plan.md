## Roles & Permissions Matrix (Super Admin)

Add a new page where the Super Admin can toggle, via checkboxes, which features each user role (School Admin, Branch Admin, Teacher, Student, Parent) can access. Persist the matrix in the database.

### Navigation
- Add a "Roles" tab (Shield/KeyRound icon) to the Super Admin bottom nav in `src/routes/_authenticated.super-admin.tsx`.

### New route
- `src/routes/_authenticated.super-admin.roles.tsx` — the matrix page.

### UI
- Table with:
  - Rows: features (grouped by section — Dashboard, Students, Teachers, Classes, Rewards, Badges, Points, Rules, Notifications, Messages, Reports, Settings, etc.).
  - Columns: the 5 tenant roles.
  - Each cell = a checkbox for that role × feature.
- "Select all" per row and per column.
- Sticky header + first column. Save button (disabled until dirty). Toast on save success/error, retry on load failure via existing `ErrorState`.

### Data model (new table)
`public.role_permissions`
- `role` tenant_role (PK part)
- `feature_key` text (PK part) — stable slug like `students.view`, `rewards.manage`
- `allowed` boolean, default false
- standard timestamps
- RLS:
  - SELECT for authenticated (any signed-in user can read to gate their UI).
  - ALL for super_admin only (via `is_super_admin()`).
- GRANTs to authenticated + service_role.
- Seed default rows for every (role × feature) pair via the migration.

Feature catalogue lives in `src/lib/permissions.ts` as a typed list (key, label, section) — used by both the matrix UI and any future permission checks.

### Client wiring
- Load: `supabase.from('role_permissions').select('*')` → matrix state keyed by `${role}:${feature_key}`.
- Save: upsert changed rows in a single `upsert` on conflict `(role, feature_key)`.
- Optimistic update + rollback on error.

### Scope (this plan)
- Build the matrix editor and persist changes.
- Do NOT retrofit every existing route to enforce the new permissions in this iteration — that would touch dozens of files. A follow-up can add a `usePermission(feature_key)` hook and gate specific screens once you confirm the feature catalogue.

### Technical notes
- New migration creates the table + policies + GRANTs + seed inserts.
- Matrix uses shadcn `Checkbox` + `Table`.
- Access enforced client-side by the existing super_admin layout guard; server-side by RLS on writes.
