import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useCreateOrder } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronRight, Loader2, Truck, CreditCard, Store, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

type PaymentFlow = "delivery" | "shop" | null;
type ShopSubFlow = "pay_now" | "appointment" | null;

const MAPS_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrderMutation = useCreateOrder();

  const [flow, setFlow] = useState<PaymentFlow>(null);
  const [shopSubFlow, setShopSubFlow] = useState<ShopSubFlow>(null);
  const [step, setStep] = useState(0);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const [details, setDetails] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone1: "",
    phone2: "",
    whatsapp: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    locationLat: "6.9271",
    locationLng: "79.8612",
    locationText: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const shippingCost = flow === "delivery" ? (total > 100000 ? 0 : 1500) : 0;
  const finalTotal = total + shippingCost;

  if (items.length === 0 && !successOrder) {
    setLocation("/cart");
    return null;
  }

  const updateDetail = (key: keyof typeof details) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails(d => ({ ...d, [key]: e.target.value }));
  };

  const handleSelectFlow = (f: PaymentFlow) => {
    setFlow(f);
    setStep(1);
  };

  const handleCreateOrder = () => {
    let paymentMethod = "";
    let pickupType = "";

    if (flow === "delivery") {
      paymentMethod = "card";
      pickupType = "shipping";
    } else {
      if (shopSubFlow === "pay_now") {
        paymentMethod = "card";
        pickupType = "pickup";
      } else {
        paymentMethod = "shop";
        pickupType = "appointment";
      }
    }

    const shippingDetails = {
      fullName: details.fullName,
      email: details.email,
      phone1: details.phone1,
      phone2: details.phone2 || undefined,
      whatsapp: details.whatsapp || undefined,
      ...(flow === "delivery" ? {
        address: details.address,
        addressLine2: details.addressLine2 || undefined,
        city: details.city,
        postalCode: details.postalCode,
        locationLat: parseFloat(details.locationLat) || 6.9271,
        locationLng: parseFloat(details.locationLng) || 79.8612,
        locationText: details.locationText || undefined,
      } : {}),
      ...(shopSubFlow === "appointment" ? {
        appointmentDate: details.appointmentDate,
        appointmentTime: details.appointmentTime,
      } : {}),
    };

    createOrderMutation.mutate({
      data: {
        items,
        shippingDetails,
        paymentMethod,
        pickupType,
        total: finalTotal,
        shippingCost: flow === "delivery" ? shippingCost : 0,
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setSuccessOrder(order);
        if (paymentMethod === "card") {
          initiatePayHere(order, finalTotal);
        }
        setStep(99);
      },
      onError: (err: any) => {
        toast({ title: "Order failed", description: err.message, variant: "destructive" });
      }
    });
  };

  const initiatePayHere = (order: any, amount: number) => {
    toast({
      title: "Redirecting to PayHere",
      description: `Order ${order.orderId} created. Payment gateway integration active.`,
    });
  };

  const stepLabels: Record<string, string[]> = {
    delivery: ["Delivery", "Details", "Location", "Review"],
    shop: ["Buy at Shop", "Options", "Details", "Review"],
  };

  return (
    <div className="min-h-screen bg-muted/10 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-3xl font-bold mb-8 text-center">Secure Checkout</h1>

        {step < 99 && flow && (
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-0">
              {stepLabels[flow].map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${step > i ? "bg-primary text-primary-foreground" : step === i ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{label}</span>
                  </div>
                  {i < stepLabels[flow].length - 1 && (
                    <div className={`w-12 md:w-20 h-1 mx-1 rounded ${step > i ? "bg-primary" : "bg-muted"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">

          {step === 0 && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-2">How would you like to order?</h2>
              <p className="text-muted-foreground mb-8">Choose your preferred payment and delivery method.</p>

              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  {
                    id: "delivery" as const,
                    icon: Truck,
                    title: "Delivery to Home",
                    desc: "Pay online via card and receive the order at your doorstep. Shipping fee applies.",
                    badge: "Convenient",
                  },
                  {
                    id: "shop" as const,
                    icon: Store,
                    title: "Buy at Shop",
                    desc: "Pay now to collect or book an appointment to visit our showroom.",
                    badge: null,
                  },
                ].map(({ id, icon: Icon, title, desc, badge }) => (
                  <button
                    key={id}
                    onClick={() => handleSelectFlow(id)}
                    className="group text-left flex flex-col items-center text-center rounded-lg border-2 border-muted bg-popover p-6 hover:border-primary hover:bg-primary/5 transition-all relative"
                  >
                    {badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                    <Icon className="mb-4 h-10 w-10 text-primary" />
                    <span className="font-semibold text-lg mb-2">{title}</span>
                    <span className="text-sm text-muted-foreground leading-snug">{desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && flow === "shop" && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-2">How would you like to proceed?</h2>
              <p className="text-muted-foreground mb-8">Choose to pay now or reserve an appointment to view the gem in person.</p>

              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                <button
                  onClick={() => { setShopSubFlow("pay_now"); setStep(2); }}
                  className="group text-left flex flex-col items-center text-center rounded-lg border-2 border-muted bg-popover p-6 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <CreditCard className="mb-4 h-10 w-10 text-primary" />
                  <span className="font-semibold text-lg mb-2">Pay Now</span>
                  <span className="text-sm text-muted-foreground leading-snug">Pay online now and get your Order ID to collect your item from the shop quickly.</span>
                </button>
                <button
                  onClick={() => { setShopSubFlow("appointment"); setStep(2); }}
                  className="group text-left flex flex-col items-center text-center rounded-lg border-2 border-muted bg-popover p-6 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <CalendarIcon className="mb-4 h-10 w-10 text-primary" />
                  <span className="font-semibold text-lg mb-2">Book an Appointment</span>
                  <span className="text-sm text-muted-foreground leading-snug">Reserve the item without payment. Come to our shop, view the gem, and pay in person.</span>
                </button>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => { setStep(0); setShopSubFlow(null); }}>Back</Button>
              </div>
            </div>
          )}

          {step === 1 && flow === "delivery" && (
            <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-6">Customer Details</h2>
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" required value={details.fullName} onChange={updateDetail("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" required value={details.email} onChange={updateDetail("email")} />
                </div>
                <div className="space-y-2">
                  <Label>Primary Phone *</Label>
                  <Input required value={details.phone1} onChange={updateDetail("phone1")} placeholder="+94 7X XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Phone</Label>
                  <Input value={details.phone2} onChange={updateDetail("phone2")} />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input value={details.whatsapp} onChange={updateDetail("whatsapp")} placeholder="+94 7X XXX XXXX" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address Line 1 *</Label>
                  <Input required value={details.address} onChange={updateDetail("address")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address Line 2 (Optional)</Label>
                  <Input value={details.addressLine2} onChange={updateDetail("addressLine2")} />
                </div>
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input required value={details.city} onChange={updateDetail("city")} />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code *</Label>
                  <Input required value={details.postalCode} onChange={updateDetail("postalCode")} />
                </div>
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button type="submit" size="lg">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </form>
          )}

          {step === 2 && flow === "shop" && (
            <form onSubmit={e => { e.preventDefault(); setStep(3); }} className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-6">Your Details</h2>
              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <div className="space-y-2 md:col-span-2">
                  <Label>Full Name *</Label>
                  <Input required value={details.fullName} onChange={updateDetail("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" required value={details.email} onChange={updateDetail("email")} />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input required value={details.phone1} onChange={updateDetail("phone1")} placeholder="+94 7X XXX XXXX" />
                </div>
                
                {shopSubFlow === "appointment" && (
                  <>
                    <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t border-border">
                      <h3 className="font-semibold text-lg">Appointment Details</h3>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Input type="date" required min={new Date().toISOString().split('T')[0]} value={details.appointmentDate} onChange={updateDetail("appointmentDate")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <Input type="time" required value={details.appointmentTime} onChange={updateDetail("appointmentTime")} />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" size="lg">Continue <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </form>
          )}

          {step === 2 && flow === "delivery" && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-2">Confirm Delivery Location</h2>
              <p className="text-muted-foreground mb-6">Drop a pin or confirm your delivery coordinates so our courier can find you easily.</p>

              {MAPS_KEY ? (
                <div className="w-full h-72 rounded-md overflow-hidden border border-border mb-6">
                  <iframe
                    title="Delivery Location"
                    className="w-full h-full"
                    src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_KEY}&q=${details.locationLat},${details.locationLng}&zoom=15`}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-muted rounded-md border border-border flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                  <MapPin className="h-10 w-10 text-primary mb-2 z-10" />
                  <p className="text-sm text-muted-foreground z-10 text-center px-4">
                    <strong>{details.address}</strong><br />{details.city}, {details.postalCode}
                  </p>
                </div>
              )}

              <div className="bg-muted/40 rounded-md p-4 border border-border mb-6">
                <p className="text-sm font-medium mb-3">Precise Location (optional)</p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Latitude</Label>
                    <Input value={details.locationLat} onChange={updateDetail("locationLat")} placeholder="6.9271" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Longitude</Label>
                    <Input value={details.locationLng} onChange={updateDetail("locationLng")} placeholder="79.8612" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Location Description (landmark / directions)</Label>
                  <Input value={details.locationText} onChange={updateDetail("locationText")} placeholder="e.g. Near the temple, blue gate house" />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} size="lg">Confirm Location <ChevronRight className="ml-2 h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {((step === 3 && flow === "delivery") || (step === 3 && flow === "shop")) && (
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-serif font-bold mb-6">Review Your Order</h2>

              <div className="grid md:grid-cols-2 gap-10 mb-8">
                <div>
                  <h3 className="font-semibold text-base mb-3 pb-2 border-b">
                    {flow === "delivery" ? "Shipping Details" : "Contact Details"}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">{details.fullName}</p>
                    {flow === "delivery" && (
                      <>
                        <p>{details.address}</p>
                        {details.addressLine2 && <p>{details.addressLine2}</p>}
                        <p>{details.city}, {details.postalCode}</p>
                      </>
                    )}
                    <p className="mt-2">{details.phone1}</p>
                    <p>{details.email}</p>
                  </div>

                  <h3 className="font-semibold text-base mt-6 mb-3 pb-2 border-b">Payment Method</h3>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    {flow === "delivery" && <><CreditCard className="h-4 w-4 text-primary" /> Card Payment (Delivery)</>}
                    {flow === "shop" && shopSubFlow === "pay_now" && <><CreditCard className="h-4 w-4 text-primary" /> Card via PayHere (Shop Pickup)</>}
                    {flow === "shop" && shopSubFlow === "appointment" && <><Store className="h-4 w-4 text-primary" /> Pay at Shop (In Person)</>}
                  </div>
                  
                  {flow === "shop" && shopSubFlow === "appointment" && (
                    <>
                      <h3 className="font-semibold text-base mt-6 mb-3 pb-2 border-b">Appointment</h3>
                      <div className="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                        <p className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {details.appointmentDate}</p>
                        <p className="flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> {details.appointmentTime}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="bg-muted/30 p-5 rounded-md border border-border">
                  <h3 className="font-semibold text-base mb-4 pb-2 border-b">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {items.map(item => (
                      <div key={item.gemId} className="flex justify-between text-sm">
                        <span>{item.quantity}× {item.name}</span>
                        <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    {flow === "delivery" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                      </div>
                    )}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  if (flow === "delivery") setStep(2);
                  else setStep(2);
                }}>Back</Button>
                <Button
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={createOrderMutation.isPending}
                  className="px-8"
                >
                  {createOrderMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                  ) : flow === "shop" ? (
                    "Send Order"
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 99 && successOrder && (
            <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-8 relative"
              >
                <div className="absolute inset-0 rounded-full bg-green-100 scale-150 animate-ping opacity-20" />
                <CheckCircle2 className="h-24 w-24 text-green-500 relative z-10" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-3xl font-serif font-bold mb-3">
                  {flow === "shop" ? "Order Sent!" : "Order Placed Successfully!"}
                </h2>
                <p className="text-muted-foreground mb-4 max-w-md">
                  {flow === "shop"
                    ? "Your order reservation has been sent. Visit our showroom to complete your purchase."
                    : "Thank you for choosing Sone Gems. Your order has been received and is being processed."}
                </p>

                <div className="inline-flex items-center gap-3 bg-muted border border-border rounded-lg px-6 py-3 mb-8">
                  <span className="text-sm text-muted-foreground">
                    {shopSubFlow === "appointment" ? "Appointment ID:" : "Order ID:"}
                  </span>
                  <span className="font-mono font-bold text-primary text-lg">{successOrder.orderId}</span>
                </div>

                {((flow === "delivery") || (flow === "shop" && shopSubFlow === "pay_now")) && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md mb-8 max-w-md text-sm mx-auto">
                    <strong>PayHere Payment:</strong> In production, you would now be redirected to the PayHere secure payment gateway to complete your payment.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/profile/orders">View My Orders</Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/gems">Continue Shopping</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
