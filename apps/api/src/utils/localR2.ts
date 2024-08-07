import { Hono } from "hono"
import type { Env } from "../context"
import { Environment } from "../types"

export const devApi = new Hono<{ Bindings: Env }>()

// Upload file to R2 Bucket. Works only in dev environment
devApi.put("/uploadFile/*", async (c) => {
	if (c.env.ENVIRONMENT !== Environment.DEV) {
		return new Response("Not found", { status: 404 })
	}
	const url = new URL(c.req.url)
	const res = url.pathname.split("/dev/uploadFile")
	const key = res[1]
	if (!key) {
		return new Response("Invalid request", { status: 400 })
	}
	await c.env.BUCKET.put(key, c.req.raw.body)
	return new Response(`Put ${key} successfully!`, { status: 200 })
})

// Get file from R2 Bucket. Works only in dev environment
devApi.get("/getFile/*", async (c) => {
	if (c.env.ENVIRONMENT !== Environment.DEV) {
		return new Response("Not found", { status: 404 })
	}
	const url = new URL(c.req.url)
	const res = url.pathname.split("/dev/getFile")
	const key = res[1]
	if (!key) {
		return new Response("Invalid request", { status: 400 })
	}
	const object = await c.env.BUCKET.get(key)
	if (object === null) {
		return new Response("Object not found", { status: 404 })
	}
	const headers = new Headers()
	object.writeHttpMetadata(headers)
	headers.set("etag", object.httpEtag)
	headers.set("Cache-Control", "max-age=36000")
	return new Response(object.body, {
		headers,
	})
})
