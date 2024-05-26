import { type AnySQLiteColumn, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { relations, type InferSelectModel } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { createId } from "@paralleldrive/cuid2"
import {
	type SignedWith,
	Storage,
	VideoUploadStatus,
	UserOnboardingStatus,
	VideoCommentType,
	VideoCommentStatus,
	type OTPVerificationType,
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
	emailVerified: integer("emailVerified", { mode: "boolean" }).notNull().default(false),
	// Username
	username: text("username").notNull().unique(),
	previousUsername: text("previousUsername"),
	usernameUpdatedAt: integer("usernameUpdatedAt", { mode: "timestamp" }),
	// Profile
	firstName: text("firstName"),
	lastName: text("lastName"),
	// Socials and integrations
	appleId: text("appleId").unique(),
	googleId: text("googleId").unique(),
	facebookId: text("facebookId").unique(),
	// Uploaded user files
	avatarIndex: integer("avatarIndex"),
	storage: integer("storage").$type<Storage>().notNull().default(Storage.PRIME_R2_BUCKET),
})

export const usersRelations = relations(users, ({ many }) => ({
	videos: many(videos),
	authSessions: many(authSessions),
}))

export type User = InferSelectModel<typeof users>
export const UserSchema = createSelectSchema(users)

// OTP Verifications

export const otpVerifications = sqliteTable("otpVerifications", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	secret: text("secret").notNull(),
	type: integer("type").$type<OTPVerificationType>().notNull(),
	/* References */
	userId: text("userId")
		.notNull()
		.references(() => users.id),
})

export const otpVerificationsRelations = relations(otpVerifications, ({ one }) => ({
	user: one(users, {
		fields: [otpVerifications.userId],
		references: [users.id],
	}),
}))

export type OTPVerifications = InferSelectModel<typeof otpVerifications>
export const OTPVerificationSchema = createSelectSchema(otpVerifications)

// Auth Sessions

export const authSessions = sqliteTable("authSessions", {
	id: text("id").primaryKey().$default(createId),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
	/* Properties */
	signedInWith: integer("signedInWith").$type<SignedWith>().notNull(),
	device: text("device").notNull(),
	ipLocation: text("ipLocation").notNull(),
	isActive: integer("isActive", { mode: "boolean" }).notNull(),
	/* References */
	userId: text("userId")
		.notNull()
		.references(() => users.id),
})

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
	user: one(users, {
		fields: [authSessions.userId],
		references: [users.id],
	}),
}))

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

export const categoriesRelations = relations(categories, ({ many }) => ({
	videos: many(videos),
}))

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

export const videosRelations = relations(videos, ({ many, one }) => ({
	author: one(users, {
		fields: [videos.authorId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
	comments: many(videoComments),
}))

export type Video = InferSelectModel<typeof videos>
export const VideoSchema = createSelectSchema(videos)

// Video Comments

export const videoComments = sqliteTable("videoComments", {
	id: text("id").primaryKey().$default(createId),
	updatedAt: integer("updatedAt", { mode: "timestamp" }),
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

export const videoCommentsRelations = relations(videoComments, ({ one }) => ({
	video: one(videos, {
		fields: [videoComments.videoId],
		references: [videos.id],
	}),
	replyToComment: one(videoComments, {
		fields: [videoComments.replyToCommentId],
		references: [videoComments.id],
	}),
	author: one(users, {
		fields: [videoComments.authorId],
		references: [users.id],
	}),
}))

export type VideoComment = InferSelectModel<typeof videoComments>
export const VideoCommentSchema = createSelectSchema(videoComments)
