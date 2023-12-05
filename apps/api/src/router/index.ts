import { procedure, router } from "../trpc"
import { users } from "../schema"

export const appRouter = router({
	getVideos: procedure.query(async ({ ctx }) => {
		const result = await ctx.db.select().from(users).all()
		console.log(result)

		const data = [
			{
				id: "1",
				uri: "https://pub-ea97d46c112a41d586775fe849ec9f70.r2.dev/10wReMX/10wReMX.m3u8",
				uriPreview: "https://i.imgur.com/1E7pBT2.png",
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
				uri: "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8",
				uriPreview: "https://i.imgur.com/ljZTgRN.jpeg",
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
		return data
	}),
})

export type AppRouter = typeof appRouter
