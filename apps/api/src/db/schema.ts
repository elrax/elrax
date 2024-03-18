import { type AnySQLiteColumn, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import type { InferSelectModel } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
import {
	type SignedWith,
	Storage,
	VideoUploadStatus,
	UserOnboardingStatus,
	VideoCommentType,
	VideoCommentStatus,
} from "./types"
import { dateNow } from "../utils/date"

// Users

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	// Onboarding
	onboardingStatus: integer("onboardingStatus")
		.$type<UserOnboardingStatus>()
		.notNull()
		.default(UserOnboardingStatus.FINISHED_FIRST_STEP),
	signedUpWith: integer("signedUpWith").$type<SignedWith>().notNull(),
	// Email
	email: text("email").unique(),
	emailVerificationOTP: text("emailVerificationOTP"),
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
	// Profile
	username: text("username").unique(),
	firstName: text("firstName"),
	lastName: text("lastName"),
	// Socials and integrations
	appleId: text("appleId").unique(),
	googleId: text("googleId").unique(),
	facebookId: text("facebookId").unique(),
	// Uploaded user files
	avatarIndex: integer("avatarIndex").notNull().default(0),
	storage: integer("storage").$type<Storage>().notNull().default(Storage.PRIME_R2_BUCKET),
})

export type User = InferSelectModel<typeof users>
export const UserSchema = createSelectSchema(users)

// Auth Sessions

export const authSessions = sqliteTable("authSessions", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	signedInWith: integer("signedInWith").$type<SignedWith>().notNull(),
	device: text("device").notNull(),
	ipLocation: text("ipLocation").notNull(),
	emailAuthOTP: text("emailAuthOTP"),
	isActive: integer("isActive", { mode: "boolean" }).notNull(),
	/* References */
	userId: text("userId")
		.notNull()
		.references(() => users.id),
})

export type AuthSessions = InferSelectModel<typeof authSessions>
export const AuthSessionSchema = createSelectSchema(authSessions)

// Categories

export const categories = sqliteTable("categories", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	name: text("name").notNull(),
	type: text("type").notNull(),
	icon: text("icon").notNull(),
})

export type Category = InferSelectModel<typeof categories>
export const CategorySchema = createSelectSchema(categories)

// Videos

export const videos = sqliteTable("videos", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	title: text("title").notNull(),
	description: text("description"),
	thumbnailIndex: integer("thumbnailIndex").notNull().default(0),
	storage: integer("storage").$type<Storage>().notNull().default(Storage.PRIME_R2_BUCKET),
	segmentsNumber: integer("segmentsNumber").notNull(),
	uploadStatus: integer("uploadStatus")
		.$type<VideoUploadStatus>()
		.notNull()
		.default(VideoUploadStatus.UPLOADING),
	/* References */
	authorId: text("userId")
		.notNull()
		.references(() => users.id),
	categoryId: text("categoryId").references(() => categories.id),
})

export type Video = InferSelectModel<typeof videos>
export const VideoSchema = createSelectSchema(videos)

// Video Comments

export const videoComments = sqliteTable("videoComments", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	value: text("value").notNull(),
	commentType: integer("commentType")
		.$type<VideoCommentType>()
		.notNull()
		.default(VideoCommentType.STANDARD),
	status: integer("status")
		.$type<VideoCommentStatus>()
		.notNull()
		.default(VideoCommentStatus.VISIBLE),
	/* References */
	videoId: text("videoId")
		.notNull()
		.references(() => videos.id),
	replyToCommentId: text("replyToCommentId").references((): AnySQLiteColumn => videoComments.id),
	authorId: text("userId")
		.notNull()
		.references(() => users.id),
})

export type VideoComment = InferSelectModel<typeof videoComments>
export const VideoCommentSchema = createSelectSchema(videoComments)
