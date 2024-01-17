CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`displayName` text,
	`avatarIndex` integer DEFAULT 0 NOT NULL,
	`storage` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text PRIMARY KEY NOT NULL,
	`updatedAt` integer NOT NULL,
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
