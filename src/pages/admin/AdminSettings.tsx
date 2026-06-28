import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function AdminSettings() {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/admin");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">System Settings</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Appearance</CardTitle>
            <CardDescription className="text-slate-400">Manage how the admin portal looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-slate-200">Dark Mode</Label>
                <p className="text-sm text-slate-500">Admin portal is permanently in dark mode to reduce eye strain.</p>
              </div>
              <Switch checked disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-100">Developer Contact</CardTitle>
            <CardDescription className="text-slate-400">Technical support and system updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-md border border-slate-800">
              <div className="text-sm font-medium text-slate-200">Replit Agent</div>
              <div className="text-sm text-slate-500 mt-1">v1.0.0 (Latest)</div>
              <div className="text-xs text-slate-600 mt-4">For system issues, please reach out to the development team.</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-slate-400">Irreversible actions and session management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-red-900/30 bg-red-950/10 rounded-md">
              <div>
                <div className="text-sm font-medium text-slate-200">End Session</div>
                <div className="text-sm text-slate-500">Securely log out of the admin portal.</div>
              </div>
              <Button variant="destructive" onClick={handleLogout}>Log Out</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}