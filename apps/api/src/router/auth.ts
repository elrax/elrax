import { z } from "zod"
import { TRPCError } from "@trpc/server"

import { verifyAppleToken, verifyFacebookToken, verifyGoogleToken } from "../utils/oauth"
import { type Env, procedure, router } from "../trpc"
import { type Database, signInUserOrCreate, otpVerifications } from "../db"
import { OTPVerificationType, SignedWith } from "../db/types"
import { generateOTP } from "../utils/otp"
import { Resend } from "resend"

const signInOrCreateUser = async (
	db: Database,
	env: Env,
	provider: (typeof SignProviders)[number],
	token: string,
	user: {
		id: string
		firstName?: string
		lastName?: string
		email?: string
	},
	ipLocation: string,
	device: string,
) => {
	if (provider === "apple") {
		const res = await verifyAppleToken(token)
		const u = await signInUserOrCreate(
			db,
			env,
			SignedWith.APPLE,
			{
				appleId: user.id,
				...user,
				email: res.email,
			},
			ipLocation,
			device,
		)
		return {
			...u,
			signedWith: SignedWith.APPLE,
			receivedProps: {
				email: res.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		}
	} else if (provider === "facebook") {
		const res = await verifyFacebookToken(token, env.FACEBOOK_APP_ID, env.FACEBOOK_APP_SECRET)
		const u = await signInUserOrCreate(
			db,
			env,
			SignedWith.FACEBOOK,
			{
				appleId: user.id,
				...user,
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
			},
			ipLocation,
			device,
		)
		return {
			...u,
			signedWith: SignedWith.FACEBOOK,
			receivedProps: {
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
			},
		}
	} else if (provider === "google") {
		const res = await verifyGoogleToken(token)
		const u = await signInUserOrCreate(
			db,
			env,
			SignedWith.GOOGLE,
			{
				appleId: user.id,
				...user,
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
			},
			ipLocation,
			device,
		)
		return {
			...u,
			signedWith: SignedWith.GOOGLE,
			receivedProps: {
				email: res.email,
				firstName: res.firstName,
				lastName: res.lastName,
			},
		}
	}
	throw new TRPCError({
		code: "BAD_REQUEST",
		message: "Invalid provider",
	})
}

const SignProviders = ["google", "apple", "facebook"] as const

export const authRouter = router({
	continueWithOAuth: procedure
		.input(
			z.object({
				provider: z.enum(SignProviders),
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
			// TODO: We should store at least some location of sign-in to let user revoke session.
			const ipLocation = ctx.req.headers.get("CF-IPCountry") ?? "-"
			const device = input.device

			const res = await signInOrCreateUser(
				ctx.db,
				ctx.env,
				input.provider,
				input.token,
				input.user,
				ipLocation,
				device,
			)
			const email = res.receivedProps.email
			// TODO: Support privaterelay emails
			if (res.newUser && email && !email.includes("@privaterelay.appleid.com")) {
				const otp = generateOTP()
				// Insert OTP verification secret
				await ctx.db.insert(otpVerifications).values({
					createdAt: otp.date,
					secret: otp.secret,
					type: OTPVerificationType.EMAIL,
					userId: res.userId,
				})
				// Send welcome email
				const resend = new Resend(ctx.env.RESEND_API_KEY)
				const result = await resend.emails.send({
					from: "noreply@notify.elrax.com",
					to: email,
					subject: "Welcome to Elrax! 🎉",
					text: "Welcome to Elrax!",
				})
				if (result.error) {
					console.log(`Email error: ${JSON.stringify(result.error)}`)
				}
			}
			// TODO: Check if accessed from a new device or location and send email
			return res
		}),
})
