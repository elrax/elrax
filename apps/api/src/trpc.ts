import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import type { inferAsyncReturnType } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { drizzle } from "drizzle-orm/d1"

export type Env = {
	DB: D1Database
	ENVIRONMENT: "dev" | "staging" | "production"
}

export async function createContext(opts: FetchCreateContextFnOptions & { env: Env }) {
	return {
		env: opts.env,
		db: drizzle(opts.env.DB),
	}
}

const t = initTRPC.context<Context>().create({
	transformer: superjson,
})

export type Context = inferAsyncReturnType<typeof createContext>
export const { middleware, router, procedure } = t
