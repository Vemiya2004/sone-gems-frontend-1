import React from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t border-primary-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold tracking-tight mb-6">Sone Gems</h3>
            <p className="text-primary-foreground/70 mb-6 font-light leading-relaxed">
              Purveyors of fine Sri Lankan gemstones since 1985. Every piece in our collection is hand-selected for exceptional brilliance and origin.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
                <FaFacebook size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
                <FaInstagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors">
                <FaTwitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold tracking-widest uppercase text-sm mb-6 text-primary-foreground/90">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/gems" className="text-primary-foreground/70 hover:text-white transition-colors">All Gemstones</Link></li>
              <li><Link href="/gems?category=Sapphire" className="text-primary-foreground/70 hover:text-white transition-colors">Ceylon Sapphires</Link></li>
              <li><Link href="/gems?category=Ruby" className="text-primary-foreground/70 hover:text-white transition-colors">Rubies</Link></li>
              <li><Link href="/gems?category=Emerald" className="text-primary-foreground/70 hover:text-white transition-colors">Emeralds</Link></li>
              <li><Link href="/gems?category=Alexandrite" className="text-primary-foreground/70 hover:text-white transition-colors">Rare Alexandrite</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold tracking-widest uppercase text-sm mb-6 text-primary-foreground/90">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/shipping" className="text-primary-foreground/70 hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/certification" className="text-primary-foreground/70 hover:text-white transition-colors">Gem Certification</Link></li>
              <li><Link href="/care" className="text-primary-foreground/70 hover:text-white transition-colors">Jewelry Care</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans font-semibold tracking-widest uppercase text-sm mb-6 text-primary-foreground/90">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-primary-foreground/70">
                <MapPin size={20} className="shrink-0 text-secondary" />
                <span>45 Gem Merchants St,<br />Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Phone size={20} className="shrink-0 text-secondary" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Mail size={20} className="shrink-0 text-secondary" />
                <span>concierge@sonegems.store</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-foreground/10 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} Sone Gems. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-primary-foreground/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-primary-foreground/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}