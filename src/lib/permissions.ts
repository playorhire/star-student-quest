export type TenantRole =
  | "super_admin"
  | "school_admin"
  | "branch_admin"
  | "teacher"
  | "student"
  | "parent";

export const ROLES: { key: TenantRole; label: string }[] = [
  { key: "super_admin", label: "Super Admin" },
  { key: "school_admin", label: "School Admin" },
  { key: "branch_admin", label: "Branch Admin" },
  { key: "teacher", label: "Teacher" },
  { key: "student", label: "Student" },
  { key: "parent", label: "Parent" },
];

export type Feature = { key: string; label: string; section: string };

export const FEATURES: Feature[] = [
  { section: "General", key: "dashboard.view", label: "View dashboard" },
  { section: "General", key: "profile.edit", label: "Edit own profile" },
  { section: "General", key: "notifications.view", label: "View notifications" },

  { section: "Organization", key: "schools.manage", label: "Manage schools" },
  { section: "Organization", key: "branches.manage", label: "Manage branches" },
  { section: "Organization", key: "school_admins.manage", label: "Manage school admins" },
  { section: "Organization", key: "branch_admins.manage", label: "Manage branch admins" },

  { section: "People", key: "teachers.manage", label: "Manage teachers" },
  { section: "People", key: "teachers.view", label: "View teachers" },
  { section: "People", key: "students.manage", label: "Manage students" },
  { section: "People", key: "students.view", label: "View students" },
  { section: "People", key: "parents.manage", label: "Manage parents" },
  { section: "People", key: "parents.view", label: "View parents" },

  { section: "Academics", key: "classes.manage", label: "Manage classes" },
  { section: "Academics", key: "classes.view", label: "View classes" },
  { section: "Academics", key: "houses.manage", label: "Manage houses" },
  { section: "Academics", key: "houses.view", label: "View houses" },

  { section: "Rewards & Points", key: "badges.manage", label: "Manage badges" },
  { section: "Rewards & Points", key: "badges.view", label: "View badges" },
  { section: "Rewards & Points", key: "rewards.manage", label: "Manage rewards" },
  { section: "Rewards & Points", key: "rewards.view", label: "View rewards" },
  { section: "Rewards & Points", key: "rewards.redeem", label: "Redeem rewards" },
  { section: "Rewards & Points", key: "point_rules.manage", label: "Manage point rules" },
  { section: "Rewards & Points", key: "points.award", label: "Award points" },
  { section: "Rewards & Points", key: "points.view_own", label: "View own points" },
  { section: "Rewards & Points", key: "points.view_history", label: "View points history" },

  { section: "Tools", key: "qr.scan", label: "Scan QR (teacher)" },
  { section: "Tools", key: "qr.show", label: "Show QR (student)" },
  { section: "Tools", key: "messages.send", label: "Send messages" },
  { section: "Tools", key: "messages.view", label: "View messages" },
  { section: "Tools", key: "reports.view", label: "View reports" },
  { section: "Tools", key: "settings.manage", label: "Manage settings" },
];

export const FEATURE_SECTIONS = Array.from(
  new Set(FEATURES.map((f) => f.section))
);