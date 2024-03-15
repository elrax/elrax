import { eq } from "drizzle-orm"
import jwt from "@tsndr/cloudflare-worker-jwt"
import { type Database, users, authSessions } from "../"
import type { SignedWith } from "../types"
import type { Env } from "../../trpc"

type FindUserType = {
	id?: string
	email?: string
	username?: string
	appleId?: string
	facebookId?: string
	googleId?: string
}

export const getUserOrNull = async (db: Database, val: FindUserType) => {
	const v = Object.entries(val).find(([, v]) => v !== undefined)
	if (!v) {
		throw new Error("SYSTEM: Invalid value provided")
	}
	const foundUsers = await db
		.select()
		.from(users)
		.where(eq(users[v[0] as keyof FindUserType], v[1]))
	return foundUsers[0] ?? null
}

export const signInUserOrCreate = async (
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
	let newUser = false
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
		newUser = true
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
	return {
		newUser,
		token,
	}
}
