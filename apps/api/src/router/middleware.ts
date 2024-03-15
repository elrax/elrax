import jwt from "@tsndr/cloudflare-worker-jwt"
import { eq } from "drizzle-orm"
import { TRPCError } from "@trpc/server"
import { middleware } from "../trpc"
import { authSessions } from "../db"

export const auth = middleware(async ({ next, ctx }) => {
	const token = ctx.req.headers.get("authorization")?.replace("Bearer ", "")
	if (!token) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	try {
		const isValid = await jwt.verify(token, ctx.env.JWT_SECRET)
		if (!isValid) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}
	} catch (err) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	const { payload } = jwt.decode(token)
	const { sessionId } = payload as { sessionId: string }
	const foundSessions = await ctx.db
		.select()
		.from(authSessions)
		.where(eq(authSessions.id, sessionId))
	const session = foundSessions[0]
	if (!session?.isActive) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Session is not active" })
	}
	return next({
		ctx: {
			userId: session.userId,
		},
	})
})
