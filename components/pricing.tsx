"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadStripe } from "@stripe/stripe-js";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Hobby",
    description: "Perfect for side projects and small businesses",
    price: "$9",
    features: [
      "Up to 1,000 subscribers",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
    priceId: "price_hobby",
  },
  {
    name: "Pro",
    description: "For growing businesses and teams",
    price: "$29",
    features: [
      "Up to 10,000 subscribers",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "Custom domain",
    ],
    priceId: "price_pro",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "$99",
    features: [
      "Unlimited subscribers",
      "Custom analytics",
      "24/7 support",
      "Unlimited team members",
      "Multiple domains",
      "SLA",
    ],
    priceId: "price_enterprise",
  },
];

export function Pricing() {
  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
        <p className="text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => handleSubscribe(plan.priceId)}
            >
              Get Started
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}