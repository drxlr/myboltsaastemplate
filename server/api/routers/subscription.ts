import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/lib/stripe";
import { TRPCError } from "@trpc/server";

export const subscriptionRouter = createTRPCRouter({
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return subscription;
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({
      priceId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { priceId } = input;

      try {
        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "subscription",
          customer_email: ctx.session.user.email,
          line_items: [{ price: priceId, quantity: 1 }],
          metadata: {
            userId: ctx.session.user.id,
            priceId,
          },
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
        });

        return { sessionId: checkoutSession.id };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),
});