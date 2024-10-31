"use client";

import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Boxes } from 'lucide-react';

interface NavBarProps {
  session: Session | null;
}

export function NavBar({ session }: NavBarProps) {
  const pathname = usePathname();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Boxes className="h-6 w-6" />
            <span className="font-bold inline-block">SAAS Starter</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/features"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/features" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/pricing" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/docs" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Documentation
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {session ? (
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}