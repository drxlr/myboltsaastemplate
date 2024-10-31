import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { subscription: true },
    });
    return user;
  }),
  
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
      });
      return user;
    }),
});