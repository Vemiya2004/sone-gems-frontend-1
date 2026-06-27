import React, { useState } from "react";
import { useListStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Plus, Edit, Trash2, Loader2, UserCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ALL_PERMISSIONS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orders", label: "Orders" },
  { id: "revenue", label: "Revenue" },
  { id: "analytics", label: "Analytics" },
  { id: "staff", label: "Staff" },
  { id: "menu", label: "Menu & Catalog" },
  { id: "settings", label: "Settings" },
];

export default function AdminStaff() {
  const { data: staff, isLoading, refetch } = useListStaff();
  const createStaffMutation = useCreateStaff();
  const updateStaffMutation = useUpdateStaff();
  const deleteStaffMutation = useDeleteStaff();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultForm = {
    username: "",
    password: "",
    role: "staff",
    loginTimeStart: "08:00",
    loginTimeEnd: "18:00",
    permissions: [] as string[],
  };

  const [form, setForm] = useState(defaultForm);

  const togglePermission = (id: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(id)
        ? f.permissions.filter(p => p !== id)
        : [...f.permissions, id],
    }));
  };

  const selectAllPermissions = () => {
    setForm(f => ({ ...f, permissions: ALL_PERMISSIONS.map(p => p.id) }));
  };

  const clearAllPermissions = () => {
    setForm(f => ({ ...f, permissions: [] }));
  };

  const handleOpenEdit = (s: any) => {
    setEditingId(s.id);
    setForm({
      username: s.username,
      password: "",
      role: s.role,
      loginTimeStart: s.loginTimeStart || "08:00",
      loginTimeEnd: s.loginTimeEnd || "18:00",
      permissions: s.permissions || [],
    });
    setIsOpen(true);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setForm(defaultForm);
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };

    if (editingId) {
      updateStaffMutation.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Staff updated successfully" });
          setIsOpen(false);
          refetch();
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    } else {
      createStaffMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Staff created successfully" });
          setIsOpen(false);
          refetch();
        },
        onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this staff member? This action cannot be undone.")) {
      deleteStaffMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Staff deleted" });
          refetch();
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Staff Management</h1>
          <p className="text-slate-400 mt-1">Control admin and staff access and permissions</p>
        </div>

        <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Staff
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Allowed Hours</th>
                  <th className="px-6 py-4">Permissions</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={6} className="px-6 py-4"><Skeleton className="h-10 bg-slate-800" /></td></tr>
                  ))
                ) : staff && staff.length > 0 ? (
                  staff.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <UserCircle className="h-8 w-8 text-slate-500" />
                          <span className="font-medium text-slate-200">{s.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {s.role === 'admin' ? (
                          <span className="flex items-center text-amber-500 font-medium">
                            <Shield className="h-3 w-3 mr-1" /> Admin
                          </span>
                        ) : (
                          <span className="text-blue-400">Staff</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {s.loginTimeStart && s.loginTimeEnd ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3 w-3" />
                            {s.loginTimeStart} – {s.loginTimeEnd}
                          </div>
                        ) : '24/7 Access'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(s.permissions || []).length === 0 ? (
                            <span className="text-slate-600 text-xs">None</span>
                          ) : (s.permissions as string[]).map((p: string) => (
                            <Badge key={p} variant="outline" className="text-[10px] px-1.5 py-0 border-slate-700 text-slate-400">
                              {ALL_PERMISSIONS.find(x => x.id === p)?.label || p}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ''}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleOpenEdit(s)}>
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Staff Member" : "Add New Staff"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input required value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} className="bg-slate-950 border-slate-800" />
            </div>
            <div className="space-y-2">
              <Label>
                Password{" "}
                {editingId && <span className="text-slate-500 text-xs">(leave blank to keep unchanged)</span>}
              </Label>
              <Input type="password" required={!editingId} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="bg-slate-950 border-slate-800" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
                <SelectTrigger className="bg-slate-950 border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Login Start Time</Label>
                <Input type="time" value={form.loginTimeStart} onChange={e => setForm(f => ({ ...f, loginTimeStart: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Login End Time</Label>
                <Input type="time" value={form.loginTimeEnd} onChange={e => setForm(f => ({ ...f, loginTimeEnd: e.target.value }))} className="bg-slate-950 border-slate-800" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <div className="flex gap-2">
                  <button type="button" onClick={selectAllPermissions} className="text-xs text-blue-400 hover:underline">Select all</button>
                  <span className="text-slate-600">·</span>
                  <button type="button" onClick={clearAllPermissions} className="text-xs text-slate-500 hover:underline">Clear</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 rounded-md p-3 border border-slate-800">
                {ALL_PERMISSIONS.map(perm => (
                  <div key={perm.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`perm-${perm.id}`}
                      checked={form.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      className="border-slate-600 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <label htmlFor={`perm-${perm.id}`} className="text-sm text-slate-300 cursor-pointer">
                      {perm.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={createStaffMutation.isPending || updateStaffMutation.isPending}>
              {(createStaffMutation.isPending || updateStaffMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingId ? "Update Staff" : "Create Staff"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
