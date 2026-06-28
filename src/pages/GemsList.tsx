import React, { useState } from "react";
import { useLocation } from "wouter";
import { useListGems, useGetGemCategories } from "@/api-client";
import { GemCard } from "@/components/shared/GemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

export default function GemsList() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useListGems({
    category: category || undefined,
    search: search || undefined,
    page,
    limit
  });
  
  const { data: categories } = useGetGemCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {category ? `${category} Collection` : "All Gemstones"}
          </h1>
          <p className="text-muted-foreground text-lg">Explore our curated selection of premium gemstones.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search by name, type, or color..." 
              className="pl-10 h-12 text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          
          <div className="flex gap-4">
            <Select value={category} onValueChange={(val) => { setCategory(val === "all" ? "" : val); setPage(1); }}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Array.isArray(categories) && categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="h-12 px-4" onClick={() => { setCategory(""); setSearch(""); setPage(1); }}>
              Clear
            </Button>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center text-sm text-muted-foreground">
          <span>{data?.total || 0} results found</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="w-full aspect-square" />
                <Skeleton className="h-4 w-1/3 mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : data?.gems && data.gems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.gems.map(gem => (
              <GemCard key={gem.id} gem={gem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 border border-dashed rounded-sm">
            <h3 className="font-serif text-2xl font-medium mb-2">No gemstones found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
            <Button onClick={() => { setCategory(""); setSearch(""); setPage(1); }}>
              Clear All Filters
            </Button>
          </div>
        )}

        {data && data.totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button 
              variant="outline" 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center px-4 text-sm font-medium">
              Page {page} of {data.totalPages}
            </div>
            <Button 
              variant="outline" 
              disabled={page === data.totalPages}
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}