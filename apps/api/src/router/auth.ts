import { sql } from "drizzle-orm"
import { procedure, router } from "../trpc"
import { users } from "../db/schema"

export const videoRouter = router({
	getUsers: procedure.query(async ({ ctx }) => {
		const foundUsers = await ctx.db
			.select()
			.from(users)
			.orderBy(sql`RANDOM()`)
			.limit(10)
		return foundUsers
	}),
})