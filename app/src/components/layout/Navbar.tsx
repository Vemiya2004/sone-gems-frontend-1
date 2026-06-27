import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Search, ShoppingBag, User, Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { isAuthenticated, isStaff } = useAuth();
  const { itemCount } = useCart();
  const [location, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/gems?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium tracking-wide">
        Free Shipping On All Orders
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-medium">Home</Link>
                  <Link href="/gems" className="text-lg font-medium">All Gems</Link>
                  <Link href="/gems?category=Sapphire" className="text-lg font-medium">Sapphires</Link>
                  <Link href="/gems?category=Ruby" className="text-lg font-medium">Rubies</Link>
                  <Link href="/gems?category=Emerald" className="text-lg font-medium">Emeralds</Link>
                  {isStaff && (
                    <Link href="/admin/dashboard" className="text-lg font-medium text-primary mt-4 flex items-center gap-2">
                      Admin Dashboard <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">Sone Gems</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/gems" className="text-sm font-medium hover:text-primary transition-colors">All Gems</Link>
            <Link href="/gems?category=Sapphire" className="text-sm font-medium hover:text-primary transition-colors">Sapphires</Link>
            <Link href="/gems?category=Ruby" className="text-sm font-medium hover:text-primary transition-colors">Rubies</Link>
            <Link href="/gems?category=Emerald" className="text-sm font-medium hover:text-primary transition-colors">Emeralds</Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center relative animate-in fade-in slide-in-from-right-4">
                <input
                  type="text"
                  placeholder="Search gems..."
                  className="h-9 w-full md:w-64 rounded-full border border-input bg-transparent px-4 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 h-9 w-9"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={() => setLocation(isAuthenticated ? "/profile" : "/auth")}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => setLocation("/cart")}>
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}