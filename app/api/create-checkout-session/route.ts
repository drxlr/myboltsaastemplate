import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();
    const supabase = createServerComponentClient({ cookies });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        priceId,
      },
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/dashboard?canceled=true`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}