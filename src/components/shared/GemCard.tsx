import React from "react";
import { Link } from "wouter";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { Gem } from "@/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function GemCard({ gem }: { gem: Gem }) {
  const formatCurrency = useFormatCurrency();
  return (
    <Link href={`/gems/${gem.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {gem.images && gem.images.length > 0 ? (
            <img
              src={gem.images[0]}
              alt={gem.name}
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-serif">
              No Image
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {gem.soldOut && (
              <Badge variant="destructive" className="font-medium">
                Sold Out
              </Badge>
            )}
            {!gem.soldOut && gem.discountedPrice && (
              <Badge className="bg-red-600 hover:bg-red-700 font-medium">
                Sale
              </Badge>
            )}
            {gem.isFeatured && (
              <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground font-medium">
                Featured
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{gem.category}</p>
          <h3 className="font-serif text-lg font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {gem.name}
          </h3>
          <div className="mt-2 flex items-center justify-center gap-2">
            {gem.discountedPrice ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(gem.price)}
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(gem.discountedPrice)}
                </span>
              </>
            ) : (
              <span className="font-medium text-foreground">
                {formatCurrency(gem.price)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}