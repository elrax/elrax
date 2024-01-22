import type { VideoProps } from "../types"

export const videos: VideoProps[] = [
	{
		id: "1",
		urlVideo: "https://cdn-staging.elrax.com/acjxh8jwbugpip6vvbpoh3q6/video.m3u8",
		urlPoster: "https://i.imgur.com/1E7pBT2.png",
		description: "Fine jewelry created just for you. Hand crafted and well made goods.",
		category: {
			icon: "dribbble",
			name: "Technology",
			type: "Series",
		},
		author: {
			id: "1",
			username: "jewerly",
			displayName: "Tima Miroshnichenko",
			uriAvatar:
				"https://images.pexels.com/users/avatars/3088726/tima-miroshnichenko-388.jpeg?auto=compress&fit=crop&h=130&w=130&dpr=2",
		},
	},
	{
		id: "2",
		urlVideo: "https://cdn-staging.elrax.com/jv309m6az43la5amrajgzymx/video.m3u8",
		urlPoster: "https://i.imgur.com/ljZTgRN.jpeg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		category: {
			icon: "aperture",
			name: "Footage",
			type: "Series",
		},
		author: {
			id: "2",
			username: "johndoe",
			displayName: "John Doe",
			uriAvatar: "https://i.imgur.com/ljZTgRN.jpeg",
		},
	},
	{
		id: "3",
		urlVideo: "https://cdn-staging.elrax.com/na2r23buam6nzguc6znw3dzr/video.m3u8",
		urlPoster: "https://i.imgur.com/ljZTgRN.jpeg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		category: {
			icon: "aperture",
			name: "Footage",
			type: "Series",
		},
		author: {
			id: "2",
			username: "johndoe",
			displayName: "John Doe",
			uriAvatar: "https://i.imgur.com/ljZTgRN.jpeg",
		},
	},
]
