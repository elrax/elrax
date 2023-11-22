import React, { useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { setStatusBarStyle } from "expo-status-bar"
import { Logs } from "expo"
import { FeedVideo, type FeedItem, type FeedVideoRef } from "~/components/FeedItem"
import FeedTopOverlay from "~/components/FeedTopOverlay"
// import { api } from "~/utils/api"

Logs.enableExpoCliLogging()

export default function Index() {
	setStatusBarStyle("light")

	const [feedVideos, setFeedVideos] = useState([] as FeedItem[])
	const mediaRefs = useRef({} as { [key: string]: FeedVideoRef })

	const tabBarHeight = useBottomTabBarHeight()
	const windowHeight = Dimensions.get("window").height
	const videoHeight = windowHeight - tabBarHeight
	if (videoHeight !== 765) {
		console.log(`${tabBarHeight}, ${windowHeight}, ${videoHeight}`)
	}

	useEffect(() => {
		// const welcomeQuery = api.welcome.useQuery()

		const data = [
			{
				id: "1",
				uri: "https://i.imgur.com/10wReMX.mp4",
				uriPreview: "https://i.imgur.com/1E7pBT2.png",
				description: "Fine jewelry created just for you. Hand crafted and well made goods.",
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
				uri: "https://i.imgur.com/a8n04PT.mp4",
				uriPreview: "https://i.imgur.com/ljZTgRN.jpeg",
				description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				author: {
					id: "2",
					username: "johndoe",
					displayName: `${tabBarHeight}, ${windowHeight}, ${videoHeight}`,
					uriAvatar: "https://i.imgur.com/ljZTgRN.jpeg",
				},
			},
		]
		setFeedVideos(data)
	}, [])

	const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
		changed.forEach((element) => {
			const cell = mediaRefs.current[element.key]
			if (cell) {
				if (element.isViewable) {
					void cell.play()
				} else {
					void cell.pause()
				}
			}
		})
	})

	// Read more about FlashList here: https://shopify.github.io/flash-list/docs/usage/
	return (
		<>
			<FeedTopOverlay />
			<View className="bg-[#000A14] h-full w-full">
				<FlashList
					data={feedVideos}
					renderItem={({ item }) => (
						<FeedVideo
							height={videoHeight}
							item={item}
							ref={(videoRef) => {
								if (videoRef != null) {
									mediaRefs.current[item.id] = videoRef
								}
							}}
						/>
					)}
					pagingEnabled
					decelerationRate={"normal"}
					keyExtractor={(item) => item.id}
					estimatedItemSize={videoHeight}
					removeClippedSubviews
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					alwaysBounceVertical={false}
					viewabilityConfig={{
						itemVisiblePercentThreshold: 50,
					}}
					onViewableItemsChanged={onViewableItemsChanged.current}
				/>
			</View>
		</>
	)
}
