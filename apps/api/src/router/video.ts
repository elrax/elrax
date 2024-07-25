import z from "zod"
import { createId } from "@paralleldrive/cuid2"
import { TRPCError } from "@trpc/server"
import { eq, and, desc, isNull } from "drizzle-orm"

import { getUserAvatarUrl, getVideoUrl } from "../utils/storage"
import { type Context, procedure, router } from "../context"
import { dateNow } from "../utils/date"
import {
	contentItems,
	getUploadUrls,
	Storage,
	ContentUploadStatus,
	getUserUnuploadedVideos,
	comments,
	getUserOrNull,
	type Comment,
	type User,
} from "../db"
import type { VideoCommentProps, VideoProps } from "../types"
import { auth } from "./middleware"

const transformComment = (ctx: Context, v: Comment & { author: User }) => {
	const avatarUrl = getUserAvatarUrl(
		v.author.id,
		v.author.avatarIndex,
		v.author.storage,
		ctx.env,
		ctx.req.url,
	)
	return {
		id: v.id,
		createdAt: v.createdAt,
		value: v.value,
		replyToCommentId: v.replyToCommentId,
		author: {
			id: v.author.id,
			username: v.author.username,
			displayName: v.author.firstName
				? `${v.author.firstName} ${v.author.lastName}`
				: v.author.username,
			urlAvatar: avatarUrl,
		},
	} as VideoCommentProps
}

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

			let contentItemId = createId()
			const uploadUrls = await getUploadUrls(ctx.env, contentItemId, input.partNames)
			// Finds if the user already has an unuploaded video and updates it
			const userUnuploadedVideos = await getUserUnuploadedVideos(ctx.db, ctx.userId)
			if (userUnuploadedVideos.length > 0 && userUnuploadedVideos[0]) {
				contentItemId = userUnuploadedVideos[0].id
			}
			const newVideo = {
				id: contentItemId,
				title: "untitled video",
				thumbnailIndex: 0,
				storage: Storage.PRIME_R2_BUCKET,
				segmentsNumber: input.partNames.filter((v) => v.includes(".ts")).length,
				uploadStatus: ContentUploadStatus.UPLOADING,
				// References
				authorId: ctx.userId,
				// TODO: Add category to the video
			}
			await ctx.db
				.insert(contentItems)
				.values(newVideo)
				.onConflictDoUpdate({ target: contentItems.id, set: newVideo })
			return {
				contentItemId,
				uploadUrls,
			}
		}),
	updateVideo: procedure
		.use(auth)
		.input(
			z.object({
				contentItemId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const foundVideo = await ctx.db.query.contentItems.findFirst({
				where: eq(contentItems.id, input.contentItemId),
			})
			if (!foundVideo) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Video not found",
				})
			}
			await ctx.db
				.update(contentItems)
				.set({
					// TODO: Should be Checking first, and Ready after author/bot checks the video
					uploadStatus: ContentUploadStatus.READY,
					updatedAt: dateNow(),
				})
				.where(eq(contentItems.id, foundVideo.id))
			return getVideoUrl(foundVideo.id, foundVideo.storage, ctx.env, ctx.req.url)
		}),
	getVideos: procedure.use(auth).query(async ({ ctx }) => {
		// TODO: Add recommendation system
		const foundVideos = await ctx.db.query.contentItems.findMany({
			where: eq(contentItems.uploadStatus, ContentUploadStatus.READY),
			with: {
				author: true,
				// TODO: This is temporary solution. Fix this, we CAN'T
				// load ALL comments for ALL videos we select!
				comments: true,
			},
			limit: 10,
		})
		const recommendedVideos: VideoProps[] = foundVideos.map((v) => {
			const avatarUrl = getUserAvatarUrl(
				v.author.id,
				v.author.avatarIndex,
				v.author.storage,
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
				commentsNumber: v.comments.length,
				category: {
					// TODO: Add category to the video
					icon: "dribbble",
					name: "Technology",
					type: "Series",
				},
				author: {
					id: v.author.id,
					username: v.author.username,
					displayName: v.author.firstName
						? `${v.author.firstName} ${v.author.lastName}`
						: v.author.username,
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
				contentItemId: z.string(),
				offset: z.number().max(1000).optional(),
			}),
		)
		// TODO: Replace with query instead of mutation
		.mutation(async ({ ctx, input }) => {
			const foundComments = await ctx.db.query.comments.findMany({
				// TODO: Add option to get replies to a specific comment
				where: and(
					eq(comments.contentItemId, input.contentItemId),
					isNull(comments.replyToCommentId),
				),
				with: {
					author: true,
				},
				// TODO: Add recommendation system
				orderBy: desc(comments.createdAt),
				limit: 15,
				offset: input.offset || 0,
			})
			const res: VideoCommentProps[] = foundComments.map((v) => transformComment(ctx, v))
			return res
		}),
	addCommentToVideo: procedure
		.use(auth)
		.input(
			z.object({
				comment: z.string().min(1).max(1000),
				contentItemId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const author = await getUserOrNull(ctx.db, { id: ctx.userId })
			if (!author) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Author not found",
				})
			}
			const foundVideo = await ctx.db.query.contentItems.findFirst({
				where: eq(contentItems.id, input.contentItemId),
			})
			if (!foundVideo) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Video not found",
				})
			}
			const comment = await ctx.db
				.insert(comments)
				.values({
					value: input.comment,
					authorId: ctx.userId,
					contentItemId: input.contentItemId,
				})
				.returning()
			if (!comment[0]) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add comment",
				})
			}
			return transformComment(ctx, { ...comment[0], author })
		}),
})
