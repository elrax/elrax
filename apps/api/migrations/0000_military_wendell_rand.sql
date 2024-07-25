CREATE TABLE `authSessions` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`signedInWith` integer NOT NULL,
	`device` text NOT NULL,
	`ipLocation` text NOT NULL,
	`isActive` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer,
	`createdAt` integer NOT NULL,
	`value` text NOT NULL,
	`commentType` integer DEFAULT 0 NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`contentItemId` text NOT NULL,
	`replyToCommentId` text,
	`authorId` text NOT NULL,
	FOREIGN KEY (`contentItemId`) REFERENCES `contentItems`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`replyToCommentId`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contentItems` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer,
	`createdAt` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`thumbnailIndex` integer DEFAULT 0 NOT NULL,
	`storage` integer DEFAULT 0 NOT NULL,
	`segmentsNumber` integer NOT NULL,
	`uploadStatus` integer DEFAULT 0 NOT NULL,
	`userId` text NOT NULL,
	`categoryId` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `otpVerifications` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`secret` text NOT NULL,
	`type` integer NOT NULL,
	`userId` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer,
	`createdAt` integer NOT NULL,
	`onboardingStatus` integer DEFAULT 0 NOT NULL,
	`signedUpWith` integer NOT NULL,
	`email` text,
	`emailVerified` integer DEFAULT false NOT NULL,
	`username` text NOT NULL,
	`previousUsername` text,
	`usernameUpdatedAt` integer,
	`firstName` text,
	`lastName` text,
	`appleId` text,
	`googleId` text,
	`facebookId` text,
	`avatarIndex` integer,
	`storage` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `authSessions_userIdIdx` ON `authSessions` (`userId`);--> statement-breakpoint
CREATE INDEX `comments_contentItemIdIdx` ON `comments` (`contentItemId`);--> statement-breakpoint
CREATE INDEX `comments_replyToCommentIdIdx` ON `comments` (`replyToCommentId`);--> statement-breakpoint
CREATE INDEX `comments_authorIdIdx` ON `comments` (`authorId`);--> statement-breakpoint
CREATE INDEX `contentItems_authorIdIdx` ON `contentItems` (`userId`);--> statement-breakpoint
CREATE INDEX `contentItems_categoryId` ON `contentItems` (`categoryId`);--> statement-breakpoint
CREATE INDEX `otpVerifications_userIdIdx` ON `otpVerifications` (`userId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_appleId_unique` ON `users` (`appleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_facebookId_unique` ON `users` (`facebookId`);