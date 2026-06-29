import React, { useState } from "react";
import { useMarkOrderPaid, useUpdateOrder } from "@/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, Clock, Package, MapPin, CreditCard, Truck, Store, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";

function PaymentMethodIcon({ method }: { method: string }) {
  if (method === "pay_on_delivery") return <Truck className="h-4 w-4" />;
  if (method === "card") return <CreditCard className="h-4 w-4" />;
  return <Store className="h-4 w-4" />;
}

function PaymentMethodLabel({ method }: { method: string }) {
  if (method === "pay_on_delivery") return "Pay on Delivery";
  if (method === "card") return "Card (Shop Pickup)";
  if (method === "shop") return "Buy at Shop";
  return method;
}

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["orders", search, statusTab, dateRange],
    queryFn: async () => {
      const token = localStorage.getItem("wg_token") || "";
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusTab !== "all") params.append("status", statusTab);
      if (dateRange?.from) params.append("startDate", dateRange.from.toISOString());
      if (dateRange?.to) params.append("endDate", dateRange.to.toISOString());
      
      const res = await fetch(`${baseUrl}/api/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to load orders");
      return res.json();
    }
  });

  const markPaidMutation = useMarkOrderPaid();
  const updateOrderMutation = useUpdateOrder();
  const queryClient = useQueryClient();

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("wg_token") || "";
      const res = await fetch(`${baseUrl}/api/orders/${id}/read`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } 
      });
      if (!res.ok) throw new Error("Failed to mark read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      refetch();
    }
  });

  const handleViewOrder = (order: any) => {
    setViewOrder(order);
    if (!order.isRead) {
      markReadMutation.mutate(order.id);
    }
  };

  const handleMarkPaid = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markPaidMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Order marked as paid" });
        refetch();
        if (viewOrder?.id === id) setViewOrder((o: any) => ({ ...o, isPaid: true, status: "confirmed" }));
      }
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateOrderMutation.mutate({ id, data: { status } }, {
      onSuccess: (updated) => {
        toast({ title: "Status updated" });
        refetch();
        if (viewOrder?.id === id) setViewOrder(updated);
      }
    });
  };

  const sd = viewOrder?.shippingDetails;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-100">Orders Management</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          <form onSubmit={e => { e.preventDefault(); refetch(); }} className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search Order ID..."
              className="pl-9 bg-slate-900 border-slate-800 text-slate-200"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-800">
            <Tabs value={statusTab} onValueChange={setStatusTab}>
              <TabsList className="bg-slate-950 border border-slate-800">
                {["all", "processing", "confirmed", "shipped", "delivered", "rejected"].map(s => (
                  <TabsTrigger key={s} value={s} className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-100 capitalize">
                    {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Order ID / Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={7} className="px-6 py-4"><Skeleton className="h-10 bg-slate-800" /></td></tr>
                  ))
                ) : orders && orders.filter(o => o.pickupType !== "appointment").length > 0 ? (
                  orders.filter(o => o.pickupType !== "appointment").map(order => (
                    <tr key={order.id} className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${!order.isRead ? 'bg-slate-800/20' : ''}`} onClick={() => handleViewOrder(order)}>
                      <td className="px-6 py-4 relative">
                        {!order.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" title="New unread order" />}
                        <div className="font-mono font-medium text-amber-500">{order.orderId}</div>
                        <div className="text-xs text-slate-500 mt-1">{formatDateTime(order.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        <div>{order.userName || 'Guest'}</div>
                        <div className="text-xs text-slate-500">{order.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">{formatCurrency(order.total)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <PaymentMethodIcon method={order.paymentMethod} />
                          <PaymentMethodLabel method={order.paymentMethod} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${order.status === 'processing' ? 'text-blue-400 border-blue-400/30' : ''}
                          ${order.status === 'confirmed' ? 'text-emerald-400 border-emerald-400/30' : ''}
                          ${order.status === 'shipped' ? 'text-purple-400 border-purple-400/30' : ''}
                          ${order.status === 'delivered' ? 'text-green-400 border-green-400/30' : ''}
                          ${order.status === 'rejected' ? 'text-red-400 border-red-400/30' : ''}
                        `}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {order.isPaid ? (
                          <div className="flex items-center text-emerald-400 text-xs"><CheckCircle className="h-3 w-3 mr-1" /> Paid</div>
                        ) : (
                          <div className="flex items-center text-amber-400 text-xs"><Clock className="h-3 w-3 mr-1" /> Pending</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2" onClick={e => e.stopPropagation()}>
                        {!order.isPaid && (
                          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 h-8" onClick={(e) => handleMarkPaid(order.id, e)}>
                            Mark Paid
                          </Button>
                        )}
                        <Button size="sm" className="bg-slate-800 hover:bg-slate-700 text-slate-200 h-8" onClick={() => handleViewOrder(order)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Package className="h-5 w-5 text-amber-500" />
              <span>Order Details</span>
              <span className="font-mono text-amber-500 text-base ml-auto">{viewOrder?.orderId}</span>
            </DialogTitle>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-6 mt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Date</p>
                  <p>{formatDateTime(viewOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Payment</p>
                  <div className="flex items-center gap-1.5">
                    <PaymentMethodIcon method={viewOrder.paymentMethod} />
                    <PaymentMethodLabel method={viewOrder.paymentMethod} />
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Payment Status</p>
                  {viewOrder.isPaid ? (
                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Paid</span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</span>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-2">Order Status</p>
                  <Select value={viewOrder.status} onValueChange={(val) => handleStatusChange(viewOrder.id, val)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                      {["processing", "confirmed", "shipped", "delivered", "rejected"].map(s => (
                        <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="border-slate-800" />

              {sd && (
                <div>
                  <h3 className="font-semibold text-sm text-slate-300 mb-3">Customer Details</h3>
                  <div className="bg-slate-800/50 rounded-md p-4 text-sm space-y-1">
                    <p className="font-medium text-slate-100">{sd.fullName}</p>
                    <p className="text-slate-400">{sd.email}</p>
                    <p className="text-slate-400">{sd.phone1}{sd.phone2 && ` / ${sd.phone2}`}</p>
                    {sd.whatsapp && <p className="text-slate-400">WhatsApp: {sd.whatsapp}</p>}
                    {sd.address && (
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <div className="flex items-start gap-1.5 text-slate-400">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          <div>
                            <p>{sd.address}{sd.addressLine2 && `, ${sd.addressLine2}`}</p>
                            <p>{sd.city}, {sd.postalCode}</p>
                            {sd.locationText && <p className="text-xs italic mt-1">{sd.locationText}</p>}
                            {sd.locationLat && <p className="text-xs font-mono mt-1">📍 {sd.locationLat}, {sd.locationLng}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-slate-300 mb-3">Items Ordered</h3>
                <div className="space-y-2">
                  {viewOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800/50 rounded-md px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-slate-700" />}
                        <div>
                          <p className="font-medium text-sm text-slate-200">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.quantity}× {formatCurrency(item.price)}</p>
                        </div>
                      </div>
                      <p className="font-medium text-amber-500">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="border-slate-800" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(viewOrder.total - (viewOrder.shippingCost || 0))}</span>
                </div>
                {viewOrder.shippingCost != null && viewOrder.shippingCost > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping</span>
                    <span>{formatCurrency(viewOrder.shippingCost)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-100 pt-1">
                  <span>Total</span>
                  <span className="text-amber-500">{formatCurrency(viewOrder.total)}</span>
                </div>
              </div>

              {!viewOrder.isPaid && (
                <Button className="w-full bg-emerald-700 hover:bg-emerald-600 text-white" onClick={(e) => handleMarkPaid(viewOrder.id, e)}>
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
