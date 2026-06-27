import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateUser } from "@workspace/api-client-react";
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const updateUserMutation = useUpdateUser();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: ""
  });

  const initializedRef = useRef(false);

  useEffect(() => {
    if (user && !initializedRef.current) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        username: user.username || ""
      });
      initializedRef.current = true;
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate({ data: formData }, {
      onSuccess: (updatedUser) => {
        // Need to preserve token, update user
        const token = localStorage.getItem("wg_token");
        if (token) {
          login(token, updatedUser);
        }
        toast({ title: "Profile updated", description: "Your details have been saved successfully." });
      },
      onError: (err) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <ProfileLayout>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Personal Information</CardTitle>
          <CardDescription>Update your account details and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={formData.username}
                onChange={e => setFormData(f => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button type="submit" disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}