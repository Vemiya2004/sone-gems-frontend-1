import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, ShoppingBag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const navItems = [
    { label: "Profile Details", path: "/profile", icon: User },
    { label: "My Orders", path: "/profile/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden sticky top-24">
              <div className="p-6 border-b border-border/50 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-serif font-bold mb-4">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <h2 className="font-medium text-lg">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <span className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 mt-4 px-4"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}