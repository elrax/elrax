import { config } from "dotenv"
import type { Config } from "drizzle-kit"

if (!process.env.TURSO_CONNECTION_URL) {
	config({ path: ".dev.vars" })
}

/**
 * This is the config for __drizzle-kit__.
 * It's used to generate migrations for the database.
 * You can find documentation here: https://orm.drizzle.team/kit-docs/conf.
 */
export default {
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "turso",
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL || ":memory:",
		authToken: process.env.TURSO_AUTH_TOKEN,
	},
} satisfies Config
