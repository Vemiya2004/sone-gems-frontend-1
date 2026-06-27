import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin } from "@workspace/api-client-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [location, setLocation] = useLocation();
  const { login: setAuth } = useAuth();
  const { toast } = useToast();
  const adminLoginMutation = useAdminLogin();

  const [form, setForm] = useState({ 
    username: "Admin@01", 
    password: "" 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLoginMutation.mutate({ data: form }, {
      onSuccess: (res) => {
        setAuth(res.token, res.user);
        toast({ title: "Login successful", description: "Welcome to the admin panel." });
        setLocation("/admin/dashboard");
      },
      onError: (err) => {
        toast({ title: "Access Denied", description: err.message || "Invalid credentials", variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-amber-500" />
          </div>
          <CardTitle className="font-serif text-2xl font-bold text-white">WG Admin Portal</CardTitle>
          <CardDescription className="text-slate-400">Secure access for staff only</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input 
                id="username" 
                className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500"
                required 
                value={form.username}
                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input 
                id="password" 
                type="password" 
                className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-amber-500"
                required 
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-4" 
              disabled={adminLoginMutation.isPending}
            >
              {adminLoginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}