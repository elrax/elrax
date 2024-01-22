import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { inferAsyncReturnType } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { drizzle } from "drizzle-orm/d1"
import type { Environment } from "./types"

/** Server environment variables */
export type Env = {
	DB: D1Database
	BUCKET: R2Bucket

	ENVIRONMENT: Environment
	CF_BUCKET_NAME: string
	CF_ACCOUNT_ID: string
	CF_ACCESS_KEY_ID: string
	CF_SECRET_ACCESS_KEY: string
}

export async function createContext(opts: FetchCreateContextFnOptions & { env: Env }) {
	return {
		env: opts.env,
		db: drizzle(opts.env.DB),
		req: opts.req,
	}
}

const t = initTRPC.context<Context>().create({
	transformer: superjson,
})

export type Context = inferAsyncReturnType<typeof createContext>
export const { middleware, router, procedure } = t
