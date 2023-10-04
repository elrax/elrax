import { procedure, router } from "../trpc"
import { users } from "../schema"

export const appRouter = router({
	welcome: procedure.query(async ({ ctx }) => {
		const result = await ctx.db.select().from(users).all()
		return { welcome: `${result.length} users` }
	}),
})

export type AppRouter = typeof appRouter
