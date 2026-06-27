import React, { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useGetGem, useGetRelatedGems, useLogin } from "@workspace/api-client-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/formatters";
import { GemCard } from "@/components/shared/GemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Twitter, ShieldCheck, MapPin, Share2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSignup } from "@workspace/api-client-react";

export default function GemDetail() {
  const { id } = useParams();
  const { data: gem, isLoading } = useGetGem(id!, { query: { enabled: !!id } });
  const { data: relatedGems } = useGetRelatedGems(id!, { query: { enabled: !!id } });
  const { addItem } = useCart();
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAddToCart, setPendingAddToCart] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", username: "", password: "" });

  const loginMutation = useLogin();
  const registerMutation = useSignup();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setPendingAddToCart(true);
      setShowAuthModal(true);
      return;
    }
    if (!gem) return;
    addItem(gem, quantity);
    toast({ title: "Added to Cart", description: `${quantity}x ${gem.name} added to your cart.` });
  };

  const handleAuthSuccess = (token: string, user: any) => {
    login(token, user);
    setShowAuthModal(false);
    if (pendingAddToCart && gem) {
      addItem(gem, quantity);
      toast({ title: "Added to Cart", description: `${quantity}x ${gem.name} added to your cart.` });
      setPendingAddToCart(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ data: loginForm }, {
      onSuccess: (data: any) => handleAuthSuccess(data.token, data.user),
      onError: (err: any) => toast({ title: "Login failed", description: err.message, variant: "destructive" }),
    });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ data: signupForm }, {
      onSuccess: (data: any) => handleAuthSuccess(data.token, data.user),
      onError: (err: any) => toast({ title: "Sign up failed", description: err.message, variant: "destructive" }),
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!gem) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Gemstone Not Found</h1>
        <Button asChild><Link href="/gems">Back to Collection</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gems" className="hover:text-primary transition-colors">Gems</Link>
          <span>/</span>
          <Link href={`/gems?category=${gem.category}`} className="hover:text-primary transition-colors">{gem.category}</Link>
          <span>/</span>
          <span className="text-foreground">{gem.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-muted rounded-sm border border-border">
              {gem.images && gem.images.length > 0 ? (
                <img src={gem.images[activeImage]} alt={gem.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif">
                  No Image Available
                </div>
              )}
            </div>
            {gem.images && gem.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {gem.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 shrink-0 border-2 rounded-sm overflow-hidden ${activeImage === i ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="outline" className="rounded-none border-primary/30 text-primary uppercase tracking-widest">{gem.category}</Badge>
              {gem.country && <Badge variant="secondary" className="rounded-none">{gem.country}</Badge>}
              {gem.soldOut && <Badge variant="destructive" className="rounded-none">Sold Out</Badge>}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              {gem.name}
            </h1>

            <div className="text-2xl md:text-3xl font-medium text-foreground mb-6 flex items-end gap-3">
              {gem.discountedPrice ? (
                <>
                  <span className="text-muted-foreground line-through text-lg mb-1">{formatCurrency(gem.price)}</span>
                  <span className="text-red-600">{formatCurrency(gem.discountedPrice)}</span>
                </>
              ) : (
                formatCurrency(gem.price)
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {gem.description || "A magnificent gemstone from the legendary mines of Sri Lanka."}
            </p>

            <Separator className="mb-8" />

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="font-medium text-foreground min-w-[120px]">Availability:</div>
                <div className={gem.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {gem.soldOut || gem.stock === 0 ? "Out of Stock" : `${gem.stock} in stock`}
                </div>
              </div>

              {!gem.soldOut && gem.stock > 0 && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-input rounded-sm">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-12 text-center font-medium">{quantity}</div>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setQuantity(Math.min(gem.stock, quantity + 1))}
                      disabled={quantity >= gem.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-muted/30 p-4 border border-border/50 rounded-sm space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Certified Authenticity</h4>
                  <p className="text-xs text-muted-foreground">Every gem comes with an independent laboratory certificate.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-sm">Free Global Shipping</h4>
                  <p className="text-xs text-muted-foreground">Secure, insured delivery to your doorstep.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 border-t border-border pt-6 mt-auto">
              <span className="text-sm font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4" /> Share:
              </span>
              <button className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></button>
              <button className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="mb-20 border border-border bg-card">
          <div className="bg-muted px-6 py-4 border-b border-border">
            <h3 className="font-serif text-xl font-bold">Gemstone Specifications</h3>
          </div>
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            {[
              ["Gem Type", gem.gemType || gem.category],
              ["Weight", gem.weight],
              ["Color", gem.colour],
              ["Clarity", gem.clarity],
              ["Shape & Cut", gem.shapeAndCut],
              ["Dimensions", gem.size],
              ["Treatment", gem.treatment || "Unheated/Untreated"],
              ["Origin", gem.country || "Sri Lanka"],
            ].map(([label, value]) => value && (
              <div key={label} className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {Array.isArray(relatedGems) && relatedGems.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold mb-4">You May Also Like</h2>
              <div className="h-1 w-16 bg-secondary mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGems.slice(0, 4).map(related => (
                <GemCard key={related.id} gem={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Sign in to Continue</DialogTitle>
            <p className="text-sm text-muted-foreground">Please log in or create an account to add items to your cart.</p>
          </DialogHeader>
          <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username or Email</Label>
                  <Input required value={loginForm.username} onChange={e => setLoginForm(f => ({ ...f, username: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" required value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Login &amp; Add to Cart
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input required value={signupForm.name} onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" required value={signupForm.email} onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input required value={signupForm.username} onChange={e => setSignupForm(f => ({ ...f, username: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" required value={signupForm.password} onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                  {registerMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create Account &amp; Add to Cart
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
