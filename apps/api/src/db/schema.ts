import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type { InferSelectModel } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
import { dateNow } from "../utils/date"

// Users

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	username: text("name").notNull(),
	displayName: text("displayName"),
	uriAvatar: text("title"),
})

export type User = InferSelectModel<typeof users>
export const UserSchema = createSelectSchema(users)

// Categories

export const categories = sqliteTable("categories", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	name: text("name").notNull(),
	type: text("type").notNull(),
	icon: text("icon").notNull(),
})

export type Category = InferSelectModel<typeof categories>
export const CategorySchema = createSelectSchema(categories)

// Videos

/** Status of the video upload */
export enum VideoUploadStatus {
	/** Nothing uploaded yet, just called the API for Presigned URL */
	Uploading = 0,
	/** Segments are uploaded to R2 and now we need to check if the video is valid */
	Checking = 1,
	/** Video is valid and ready to be played */
	Ready = 2,
	/** Video files are corrupted and need to be re-uploaded */
	Corrupted = 3,
}

/** Where the video files are stored */
export enum VideoStorage {
	/**
	 * Main instance of R2 Bucket
	 *
	 * __Important__: There are different storages for Staging and Production environments.
	 */
	PRIME_R2_BUCKET = 0,
}

export const videos = sqliteTable("videos", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	title: text("title").notNull(),
	description: text("description"),
	thumbnailIndex: integer("thumbnailIndex").notNull().default(0),
	storage: integer("storage")
		.$type<VideoStorage>()
		.notNull()
		.default(VideoStorage.PRIME_R2_BUCKET),
	segmentsNumber: integer("segmentsNumber").notNull(),
	uploadStatus: integer("uploadStatus")
		.$type<VideoUploadStatus>()
		.notNull()
		.default(VideoUploadStatus.Uploading),
	// References
	authorId: text("userId")
		.notNull()
		.references(() => users.id),
	categoryId: text("categoryId")
		.notNull()
		.references(() => categories.id),
})

export type Video = InferSelectModel<typeof videos>
export const VideoSchema = createSelectSchema(videos)
