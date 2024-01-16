export type Category = {
	icon: string
	name: string
	type: string
}

export type VideoProps = {
	id: string
	uri: string
	uriPreview: string
	description?: string
	category: Category
	author: {
		id: string
		username: string
		displayName: string
		uriAvatar: string
	}
}
