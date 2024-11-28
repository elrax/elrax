import { createId } from "@paralleldrive/cuid2"
import { type InferInsertModel, type InferSelectModel, relations } from "drizzle-orm"
import { type AnySQLiteColumn, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createSelectSchema } from "drizzle-zod"
import { dateNow } from "../utils/date"
import {
	CommentStatus,
	CommentType,
	ContentUploadStatus,
	type OTPVerificationType,
	type SignedWith,
	Storage,
	UserOnboardingStatus,
} from "./types"

/** Users */

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
	contentItems: many(contentItems),
	authSessions: many(authSessions),
}))

export type User = InferSelectModel<typeof users>
export const UserSchema = createSelectSchema(users)

/** OTP Verifications */

export const otpVerifications = sqliteTable(
	"otpVerifications",
	{
		id: text("id").primaryKey().$default(createId),
		createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
		/* Properties */
		secret: text("secret").notNull(),
		type: integer("type").$type<OTPVerificationType>().notNull(),
		/* References */
		userId: text("userId")
			.notNull()
			.references(() => users.id),
	},
	(table) => {
		return {
			userIdIdx: index("otpVerifications_userIdIdx").on(table.userId),
		}
	},
)

export const otpVerificationsRelations = relations(otpVerifications, ({ one }) => ({
	user: one(users, {
		fields: [otpVerifications.userId],
		references: [users.id],
	}),
}))

export type OTPVerifications = InferSelectModel<typeof otpVerifications>
export const OTPVerificationSchema = createSelectSchema(otpVerifications)

/** Auth Sessions */

export const authSessions = sqliteTable(
	"authSessions",
	{
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
	},
	(table) => {
		return {
			userIdIdx: index("authSessions_userIdIdx").on(table.userId),
		}
	},
)

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
	user: one(users, {
		fields: [authSessions.userId],
		references: [users.id],
	}),
}))

export type AuthSessions = InferSelectModel<typeof authSessions>
export const AuthSessionSchema = createSelectSchema(authSessions)

/** Categories */

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
	contentItems: many(contentItems),
}))

export type Category = InferSelectModel<typeof categories>
export const CategorySchema = createSelectSchema(categories)

/** Content Items */

export const contentItems = sqliteTable(
	"contentItems",
	{
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
			.$type<ContentUploadStatus>()
			.notNull()
			.default(ContentUploadStatus.UPLOADING),
		/* References */
		authorId: text("userId")
			.notNull()
			.references(() => users.id),
		categoryId: text("categoryId").references(() => categories.id),
	},
	(table) => {
		return {
			authorIdIdx: index("contentItems_authorIdIdx").on(table.authorId),
			categoryIdIdx: index("contentItems_categoryId").on(table.categoryId),
		}
	},
)

export const contentItemsRelations = relations(contentItems, ({ many, one }) => ({
	author: one(users, {
		fields: [contentItems.authorId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [contentItems.categoryId],
		references: [categories.id],
	}),
	comments: many(comments),
}))

export type ContentItem = InferSelectModel<typeof contentItems>
export type ContentItemInsert = InferInsertModel<typeof contentItems>
export const ContentItemSchema = createSelectSchema(contentItems)

/** Comments */

export const comments = sqliteTable(
	"comments",
	{
		id: text("id").primaryKey().$default(createId),
		updatedAt: integer("updatedAt", { mode: "timestamp" }),
		createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$default(dateNow),
		/* Properties */
		value: text("value").notNull(),
		commentType: integer("commentType").$type<CommentType>().notNull().default(CommentType.STANDARD),
		status: integer("status").$type<CommentStatus>().notNull().default(CommentStatus.VISIBLE),
		/* References */
		contentItemId: text("contentItemId")
			.notNull()
			.references(() => contentItems.id),
		replyToCommentId: text("replyToCommentId").references((): AnySQLiteColumn => comments.id),
		authorId: text("authorId")
			.notNull()
			.references(() => users.id),
	},
	(table) => {
		return {
			contentItemIdIdx: index("comments_contentItemIdIdx").on(table.contentItemId),
			replyToCommentIdIdx: index("comments_replyToCommentIdIdx").on(table.replyToCommentId),
			authorIdIdx: index("comments_authorIdIdx").on(table.authorId),
		}
	},
)

export const commentsRelations = relations(comments, ({ one }) => ({
	contentItem: one(contentItems, {
		fields: [comments.contentItemId],
		references: [contentItems.id],
	}),
	replyToComment: one(comments, {
		fields: [comments.replyToCommentId],
		references: [comments.id],
	}),
	author: one(users, {
		fields: [comments.authorId],
		references: [users.id],
	}),
}))

export type Comment = InferSelectModel<typeof comments>
export type CommentInsert = InferInsertModel<typeof comments>
export const CommentSchema = createSelectSchema(comments)
