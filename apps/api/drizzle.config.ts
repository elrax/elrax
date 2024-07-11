import type { Config } from "drizzle-kit"

/**
 * This is the config for __drizzle-kit__.
 * It's used to generate migrations for the database.
 * You can find documentation here: https://orm.drizzle.team/kit-docs/conf.
 *
 * If you are looking for how to apply and list available migrations see __Cloudflare D1__
 * documentation: https://developers.cloudflare.com/workers/wrangler/commands/#d1 and
 * __package.json__ file.
 */
export default {
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "d1",
	dbCredentials: {
		wranglerConfigPath: "./wrangler.toml",
		dbName: "dev-db",
	},
} satisfies Config
