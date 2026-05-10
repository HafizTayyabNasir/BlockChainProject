import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Database, CreditCard, LogOut, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

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

          {user && (
            <div className="flex items-center gap-4">
              <Link href="/payment" className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                location === "/payment" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}>
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Credits</span>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </DropdownMenuItem>
                  {user.walletAddress && (
                    <DropdownMenuItem disabled>
                      <span className="text-xs text-muted-foreground">
                        {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
