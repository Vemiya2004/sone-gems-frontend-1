import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useGetUserOrders } from "@workspace/api-client-react";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/formatters";
import { ProfileLayout } from "@/components/layout/ProfileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function ProfileOrders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useGetUserOrders(user?.id || "", { 
    query: { enabled: !!user?.id } 
  });

  return (
    <ProfileLayout>
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <Link key={order.id} href={`/profile/orders/${order.id}`}>
                  <div className="group border border-border/50 bg-muted/10 hover:bg-muted/30 rounded-lg p-4 sm:p-6 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                          {order.orderId}
                        </span>
                        <Badge className={`${getStatusColor(order.status)}`} variant="outline">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{formatDate(order.createdAt)}</span>
                        <span>•</span>
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="font-bold text-foreground">{formatCurrency(order.total)}</div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg mb-2">No orders yet</h3>
              <p className="text-muted-foreground">When you purchase gems, they will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}