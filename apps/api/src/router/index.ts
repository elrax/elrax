import { AwsClient } from "aws4fetch"
import z from "zod"
import { createId } from "@paralleldrive/cuid2"
import { TRPCError } from "@trpc/server"
import { eq, sql } from "drizzle-orm"
import { Storage, VideoUploadStatus } from "../db/types"
import { getVideoUrl } from "../utils/storage"
import { type Env, Environment, procedure, router } from "../trpc"
import { dateNow } from "../utils/date"
import { users, videos } from "../db/schema"
import type { VideoProps } from "../types"

const getUploadUrls = async (env: Env, videoId: string, partNames: string[]) => {
	const m3u8File = partNames.find((v) => v.includes(".m3u8"))
	if (!m3u8File) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Missing m3u8 file",
		})
	}

	const r2 = new AwsClient({
		accessKeyId: env.CF_ACCESS_KEY_ID,
		secretAccessKey: env.CF_SECRET_ACCESS_KEY,
	})
	const bucketName = env.CF_BUCKET_NAME
	const accountId = env.CF_ACCOUNT_ID
	const uploadUrl = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com`

	const uploadUrls: { [partName: string]: string } = {}
	for (const partName of partNames) {
		// If local development - use a local endpoint to upload the file
		if (env.ENVIRONMENT === Environment.DEV) {
			uploadUrls[partName] = `/dev/uploadFile/${videoId}/${partName}`
			continue
		}
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
				// TODO: Add time constraints to request
				// headers: {
				// 	"If-Unmodified-Since": "Tue, 28 Sep 2021 16:00:00 GMT",
				// },
			},
		)
		uploadUrls[partName] = signed.url
	}
	return uploadUrls
}

export const appRouter = router({
	getUploadVideoURL: procedure
		.input(
			z.object({
				partNames: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const videoId = createId()
			const uploadUrls = await getUploadUrls(ctx.env, videoId, input.partNames)

			// TODO: Remove this
			await ctx.db
				.insert(users)
				.values({
					id: "mock",
					email: "mock",
					username: "mock",
				})
				.onConflictDoNothing()

			// TODO: Check if user already has an untitled and unuploaded video and update it
			await ctx.db.insert(videos).values({
				id: videoId,
				title: "untitled video",
				thumbnailIndex: 0,
				storage: Storage.PRIME_R2_BUCKET,
				segmentsNumber: input.partNames.filter((v) => v.includes(".ts")).length,
				uploadStatus: VideoUploadStatus.Uploading,
				// References
				authorId: "mock",
			})

			return {
				videoId,
				uploadUrls,
			}
		}),
	updateVideo: procedure
		.input(
			z.object({
				videoId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const foundVideos = await ctx.db
				.select()
				.from(videos)
				.where(eq(videos.id, input.videoId))
			const foundVideo = foundVideos[0]
			if (!foundVideo) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Video not found",
				})
			}

			await ctx.db
				.update(videos)
				.set({
					uploadStatus: VideoUploadStatus.Ready,
					updatedAt: dateNow(),
				})
				.where(eq(videos.id, foundVideo.id))
			console.log(foundVideos)

			return getVideoUrl(foundVideo.id, foundVideo.storage, ctx.env, ctx.req.url)
		}),
	getVideos: procedure.query(async ({ ctx }) => {
		const foundVideos = await ctx.db
			.select()
			.from(videos)
			.orderBy(sql`RANDOM()`)
			.limit(10)

		const recommendedVideos: VideoProps[] = foundVideos.map((v) => {
			const urlVideo = getVideoUrl(v.id, v.storage, ctx.env, ctx.req.url)
			const urlPoster = urlVideo.replace("video.m3u8", `thumbnail${v.thumbnailIndex}.png`)
			return {
				id: v.id,
				createdAt: v.createdAt,
				urlVideo,
				urlPoster,
				description: v.description,
				category: {
					icon: "dribbble",
					name: "Technology",
					type: "Series",
				},
				author: {
					id: "mock",
					username: "mock",
					displayName: "mock",
					uriAvatar: "https://i.imgur.com/ljZTgRN.jpeg",
				},
			} as VideoProps
		})
		return recommendedVideos
	}),
})

export type AppRouter = typeof appRouter
