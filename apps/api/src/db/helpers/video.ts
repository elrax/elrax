import { AwsClient } from "aws4fetch"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"

import { Environment } from "../../types"
import type { Env } from "../../trpc"
import { videos, type Database, VideoUploadStatus } from ".."

export const getUserUnuploadedVideos = (db: Database, userId: string) => {
	return db
		.select()
		.from(videos)
		.where(
			and(eq(videos.authorId, userId), eq(videos.uploadStatus, VideoUploadStatus.UPLOADING)),
		)
}

export const getUploadUrls = async (env: Env, videoId: string, partNames: string[]) => {
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
