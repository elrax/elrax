import React, { useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import FeedVideo, { type FeedVideoItem, type FeedVideoRef } from "~/components/FeedVideo"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { setStatusBarStyle } from "expo-status-bar"
import { Logs } from "expo"
// import { api } from "~/utils/api"

Logs.enableExpoCliLogging()

export default function Index() {
	setStatusBarStyle("light")

	const [feedVideos, setFeedVideos] = useState([] as FeedVideoItem[])
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
				uri: "https://i.imgur.com/p9ETOA8.mp4",
				uriPreview: "https://i.imgur.com/ljZTgRN.jpeg",
			},
			{
				id: "2",
				uri: "https://i.imgur.com/a8n04PT.mp4",
				uriPreview: "https://i.imgur.com/ljZTgRN.jpeg",
			},
		]
		setFeedVideos(data)
	}, [])

	const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
		changed.forEach((element) => {
			const cell = mediaRefs.current[element.key]
			if (cell) {
				// console.log(`element: ${JSON.stringify(element)}`)
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
		<View className="bg-[#000A14] h-full w-full">
			<FlashList
				data={feedVideos}
				renderItem={({ item }) => (
					<FeedVideo
						videoHeight={videoHeight}
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
				alwaysBounceVertical={false}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50,
					minimumViewTime: 1000,
				}}
				onViewableItemsChanged={onViewableItemsChanged.current}
			/>
		</View>
	)
}
