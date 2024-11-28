import { TRPCError } from "@trpc/server"
import jwt from "@tsndr/cloudflare-worker-jwt"
import { eq } from "drizzle-orm"

import { middleware } from "../context"
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
	} catch {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	const { payload } = jwt.decode(token)
	const { sessionId } = payload as { sessionId: string }
	const session = await ctx.db.query.authSessions.findFirst({
		where: eq(authSessions.id, sessionId),
	})
	if (!session?.isActive) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Session is not active" })
	}
	return next({
		ctx: {
			userId: session.userId,
		},
	})
})
