import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build your next SAAS faster than ever
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A production-ready starter template with Next.js, Stripe, and Supabase integration.
            Everything you need to launch your SAAS product in minutes.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}