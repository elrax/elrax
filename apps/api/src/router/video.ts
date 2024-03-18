import z from "zod"
import { createId } from "@paralleldrive/cuid2"
import { TRPCError } from "@trpc/server"
import { eq, and, desc, isNull, sql } from "drizzle-orm"

import { getUserAvatarUrl, getVideoUrl } from "../utils/storage"
import { procedure, router } from "../trpc"
import { dateNow } from "../utils/date"
import {
	users,
	videos,
	getUploadUrls,
	Storage,
	VideoUploadStatus,
	getUserUnuploadedVideos,
	videoComments,
} from "../db"
import type { VideoCommentProps, VideoProps } from "../types"
import { auth } from "./middleware"

export const videoRouter = router({
	getUploadVideoURL: procedure
		.use(auth)
		.input(
			z.object({
				partNames: z.array(z.string()),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// TODO: Probably we need to move this to a durable object logic to prevent
			// multiple user video upload. But it doesn't really matter for now.

			let videoId = createId()
			const uploadUrls = await getUploadUrls(ctx.env, videoId, input.partNames)
			// Finds if the user already has an unuploaded video and updates it
			const userUnuploadedVideos = await getUserUnuploadedVideos(ctx.db, ctx.userId)
			if (userUnuploadedVideos.length > 0 && userUnuploadedVideos[0]) {
				videoId = userUnuploadedVideos[0].id
			}
			const newVideo = {
				id: videoId,
				title: "untitled video",
				thumbnailIndex: 0,
				storage: Storage.PRIME_R2_BUCKET,
				segmentsNumber: input.partNames.filter((v) => v.includes(".ts")).length,
				uploadStatus: VideoUploadStatus.UPLOADING,
				// References
				authorId: ctx.userId,
			}
			await ctx.db
				.insert(videos)
				.values(newVideo)
				.onConflictDoUpdate({ target: videos.id, set: newVideo })
			return {
				videoId,
				uploadUrls,
			}
		}),
	updateVideo: procedure
		.use(auth)
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
					// TODO: Should be Checking first, and Ready after author/bot checks the video
					uploadStatus: VideoUploadStatus.READY,
					updatedAt: dateNow(),
				})
				.where(eq(videos.id, foundVideo.id))
			return getVideoUrl(foundVideo.id, foundVideo.storage, ctx.env, ctx.req.url)
		}),
	getVideos: procedure.use(auth).query(async ({ ctx }) => {
		// TODO: Add recommendation system
		const foundVideos = await ctx.db
			.select()
			.from(videos)
			.innerJoin(users, eq(videos.authorId, users.id))
			.orderBy(sql`RANDOM()`)
			.limit(10)

		const recommendedVideos: VideoProps[] = foundVideos.map(({ users: author, videos: v }) => {
			const avatarUrl = getUserAvatarUrl(
				author.id,
				author.avatarIndex,
				author.storage,
				ctx.env,
				ctx.req.url,
			)
			const urlVideo = getVideoUrl(v.id, v.storage, ctx.env, ctx.req.url)
			const urlPoster = urlVideo.replace("video.m3u8", `thumbnail${v.thumbnailIndex}.png`)
			return {
				id: v.id,
				createdAt: v.createdAt,
				urlVideo,
				urlPoster,
				description: v.description,
				category: {
					// TODO: Add category to the video
					icon: "dribbble",
					name: "Technology",
					type: "Series",
				},
				author: {
					id: author.id,
					username: author.username,
					displayName: author.firstName
						? `${author.firstName} ${author.lastName}`
						: author.username,
					urlAvatar: avatarUrl,
				},
			} as VideoProps
		})
		return recommendedVideos
	}),
	getVideoComments: procedure
		.use(auth)
		.input(
			z.object({
				videoId: z.string(),
				offset: z.number().max(1000).optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const foundComments = await ctx.db
				.select()
				.from(videoComments)
				.innerJoin(users, eq(videoComments.authorId, users.id))
				// TODO: Add option to get replies to a specific comment
				.where(
					and(
						eq(videoComments.id, input.videoId),
						isNull(videoComments.replyToCommentId),
					),
				)
				// TODO: Add recommendation system
				.orderBy(desc(videoComments.createdAt))
				.limit(15)
				.offset(input.offset || 0)
			const comments: VideoCommentProps[] = foundComments.map(
				({ users: author, videoComments: v }) => {
					const avatarUrl = getUserAvatarUrl(
						author.id,
						author.avatarIndex,
						author.storage,
						ctx.env,
						ctx.req.url,
					)
					return {
						id: v.id,
						createdAt: v.createdAt,
						value: v.value,
						replyToCommentId: v.replyToCommentId,
						author: {
							id: author.id,
							username: author.username,
							displayName: author.firstName
								? `${author.firstName} ${author.lastName}`
								: author.username,
							urlAvatar: avatarUrl,
						},
					} as VideoCommentProps
				},
			)
			return comments
		}),
})
