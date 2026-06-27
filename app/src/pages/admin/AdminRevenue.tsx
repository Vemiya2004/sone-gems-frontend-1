import React, { useState } from "react";
import { useGetRevenue } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function AdminRevenue() {
  const [period, setPeriod] = useState<"today" | "week" | "month" | "year">("month");
  const { data: revenue, isLoading } = useGetRevenue({ period });

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Revenue Management</h1>
        <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
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
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-32 bg-slate-800" />)}
        </div>
      ) : revenue ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium">Total Revenue (All Time)</h3>
                <DollarSign className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold text-slate-100">{formatCurrency(revenue.total)}</div>
              <div className="text-sm text-slate-500 mt-2">Lifetime earnings</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium">Today</h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-500 rounded-full">Daily</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{formatCurrency(revenue.today)}</div>
              {revenue.previousDay !== undefined && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {revenue.today >= revenue.previousDay ? (
                    <><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Up from yesterday</span></>
                  ) : (
                    <><TrendingDown className="h-4 w-4 text-red-500" /><span className="text-red-500">Down from yesterday</span></>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium">This Week</h3>
                <span className="text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-500 rounded-full">Weekly</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{formatCurrency(revenue.thisWeek)}</div>
              {revenue.previousWeek !== undefined && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {revenue.thisWeek >= revenue.previousWeek ? (
                    <><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Up from last week</span></>
                  ) : (
                    <><TrendingDown className="h-4 w-4 text-red-500" /><span className="text-red-500">Down from last week</span></>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-emerald-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium">This Month</h3>
                <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Monthly</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{formatCurrency(revenue.thisMonth)}</div>
              {revenue.previousMonth !== undefined && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {revenue.thisMonth >= revenue.previousMonth ? (
                    <><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Up from last month</span></>
                  ) : (
                    <><TrendingDown className="h-4 w-4 text-red-500" /><span className="text-red-500">Down from last month</span></>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-rose-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-400 font-medium">This Year</h3>
                <span className="text-xs font-medium px-2 py-1 bg-rose-500/10 text-rose-500 rounded-full">Yearly</span>
              </div>
              <div className="text-3xl font-bold text-slate-100">{formatCurrency(revenue.thisYear)}</div>
              {revenue.previousYear !== undefined && (
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {revenue.thisYear >= revenue.previousYear ? (
                    <><TrendingUp className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Up from last year</span></>
                  ) : (
                    <><TrendingDown className="h-4 w-4 text-red-500" /><span className="text-red-500">Down from last year</span></>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </AdminLayout>
  );
}