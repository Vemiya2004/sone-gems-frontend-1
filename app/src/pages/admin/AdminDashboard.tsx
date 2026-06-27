import React from "react";
import { Link } from "wouter";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/formatters";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#64748b'];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 bg-slate-800" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] bg-slate-800" />
          <Skeleton className="h-[400px] bg-slate-800" />
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return <AdminLayout><div>Error loading dashboard</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Today</Badge>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Revenue Today</h3>
            <div className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(stats.todayRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-500" />
              </div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Today</Badge>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Orders Today</h3>
            <div className="text-2xl font-bold text-slate-100 mt-1">{stats.todayOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
              <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800">This Week</Badge>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Weekly Revenue</h3>
            <div className="text-2xl font-bold text-slate-100 mt-1">{formatCurrency(stats.thisWeekRevenue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-500" />
              </div>
              <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-800">Total</Badge>
            </div>
            <h3 className="text-slate-400 text-sm font-medium">Total Orders</h3>
            <div className="text-2xl font-bold text-slate-100 mt-1">{stats.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {stats.chartData && stats.chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs ${value/1000}k`} />
                    <Tooltip 
                      cursor={{ fill: '#1e293b' }} 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">No chart data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(stats.recentOrders) && stats.recentOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-mono text-sm text-slate-300">{order.orderId}</div>
                    <div className="text-xs text-slate-500 mt-1">{order.userName || 'Guest'} • {order.items.length} items</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-200">{formatCurrency(order.total)}</div>
                    <div className={`text-xs mt-1 ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
              {(!stats.recentOrders || stats.recentOrders.length === 0) && (
                <div className="text-center text-slate-500 py-8">No recent orders</div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800 text-center">
              <Link href="/admin/orders" className="text-sm text-amber-500 hover:text-amber-400">View All Orders</Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </AdminLayout>
  );
}

// Adding missing imports
import { Badge } from "@/components/ui/badge";