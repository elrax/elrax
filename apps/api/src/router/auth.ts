import { eq, sql } from "drizzle-orm"
import { z } from "zod"
import { procedure, router } from "../trpc"
import { users } from "../db/schema"
import { verifyAppleToken, verifyFacebookToken, verifyGoogleToken } from "../utils/oauth"
// import { SignedWith } from "../db/types"

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
				user: z.object({
					id: z.string().trim().min(1),
					firstName: z.string().trim().optional(),
					lastName: z.string().trim().optional(),
					email: z.string().email().optional(),
				}),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			console.log(input.token)
			if (input.provider === "apple") {
				const res = await verifyAppleToken(input.token)
				console.log(res, input.user)

				// TODO: Move to helper file
				const foundUsers = await ctx.db
					.select()
					.from(users)
					.where(eq(users.appleId, input.user.id))
				if (foundUsers.length === 0) {
					// await ctx.db
					// 	.insert(users)
					// 	.values({
					// 		signedUpWith: SignedWith.Apple,
					// 		email: input.user.email,
					// 		username: "apple-" + input.user.id,
					// 		firstName: input.user.firstName,
					// 		lastName: input.user.lastName,
					// 		appleId: input.user.id,
					// 	})
				}
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
