import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year">("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", period, dateRange],
    queryFn: async () => {
      const token = localStorage.getItem("wg_token") || "";
      const baseUrl = import.meta.env.VITE_API_URL || "https://sone-gems-backend.onrender.com";
      let url = `${baseUrl}/api/analytics?period=${period}`;
      if (dateRange?.from && dateRange?.to) {
        url += `&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      }
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Failed to load analytics");
      return res.json();
    }
  });

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Analytics</h1>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(val: any) => { setPeriod(val); setDateRange(undefined); }}>
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800 text-slate-200">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] bg-slate-800" />
          <Skeleton className="h-[400px] bg-slate-800" />
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-slate-400 text-sm font-medium">Total Revenue</h3>
                <div className="text-3xl font-bold text-amber-500 mt-2">{formatCurrency(data.totalRevenue || 0)}</div>
                {data.comparison && data.comparison.revenueChange !== undefined && (
                  <div className={`text-sm mt-2 flex items-center ${data.comparison.revenueChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.comparison.revenueChange >= 0 ? '+' : ''}{data.comparison.revenueChange}% vs previous
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-slate-400 text-sm font-medium">Total Orders</h3>
                <div className="text-3xl font-bold text-blue-500 mt-2">{data.totalOrders || 0}</div>
                {data.comparison && data.comparison.ordersChange !== undefined && (
                  <div className={`text-sm mt-2 flex items-center ${data.comparison.ordersChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.comparison.ordersChange >= 0 ? '+' : ''}{data.comparison.ordersChange}% vs previous
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <h3 className="text-slate-400 text-sm font-medium">Average Order Value</h3>
                <div className="text-3xl font-bold text-purple-500 mt-2">
                  {data.totalOrders ? formatCurrency((data.totalRevenue || 0) / data.totalOrders) : formatCurrency(0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs${v/1000}k`} />
                      <Tooltip 
                        cursor={{ fill: '#1e293b' }} 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {data.categorySales && data.categorySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categorySales}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="category"
                        >
                          {data.categorySales.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                          formatter={(value: number) => [formatCurrency(value), 'Sales']}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500">No category sales data</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
}