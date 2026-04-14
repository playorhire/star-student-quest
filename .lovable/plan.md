

# Student Rewards App — Core Flow First

## Approach

Build the core rewards flow as a **fully functional frontend with mock data** first, since Supabase is not yet connected. This lets you see and interact with the entire QR scanning, point assignment, and student dashboard flow immediately. We will wire up the real database in a follow-up step.

## What Gets Built

### 1. Playful Theme & Layout
- Update CSS variables to a bright, playful palette (vibrant purple primary, warm orange accents, soft rounded corners)
- Shared layout component with colorful header, role indicator, and navigation
- Mobile-first responsive design

### 2. Auth & Role Simulation (Mock)
- Simple login page where you pick a role (Teacher or Student) to test each flow
- Auth context that stores selected role in state
- Role-based route guards using `_authenticated` layout pattern

### 3. Teacher Flow (3 routes)
- **`/teacher/dashboard`** — Overview of recent point assignments, assigned classes
- **`/teacher/scan`** — Browser camera QR scanner using `html5-qrcode`. Scans a student QR code, shows student info, lets teacher select subject, enter marks. Auto-calculates points: `(marks - passing_marks) × multiplier` (only if marks >= passing). Confirm and assign with confetti animation
- **`/teacher/history`** — List of past point assignments with filters

### 4. Student Flow (4 routes)
- **`/student/dashboard`** — Animated total points counter, recent activity feed, earned badges, progress bar to next badge
- **`/student/qr`** — Full-screen QR code display (student ID card) using `qrcode.react`
- **`/student/history`** — Transaction history with subject breakdown
- **`/student/rewards`** — Browse rewards marketplace, redeem points, view redemption status

### 5. Shared Components
- `PointCounter` — Animated number counter
- `BadgeCard` — Badge display with unlock state
- `LeaderboardTable` — Class rankings
- `RewardCard` — Marketplace item card

## New Dependencies
- `html5-qrcode` — Browser camera QR scanning
- `qrcode.react` — QR code generation
- `canvas-confetti` — Confetti animation on point assignment

## Route Structure
```text
src/routes/
  login.tsx                              → /login
  _authenticated.tsx                     → auth guard layout
  _authenticated/_teacher.tsx            → teacher layout
  _authenticated/_teacher/dashboard.tsx  → /teacher/dashboard
  _authenticated/_teacher/scan.tsx       → /teacher/scan
  _authenticated/_teacher/history.tsx    → /teacher/history
  _authenticated/_student.tsx            → student layout
  _authenticated/_student/dashboard.tsx  → /student/dashboard
  _authenticated/_student/qr.tsx         → /student/qr
  _authenticated/_student/history.tsx    → /student/history
  _authenticated/_student/rewards.tsx    → /student/rewards
```

## Mock Data
All data (students, subjects, point rules, transactions, rewards, badges) will be defined in `src/lib/mock-data.ts` so everything works without a database. This file will be swapped for real Supabase queries later.

## Implementation Order
1. Install dependencies, set up playful theme colors
2. Create auth context + login page with role picker
3. Create layout routes with navigation
4. Build teacher scan flow (QR scanner + point calculator)
5. Build student dashboard (points, QR card, badges)
6. Build rewards marketplace
7. Add leaderboard and history views

