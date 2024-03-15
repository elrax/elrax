CREATE TABLE `authSessions` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`signedInWith` integer NOT NULL,
	`device` text NOT NULL,
	`ipLocation` text NOT NULL,
	`emailAuthOTP` text,
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
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer,
	`createdAt` integer NOT NULL,
	`onboardingStatus` integer DEFAULT 0 NOT NULL,
	`signedUpWith` integer NOT NULL,
	`email` text,
	`emailVerificationOTP` text,
	`emailVerified` integer DEFAULT false NOT NULL,
	`username` text,
	`firstName` text,
	`lastName` text,
	`appleId` text,
	`googleId` text,
	`facebookId` text,
	`avatarIndex` integer DEFAULT 0 NOT NULL,
	`storage` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `videos` (
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
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_appleId_unique` ON `users` (`appleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_googleId_unique` ON `users` (`googleId`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_facebookId_unique` ON `users` (`facebookId`);