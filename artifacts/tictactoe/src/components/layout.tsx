import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col w-full text-foreground bg-background selection:bg-primary/30">
      <header className="border-b border-border/50 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 text-primary">
              <span className="font-bold text-lg leading-none tracking-tighter mb-0.5">T</span>
            </div>
            <span className="font-mono font-bold text-lg tracking-tight">TIK<span className="text-primary">TAK</span></span>
          </div>
          
          <nav className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/50">
            <Link href="/" className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              location === "/" 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Game</span>
            </Link>
            <Link href="/blockchain" className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              location === "/blockchain" 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Ledger</span>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
