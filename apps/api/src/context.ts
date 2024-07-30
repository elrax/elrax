import superjson from "superjson"
import { initTRPC, type inferAsyncReturnType } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { ZodError } from "zod"

import { Environment } from "./types"
import * as schema from "./db/schema"

/** Server environment variables */
export type Env = {
	// Cloudflare integrations
	BUCKET: R2Bucket
	// System settings
	ENVIRONMENT: Environment
	// Cloudflare R2 storage secrets
	CLOUDFLARE_ACCOUNT_ID: string
	CF_BUCKET_NAME: string
	CF_ACCESS_KEY_ID: string
	CF_SECRET_ACCESS_KEY: string
	// OAuth secrets
	FACEBOOK_APP_ID: string
	FACEBOOK_APP_SECRET: string
	// Crypto secrets
	JWT_SECRET: string
	OTP_SECRET: string
	// Providers
	RESEND_API_KEY: string
	// Database
	TURSO_CONNECTION_URL: string
	TURSO_AUTH_TOKEN: string
}

export const initDB = (env: Env) => {
	const client = createClient({
		url: env.TURSO_CONNECTION_URL,
		authToken: env.TURSO_AUTH_TOKEN,
	})
	return drizzle(client, {
		schema,
	})
}

export async function createContext(opts: FetchCreateContextFnOptions & { env: Env }) {
	return {
		env: opts.env,
		db: initDB(opts.env),
		req: opts.req,
	}
}

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter(opts) {
		const { shape, error, ctx } = opts
		if (ctx?.env.ENVIRONMENT !== Environment.PRODUCTION) {
			console.log(error)
		}
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST" && error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		}
	},
})

export type Context = inferAsyncReturnType<typeof createContext>
export const { middleware, router, procedure } = t
