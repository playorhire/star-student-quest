

# Student Rewards App — Lovable Cloud + Parent Features

## Overview

Migrate from mock data to Lovable Cloud (Supabase) for real auth, persistent storage, and RLS. Add a new **Parent** role with email notifications and a parent-teacher messaging system.

## Phase 1: Enable Lovable Cloud & Database Schema

### Tables to create (via migrations)

1. **user_roles** — `user_id (uuid, FK auth.users)`, `role (app_role enum: admin, teacher, student, parent)`
2. **classes** — `id, name, created_at`
3. **sections** — `id, name, class_id (FK classes)`
4. **students** — `id, user_id (FK auth.users, nullable for admin-created), name, roll_number, class_id, section_id, qr_code (uuid), total_points, avatar_emoji`
5. **subjects** — `id, name, class_id`
6. **point_rules** — `id, subject_id, passing_marks, multiplier`
7. **teachers** — `id, user_id (FK auth.users), name, email`
8. **teacher_assignments** — `id, teacher_id, class_id, subject_id`
9. **point_transactions** — `id, student_id, teacher_id, subject_id, marks_entered, passing_marks, multiplier, points_awarded, created_at`
10. **badges** — `id, name, description, emoji, required_points`
11. **rewards** — `id, name, description, emoji, point_cost, stock, category`
12. **redemptions** — `id, student_id, reward_id, points_spent, status (pending/fulfilled), created_at`
13. **parent_student_links** — `id, parent_user_id (FK auth.users), student_id (FK students)` — links parents to their children
14. **messages** — `id, sender_id (FK auth.users), receiver_id (FK auth.users), student_id (FK students, nullable), content, read, created_at` — parent-teacher messaging
15. **notifications** — `id, user_id (FK auth.users), title, body, read, created_at` — in-app notification log

### Security

- `has_role()` SECURITY DEFINER function for RLS policies
- RLS on all tables scoped by role (admins see all, teachers see assigned classes, students see own data, parents see linked children)
- Parent notifications: when a point_transaction is inserted, a database trigger (or app-level logic) creates a notification row and optionally sends an email

## Phase 2: Authentication

- Replace mock auth context with real Supabase Auth (email/password)
- Update `_authenticated.tsx` to check Supabase session + role from `user_roles`
- Update login page to use `supabase.auth.signInWithPassword()`
- Admin creates accounts for teachers/students/parents (or invite flow)
- Role-based redirects after login

## Phase 3: Parent Role & Routes

### New routes
- `/parent/dashboard` — see linked children's points, recent activity
- `/parent/messages` — messaging interface with teachers
- `/parent/notifications` — notification feed

### Parent layout
- Bottom nav: Dashboard, Messages, Notifications
- Header with child selector (if multiple children linked)

## Phase 4: Notification System

- **In-app**: `notifications` table, queried on parent dashboard, unread badge count
- **Email**: When points are awarded, trigger an email to parent: "Your child [name] earned [X] points in [subject] today"
- Email sending via Lovable's built-in email infrastructure (requires email domain setup)

## Phase 5: Parent-Teacher Messaging

- Simple 1:1 messaging between parents and teachers of linked students
- Messages table with sender/receiver and optional student context
- Real-time updates via Supabase Realtime subscriptions
- Unread message count badges in nav

## Phase 6: Migrate Existing Features

- Replace all `mock-data.ts` imports with Supabase queries
- Admin CRUD operations become real inserts/updates/deletes
- Teacher scan flow writes to `point_transactions` table
- Student dashboard reads from real tables
- CSV import inserts into real tables

## Implementation Order

1. Enable Lovable Cloud, create database schema + RLS + seed data
2. Set up Supabase client files and auth middleware
3. Replace auth context with Supabase Auth
4. Migrate admin panel to real DB queries
5. Migrate teacher and student flows to real DB
6. Add parent role, routes, and dashboard
7. Add messaging system
8. Set up email notifications for parents

## Technical Notes

- All Supabase clients follow the three-client pattern (browser, auth-middleware, admin)
- RLS policies use `has_role()` security definer function to avoid recursion
- Messages use Supabase Realtime for live updates
- Email notifications use Lovable's built-in email infrastructure (email domain setup required)
- No edge functions needed — all server logic via TanStack Start server functions

