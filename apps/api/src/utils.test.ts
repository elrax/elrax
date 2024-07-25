import { expect, test } from "bun:test"
import { migrate } from "drizzle-orm/libsql/migrator"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"

import * as schema from "./db/schema"
import type { Database } from "./db"

export const initTestDB = async () => {
	const client = createClient({
		url: ":memory:",
	})
	const db = drizzle(client, { schema })
	await migrate(db, { migrationsFolder: "./migrations" })
	return db as Database
}

test("test_initTestDB", async () => {
	const db = await initTestDB()
	const u = await db.query.users.findFirst()
	expect(u).toBeUndefined()
})
