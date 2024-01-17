import { Hono } from "hono"
import { cors } from "hono/cors"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "./router"
import { createContext, type Env } from "./trpc"
import { initLocalR2Api } from "./utils/localR2"

const app = new Hono<{ Bindings: Env }>()

app.use("*", cors())

initLocalR2Api(app)

// Handle all requests to /v1/* and pass them to the tRPC router
app.use("/v1/*", async (c) => {
	const res = fetchRequestHandler({
		router: appRouter,
		createContext: (opts) =>
			createContext({
				...opts,
				env: c.env,
			}),
		endpoint: "/v1",
		req: c.req.raw,
	})
	return res
})

export default {
	fetch: app.fetch,
}
