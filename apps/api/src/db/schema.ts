import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type { InferSelectModel } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
import { Storage, VideoUploadStatus } from "./types"
import { dateNow } from "../utils/date"

// Users

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$default(dateNow),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	email: text("email").notNull(),
	username: text("username").notNull(),
	displayName: text("displayName"),
	avatarIndex: integer("avatarIndex").notNull().default(0),
	storage: integer("storage").$type<Storage>().notNull().default(Storage.PRIME_R2_BUCKET),
})

export type User = InferSelectModel<typeof users>
export const UserSchema = createSelectSchema(users)

// Categories

export const categories = sqliteTable("categories", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$default(dateNow),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	name: text("name").notNull(),
	type: text("type").notNull(),
	icon: text("icon").notNull(),
})

export type Category = InferSelectModel<typeof categories>
export const CategorySchema = createSelectSchema(categories)

// Videos

export const videos = sqliteTable("videos", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$default(dateNow),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	// Properties
	title: text("title").notNull(),
	description: text("description"),
	thumbnailIndex: integer("thumbnailIndex").notNull().default(0),
	storage: integer("storage").$type<Storage>().notNull().default(Storage.PRIME_R2_BUCKET),
	segmentsNumber: integer("segmentsNumber").notNull(),
	uploadStatus: integer("uploadStatus")
		.$type<VideoUploadStatus>()
		.notNull()
		.default(VideoUploadStatus.Uploading),
	// References
	authorId: text("userId")
		.notNull()
		.references(() => users.id),
	categoryId: text("categoryId").references(() => categories.id),
})

export type Video = InferSelectModel<typeof videos>
export const VideoSchema = createSelectSchema(videos)
