# Vendor Marketplace Module

Adds a full vendor marketplace to StarPoints so vendors can list products, Super Admin curates which schools see them, and students redeem with points via voucher codes.

## Scope

- New `vendor` tenant role + Vendor Portal (`/vendor/*`)
- Vendor onboarding by Super Admin only
- Vendor products with images (Supabase Storage)
- Super-Admin-controlled product-to-school assignment
- Student redemption flow with voucher + vendor collection
- Notifications, dashboard widgets, search/filter, RLS end-to-end

## Database (migration)

New enum value: `vendor` added to `public.tenant_role`.

New Storage bucket: `vendor-assets` (public read, authenticated write) for logos + product images.

New tables (all with `service_role` grants, `authenticated` grants, RLS enabled, `updated_at` trigger):

1. `vendors` — `id, user_id (auth.users), shop_name, owner_name, email, phone, address, city, logo_url, status ('active'|'inactive'|'suspended'), created_at, updated_at`
2. `vendor_products` — `id, vendor_id, product_name, description, category (enum), image_urls text[], cash_price numeric, required_points int, stock_quantity int, is_active bool, admin_status ('pending'|'approved'|'rejected'), created_at, updated_at`
3. `vendor_product_schools` — `id, product_id, school_id, approved bool, approved_by, approved_at` (unique on product_id+school_id)
4. `reward_redemptions` — `id, student_id, product_id, vendor_id, school_id, points_used, status ('pending'|'approved'|'collected'|'cancelled'), voucher_code (unique, 10-char), expires_at, redeemed_at, collected_at, created_at`

New enum: `product_category` (Books, Stationery, SchoolBags, WaterBottles, LunchBoxes, Toys, Sports, GiftCards, Electronics, Others).

New security-definer helpers:
- `is_vendor_safe()` — current user is vendor
- `get_my_vendor_id()` — vendor row id for current user
- `generate_voucher_code()` — random 10-char alphanumeric, unique
- `redeem_vendor_product(p_student_id, p_product_id)` — atomic points check, stock decrement, redemption insert, voucher gen, notifications

### RLS summary (plain English)

- `vendors`: super_admin full; vendor sees/edits own row (limited columns); school_admin read-only for vendors with approved products in their school.
- `vendor_products`: super_admin full; vendor CRUD own products; students & school users SELECT only via approved school assignment + `is_active` + `stock > 0` (via a view or policy joining `vendor_product_schools`).
- `vendor_product_schools`: super_admin full; vendors read own; school users read own school.
- `reward_redemptions`: super_admin full; student sees own; vendor sees own; school_admin/branch_admin read own school.

## Backend server functions (`src/lib/vendor.functions.ts`)

All auth-gated via `requireSupabaseAuth`, role-checked with `has_role`/`get_my_primary_role`:

- `createVendor` (super_admin) — creates auth user, inserts vendor + user_roles row
- `updateVendorStatus`, `resetVendorPassword` (super_admin)
- `adminSetProductApproval`, `adminAssignProductToSchools` (super_admin)
- `listVendorProducts`, `upsertVendorProduct`, `deleteVendorProduct` (vendor)
- `listStudentMarketplace(schoolId, filters)` (student)
- `redeemProduct(productId)` (student) — calls `redeem_vendor_product` RPC
- `verifyVoucher(code)`, `collectVoucher(code)` (vendor)
- `vendorDashboardStats`, `vendorMonthlyRedemptions` (vendor)

## Frontend routes

Vendor portal (mirrors existing super-admin layout pattern):
- `src/routes/_authenticated.vendor.tsx` — layout + gate on `role === 'vendor'`, bottom nav (Dashboard, Products, Orders, Redeemed, Profile)
- `_authenticated.vendor.dashboard.tsx` — stat cards + monthly chart (recharts) + top products
- `_authenticated.vendor.products.tsx` — list + add/edit dialog with multi-image upload
- `_authenticated.vendor.orders.tsx` — pending/approved redemptions
- `_authenticated.vendor.redeemed.tsx` — voucher input + QR scanner (reuse existing scan component) → verify + collect
- `_authenticated.vendor.profile.tsx`

Super Admin additions:
- `_authenticated.super-admin.vendors.tsx` — list, create, suspend, reset password
- `_authenticated.super-admin.vendor-products.tsx` — approve/reject + "Assign to Schools" dialog (multi-select schools with checkboxes)
- Add "Vendors" nav item to `_authenticated.super-admin.tsx`

Student additions (integrate into existing rewards page, don't replace existing internal rewards):
- Extend `_authenticated.student.rewards.tsx` with a "Marketplace" tab showing vendor products filtered by student's school + approved + in-stock, with search + category + sort filters, Redeem button
- Extend `_authenticated.student.history.tsx` to include reward redemptions with voucher + status

## Notifications

Reuse existing `create_notification` function. Triggers on `reward_redemptions`:
- On insert → notify vendor ("New redemption request") + student ("Redemption pending")
- On status → 'approved' → notify student ("Reward approved, voucher ready")
- On status → 'collected' → notify student ("Reward collected")

School admin daily summary: pg_cron job hitting `/api/public/hooks/redemption-summary` (deferred — noted as follow-up; not in initial migration unless requested now).

## Shared bits

- `src/lib/vendor-categories.ts` — category enum + labels
- `src/components/VendorProductCard.tsx`, `VendorProductForm.tsx`, `VoucherDisplay.tsx`, `ImageUploader.tsx` (multi-image)
- Loading skeletons, sonner toasts, shadcn AlertDialog confirmations
- TanStack Query for all reads; mutations invalidate relevant keys

## Auth & role wiring

- Add `vendor` to `TenantRole` in `src/lib/permissions.ts` + `auth-context`
- Post-login routing: `vendor` → `/vendor/dashboard`
- Feature keys added for vendor permissions in `permissions.ts`

## Out of scope for this iteration (call out to user)

- QR code image generation for vouchers (voucher code text + manual entry ships; QR scan reuses existing teacher scanner if it fits, otherwise text input only)
- Daily digest cron for school admins (schema supports it; cron job can follow)
- Payment/cash flow — `cash_price` is display only

## Deliverables order

1. Migration (enum + tables + RLS + helpers + RPC + storage bucket)
2. `vendor.functions.ts` server functions
3. Vendor portal routes + layout
4. Super Admin vendor management routes + nav
5. Student marketplace tab + history extension
6. Notifications trigger
7. Types regen + polish
