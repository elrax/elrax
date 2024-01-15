import { procedure, router } from "../trpc"
import { AwsClient } from "aws4fetch"
import z from "zod"
import { videos } from "../db/seed"
import { createId } from "@paralleldrive/cuid2"

export const appRouter = router({
	getUploadVideoURL: procedure
		.input(
			z.object({
				partNames: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// TODO: Move this logic to Durable Objects

			const videoId = createId()

			const r2 = new AwsClient({
				accessKeyId: ctx.env.CF_ACCESS_KEY_ID,
				secretAccessKey: ctx.env.CF_SECRET_ACCESS_KEY,
			})
			const bucketName = ctx.env.CF_BUCKET_NAME
			const accountId = ctx.env.CF_ACCOUNT_ID
			const uploadUrl = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com`

			const signedUrls: { [partName: string]: string } = {}
			for (const partName of input.partNames) {
				const url = new URL(uploadUrl)
				// Preserve the original path
				url.pathname = `/${videoId}/${partName}`
				// Specify a custom expiry for the presigned URL, in seconds
				url.searchParams.set("X-Amz-Expires", "3600")
				const signed = await r2.sign(
					new Request(url, {
						method: "PUT",
					}),
					{
						aws: { signQuery: true },
						// headers: {
						// 	"If-Unmodified-Since": "Tue, 28 Sep 2021 16:00:00 GMT",
						// },
					},
				)
				signedUrls[partName] = signed.url
			}
			return signedUrls
		}),
	getVideos: procedure.query(async ({}) => {
		// return await ctx.db.select().from(videos)
		return videos
	}),
})

export type AppRouter = typeof appRouter
