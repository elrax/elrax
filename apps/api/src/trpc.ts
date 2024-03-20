import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { inferAsyncReturnType } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { drizzle } from "drizzle-orm/d1"
import type { Environment } from "./types"
import * as schema from "./db/schema"

/** Server environment variables */
export type Env = {
	// Cloudflare integrations
	DB: D1Database
	BUCKET: R2Bucket
	// System settings
	ENVIRONMENT: Environment
	// Cloudflare R2 storage secrets
	CF_BUCKET_NAME: string
	CF_ACCOUNT_ID: string
	CF_ACCESS_KEY_ID: string
	CF_SECRET_ACCESS_KEY: string
	// OAuth secrets
	FACEBOOK_APP_ID: string
	FACEBOOK_APP_SECRET: string
	// Crypto secrets
	JWT_SECRET: string
	// Providers
	RESEND_API_KEY: string
}

export async function createContext(opts: FetchCreateContextFnOptions & { env: Env }) {
	return {
		env: opts.env,
		db: drizzle(opts.env.DB, {
			schema,
		}),
		req: opts.req,
	}
}

const t = initTRPC.context<Context>().create({
	transformer: superjson,
})

export type Context = inferAsyncReturnType<typeof createContext>
export const { middleware, router, procedure } = t
