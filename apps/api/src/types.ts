/** Application environments */
export enum Environment {
	DEV = "dev",
	STAGING = "staging",
	PRODUCTION = "production",
}

export type Category = {
	icon: string
	name: string
	type: string
}

export type VideoProps = {
	id: string
	createdAt: Date
	urlVideo: string
	urlPoster: string
	description?: string
	category: Category
	author: {
		id: string
		username: string
		displayName: string
		urlAvatar: string
	}
}

export type VideoCommentProps = {
	id: string
	value: string
	replyToCommentId: string
	author: {
		id: string
		username: string
		displayName: string
		urlAvatar: string
	}
}
