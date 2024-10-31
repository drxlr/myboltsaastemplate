import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { env } from "@/env.mjs";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const supabase = createServerComponentClient({ cookies });

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Update the user's subscription status in Supabase
      if (session?.metadata?.userId) {
        await supabase
          .from("subscriptions")
          .upsert({
            user_id: session.metadata.userId,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            stripe_price_id: session.metadata.priceId,
            status: "active",
          });
      }
      break;
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      
      // Update the subscription status to canceled
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
  }

  return new NextResponse(null, { status: 200 });
}