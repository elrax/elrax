CREATE TABLE `videoComments` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`value` text NOT NULL,
	`commentType` integer DEFAULT 0 NOT NULL,
	`status` integer DEFAULT 0 NOT NULL,
	`videoId` text NOT NULL,
	`replyToCommentId` text,
	`userId` text NOT NULL,
	FOREIGN KEY (`videoId`) REFERENCES `videos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`replyToCommentId`) REFERENCES `videoComments`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
/*
 SQLite does not support "Set not null to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/