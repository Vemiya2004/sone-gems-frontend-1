import React from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetOrder } from "@/api-client";
import { formatDateTime, getStatusColor } from "@/lib/formatters";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, Truck, CreditCard, CheckCircle2 } from "lucide-react";

export default function ProfileOrderDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: order, isLoading, error } = useGetOrder(id as string, { query: { enabled: !!id } });
  const formatCurrency = useFormatCurrency();

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </ProfileLayout>
    );
  }

  if (!order) {
    return (
      <ProfileLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-4">Order not found</h2>
          <Link href="/profile/orders" className="text-primary hover:underline">
            Back to Orders
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="mb-6">
        <Link href="/profile/orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold flex items-center gap-4">
              Order <span className="font-mono bg-primary/10 text-primary px-3 py-1 rounded-md text-2xl">{order.orderId}</span>
            </h1>
            <p className="text-muted-foreground mt-2">{formatDateTime(order.createdAt)}</p>
          </div>
          <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`} variant="outline">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.items.map((item, i) => (
                  <div key={i} className="p-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded border border-border overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <Link href={`/gems/${item.gemId}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Delivery Address</h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingDetails?.fullName}</p>
                  <p>{order.shippingDetails?.address}</p>
                  {order.shippingDetails?.addressLine2 && <p>{order.shippingDetails.addressLine2}</p>}
                  <p>{order.shippingDetails?.city}, {order.shippingDetails?.postalCode}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact Info</h4>
                <div className="text-sm space-y-1">
                  <p>{order.shippingDetails?.email}</p>
                  <p>{order.shippingDetails?.phone1}</p>
                  {order.shippingDetails?.whatsapp && <p>WA: {order.shippingDetails.whatsapp}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(order.total - (order.shippingCost || 0))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(order.total)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  {order.isPaid ? (
                    <span className="flex items-center text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Paid
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pending</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfileLayout>
  );
}