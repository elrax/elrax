import { sql } from "drizzle-orm"
import { z } from "zod"
import { procedure, router } from "../trpc"
import { users } from "../db/schema"
import { verifyAppleToken, verifyFacebookToken, verifyGoogleToken } from "../utils/oauth"

export const authRouter = router({
	getUsers: procedure.query(async ({ ctx }) => {
		const foundUsers = await ctx.db
			.select()
			.from(users)
			.orderBy(sql`RANDOM()`)
			.limit(10)
		return foundUsers
	}),
	continueWithOAuth: procedure
		.input(
			z.object({
				provider: z.enum(["google", "apple", "facebook"]),
				token: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.provider === "apple") {
				const res = await verifyAppleToken(input.token)
				console.log(res)
				// TODO:
				// 1. create user if not exists
				// 2. create session and return JWT auth token
			} else if (input.provider === "facebook") {
				const res = await verifyFacebookToken(
					input.token,
					ctx.env.FACEBOOK_APP_ID,
					ctx.env.FACEBOOK_APP_SECRET,
				)
				console.log(res)
			} else if (input.provider === "google") {
				const res = await verifyGoogleToken(input.token)
				console.log(res)
			}
			return
		}),
})
