import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { subscriptionRouter } from "./routers/subscription";

export const appRouter = createTRPCRouter({
  user: userRouter,
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;