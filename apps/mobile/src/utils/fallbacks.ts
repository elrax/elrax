import type { VideoProps } from "@elrax/api"

export const fallbackVideos: VideoProps[] = [
	{
		id: "1",
		urlVideo: "https://cdn-staging.elrax.com/10wReMX/10wReMX.m3u8",
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
]
