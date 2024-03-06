import { type Database, users } from "../"
import { eq } from "drizzle-orm"

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
