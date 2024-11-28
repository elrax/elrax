import path from "node:path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { migrate } from "drizzle-orm/libsql/migrator"

import type { Database } from "../db"
import * as schema from "../db/schema"

export const initTestDB = async () => {
	const client = createClient({
		url: ":memory:",
	})
	const db = drizzle(client, { schema })
	await migrate(db, { migrationsFolder: path.resolve(__dirname, "../migrations") })
	return db as Database
}
