## Houses feature for Branch Admin

Add per-branch "Houses" (e.g. Red, Blue, Silver) that group students and teachers, with a live-updated total points score visible to all roles.

### 1. Database (migration)

**New table `public.houses`**
- `id`, `school_id`, `branch_id` (required), `name`, `color` (hex), `emoji`, `total_points` (int, default 0), timestamps
- Unique on `(branch_id, name)`
- RLS:
  - Branch admins of that branch: full CRUD
  - School admin / super admin: full CRUD within their scope
  - All authenticated users in same school: SELECT (for leaderboard)

**Add `house_id` (nullable) to `students` and `teachers`**
- Index on `house_id`
- Set NULL on house delete

**Trigger to keep `houses.total_points` in sync**
- AFTER INSERT/UPDATE/DELETE on `point_transactions`
- Look up `students.house_id`, apply delta to that house's `total_points`
- Handle student moving between houses (UPDATE on `students.house_id` recomputes both old and new house totals from scratch — safer than diff math)

### 2. Branch Admin UI

**New route `src/routes/_authenticated.branch-admin.houses.tsx`**
- List houses for current branch with color swatch, emoji, member counts (students + teachers), total points
- Create / Edit dialog: name, color picker, emoji
- Delete with confirm (members get unassigned)
- Add "Houses" entry to branch admin nav (`branch-admin.tsx`)

**House assignment in existing forms**
- `_authenticated.branch-admin.students.tsx`: add House dropdown in student create/edit
- `_authenticated.branch-admin.teachers.tsx`: add House dropdown in teacher create/edit

### 3. Leaderboard widget (visible to all roles)

Reusable `<HouseLeaderboard branchId=... />` component showing houses sorted by `total_points` with color bars. Embed in:
- Branch admin dashboard
- Student dashboard
- Teacher dashboard
- Parent dashboard (uses linked child's branch)

Subscribes to realtime `UPDATE` on `houses` for live score changes.

### Out of scope
- Bulk member assignment UI (assignment happens in existing student/teacher edit forms per the chosen approach)
- Cross-branch / school-level houses
- House-specific rewards or badges

### Files touched
- `supabase/migrations/<new>.sql` — table, columns, RLS, trigger
- `src/routes/_authenticated.branch-admin.houses.tsx` (new)
- `src/routes/_authenticated.branch-admin.tsx` (nav)
- `src/routes/_authenticated.branch-admin.students.tsx` (house field)
- `src/routes/_authenticated.branch-admin.teachers.tsx` (house field)
- `src/components/HouseLeaderboard.tsx` (new)
- 4 dashboard route files (embed leaderboard)
