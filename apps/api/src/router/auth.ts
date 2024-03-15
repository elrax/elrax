import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { verifyAppleToken, verifyFacebookToken, verifyGoogleToken } from "../utils/oauth"
import { procedure, router } from "../trpc"
import { signInUserOrCreate } from "../db"
import { SignedWith } from "../db/types"

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
				const user = await signInUserOrCreate(
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
					user,
					signedWith: SignedWith.Apple,
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
				const user = await signInUserOrCreate(
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
					user,
					signedWith: SignedWith.Facebook,
					receivedProps: {
						email: res.email,
						firstName: input.user.firstName,
						lastName: input.user.lastName,
					},
				}
			} else if (input.provider === "google") {
				const res = await verifyGoogleToken(input.token)
				const user = await signInUserOrCreate(
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
					user,
					signedWith: SignedWith.Google,
					receivedProps: {
						email: res.email,
						firstName: input.user.firstName,
						lastName: input.user.lastName,
					},
				}
			}
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Invalid provider",
			})
		}),
})
