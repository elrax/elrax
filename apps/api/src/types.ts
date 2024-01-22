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
	urlVideo: string
	urlPoster: string
	description?: string
	category: Category
	author: {
		id: string
		username: string
		displayName: string
		uriAvatar: string
	}
}
