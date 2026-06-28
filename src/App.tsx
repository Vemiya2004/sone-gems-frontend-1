import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { queryClient } from "@/lib/queryClient";

// Layout components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import GemsList from "@/pages/GemsList";
import GemDetail from "@/pages/GemDetail";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Profile from "@/pages/Profile";
import ProfileOrders from "@/pages/ProfileOrders";
import ProfileOrderDetail from "@/pages/ProfileOrderDetail";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminAppointments from "@/pages/admin/AdminAppointments";
import AdminMenu from "@/pages/admin/AdminMenu";
import AdminRevenue from "@/pages/admin/AdminRevenue";
import AdminStaff from "@/pages/admin/AdminStaff";
import AdminSettings from "@/pages/admin/AdminSettings";

import NotFound from "@/pages/not-found";

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes (No store layout) */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/appointments" component={AdminAppointments} />
      <Route path="/admin/revenue" component={AdminRevenue} />
      <Route path="/admin/staff" component={AdminStaff} />
      <Route path="/admin/menu" component={AdminMenu} />
      <Route path="/admin/settings" component={AdminSettings} />
      {/* Fallback for other admin routes to dashboard for now */}
      <Route path="/admin/:rest*">
        {() => <AdminDashboard />}
      </Route>

      {/* Store Routes */}
      <Route path="/">
        <StoreLayout><Home /></StoreLayout>
      </Route>
      <Route path="/gems">
        <StoreLayout><GemsList /></StoreLayout>
      </Route>
      <Route path="/gems/:id">
        <StoreLayout><GemDetail /></StoreLayout>
      </Route>
      <Route path="/auth">
        <StoreLayout><Auth /></StoreLayout>
      </Route>
      <Route path="/cart">
        <StoreLayout><Cart /></StoreLayout>
      </Route>
      <Route path="/checkout">
        <StoreLayout><Checkout /></StoreLayout>
      </Route>
      <Route path="/profile">
        <StoreLayout><Profile /></StoreLayout>
      </Route>
      <Route path="/profile/orders">
        <StoreLayout><ProfileOrders /></StoreLayout>
      </Route>
      <Route path="/profile/orders/:id">
        <StoreLayout><ProfileOrderDetail /></StoreLayout>
      </Route>

      {/* Catch-all */}
      <Route>
        <StoreLayout><NotFound /></StoreLayout>
      </Route>
    </Switch>
  );
}

import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <QueryClientProvider client={queryClient}>
        <SettingsProvider>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Router />
                <Toaster />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </SettingsProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;