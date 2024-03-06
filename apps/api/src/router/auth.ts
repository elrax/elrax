import { z } from "zod"
import { type Env, procedure, router } from "../trpc"
import { verifyAppleToken, verifyFacebookToken, verifyGoogleToken } from "../utils/oauth"
import { type Database, getUserOrNull, users, authSessions } from "../db"
import { SignedWith } from "../db/types"
import jwt from "@tsndr/cloudflare-worker-jwt"

const signInUserOrCreate = async (
	db: Database,
	env: Env,
	signedWith: SignedWith,
	user: {
		email?: string
		firstName?: string
		lastName?: string
		appleId?: string
		facebookId?: string
		googleId?: string
	},
	ipLocation: string,
	device: string,
) => {
	let foundUser = await getUserOrNull(db, {
		appleId: user.appleId,
		facebookId: user.facebookId,
		googleId: user.googleId,
	})
	if (!foundUser) {
		const returnedUsers = await db
			.insert(users)
			.values({
				signedUpWith: signedWith,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				appleId: user.appleId,
				facebookId: user.facebookId,
				googleId: user.googleId,
			})
			.returning()
		foundUser = returnedUsers[0]!
	}
	const returnedSessions = await db
		.insert(authSessions)
		.values({
			signedInWith: signedWith,
			device,
			ipLocation,
			isActive: true,
			userId: foundUser.id,
		})
		.returning()
	const token = await jwt.sign(
		{
			userId: foundUser.id,
			sessionId: returnedSessions[0]!.id,
		},
		env.JWT_SECRET,
	)
	return token
}

export const authRouter = router({
	continueWithOAuth: procedure
		.input(
			z.object({
				provider: z.enum(["google", "apple", "facebook"]),
				token: z.string().min(1),
				user: z.object({
					id: z.string().trim().min(1),
					firstName: z.string().trim().min(1).max(20).optional(),
					lastName: z.string().trim().min(1).max(20).optional(),
					email: z.string().email().optional(),
				}),
				device: z.string().min(1).max(150),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const ipLocation = ctx.req.headers.get("CF-IPCountry") ?? "-"
			const device = input.device
			if (input.provider === "apple") {
				const res = await verifyAppleToken(input.token)
				const jwt = await signInUserOrCreate(
					ctx.db,
					ctx.env,
					SignedWith.Apple,
					{
						appleId: input.user.id,
						email: res.email,
						...input.user,
					},
					ipLocation,
					device,
				)
				return {
					jwt,
					receivedProps: {
						email: res.email,
						firstName: input.user.firstName,
						lastName: input.user.lastName,
					},
				}
			} else if (input.provider === "facebook") {
				const res = await verifyFacebookToken(
					input.token,
					ctx.env.FACEBOOK_APP_ID,
					ctx.env.FACEBOOK_APP_SECRET,
				)
				const jwt = await signInUserOrCreate(
					ctx.db,
					ctx.env,
					SignedWith.Apple,
					{
						appleId: input.user.id,
						email: res.email,
						...input.user,
					},
					ipLocation,
					device,
				)
				return {
					jwt,
					receivedProps: {
						email: res.email,
						firstName: input.user.firstName,
						lastName: input.user.lastName,
					},
				}
			} else if (input.provider === "google") {
				const res = await verifyGoogleToken(input.token)
				const jwt = await signInUserOrCreate(
					ctx.db,
					ctx.env,
					SignedWith.Apple,
					{
						appleId: input.user.id,
						email: res.email,
						...input.user,
					},
					ipLocation,
					device,
				)
				return {
					jwt,
					receivedProps: {
						email: res.email,
						firstName: input.user.firstName,
						lastName: input.user.lastName,
					},
				}
			}
		}),
})
