import { default as SqliteDB } from "bun:sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { drizzle } from "drizzle-orm/bun-sqlite"
import * as schema from "./db/schema"
import type { Database } from "./db"

export const initTestDB = async () => {
	const sqliteDB = new SqliteDB(":memory:")
	const db = drizzle(sqliteDB, { schema })
	await migrate(db, { migrationsFolder: "./migrations" })
	return db as Database
}
