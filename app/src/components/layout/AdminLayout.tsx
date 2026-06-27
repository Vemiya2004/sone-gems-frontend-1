import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useListOrders } from "@workspace/api-client-react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  PieChart, 
  Users, 
  MenuSquare, 
  Settings,
  LogOut,
  CalendarDays
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();
  const { data: orders } = useListOrders();

  const unreadOrdersCount = orders?.filter(o => !o.isRead && o.pickupType !== "appointment").length || 0;
  const unreadAppointmentsCount = orders?.filter(o => !o.isRead && o.pickupType === "appointment").length || 0;

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Orders", path: "/admin/orders", icon: ShoppingBag, badge: unreadOrdersCount },
    { label: "Appointments", path: "/admin/appointments", icon: CalendarDays, badge: unreadAppointmentsCount },
    { label: "Revenue", path: "/admin/revenue", icon: BarChart3 },
    { label: "Analytics", path: "/admin/analytics", icon: PieChart },
    { label: "Staff", path: "/admin/staff", icon: Users },
    { label: "Menu & Catalog", path: "/admin/menu", icon: MenuSquare },
    { label: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <span className="font-serif text-xl font-bold tracking-tight text-amber-500">WG Admin</span>
          </Link>
        </div>
        
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 font-medium">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <div className="font-medium text-sm text-slate-200">{user?.name}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || location.startsWith(item.path + "/");
            return (
              <Link key={item.path} href={item.path}>
                <span className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-amber-500/10 text-amber-500' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}>
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {!!item.badge && item.badge > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-400/10 px-3"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-slate-900/50 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-8 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-200 capitalize">
            {location.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link href="/">View Store</Link>
            </Button>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}