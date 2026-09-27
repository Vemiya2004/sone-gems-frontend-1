export interface AdminNavConfig {
  label: string;
  path: string;
  permission: string;
}

export const ADMIN_NAV_CONFIG: AdminNavConfig[] = [
  { label: "Dashboard", path: "/admin/dashboard", permission: "dashboard" },
  { label: "Orders", path: "/admin/orders", permission: "orders" },
  { label: "Appointments", path: "/admin/appointments", permission: "orders" },
  { label: "Revenue", path: "/admin/revenue", permission: "revenue" },
  { label: "Analytics", path: "/admin/analytics", permission: "analytics" },
  { label: "Staff", path: "/admin/staff", permission: "staff" },
  { label: "Menu & Catalog", path: "/admin/menu", permission: "menu" },
  { label: "Settings", path: "/admin/settings", permission: "settings" },
];

// admin කෙනෙක්ට හැම permission එකක්ම default තියෙනවා.
export function hasAdminPermission(isAdmin: boolean, permissions: string[], permission: string): boolean {
  return isAdmin || permissions.includes(permission);
}

// login උනාට පස්සේ, හෝ permission නැති page එකකට ගියොත්, redirect කරන්න පුළුවන් පළමු page එක සොයාගන්නවා.
export function getFirstAllowedAdminPath(isAdmin: boolean, permissions: string[]): string {
  if (isAdmin) return "/admin/dashboard";
  const match = ADMIN_NAV_CONFIG.find((item) => permissions.includes(item.permission));
  return match ? match.path : "/admin";
}