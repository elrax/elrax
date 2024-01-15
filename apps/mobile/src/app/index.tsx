import React, { useEffect, useRef, useState } from "react"
import { Dimensions, View } from "react-native"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { setStatusBarStyle } from "expo-status-bar"
import { FeedVideo, type VideoProps, type FeedVideoRef } from "~/components/Video"
import FeedTopOverlay from "~/components/FeedTopOverlay"
import { fallbackVideos } from "~/utils/fallbacks"
import { api } from "~/utils/api"

export default function Index() {
	setStatusBarStyle("light")

	const [category, setCategory] = useState({
		icon: "download-cloud",
		name: "Loading",
		type: "Series",
	})
	const [feedVideos, setFeedVideos] = useState([] as VideoProps[])
	const mediaRefs = useRef({} as { [key: string]: FeedVideoRef })

	const tabBarHeight = useBottomTabBarHeight()
	const windowHeight = Dimensions.get("window").height
	const videoHeight = windowHeight - tabBarHeight
	if (videoHeight !== 765) {
		console.log(`${tabBarHeight}, ${windowHeight}, ${videoHeight}`)
	}

	const videos = api.getVideos.useQuery()
	useEffect(() => {
		if (videos.data && videos.data.length > 0) {
			return setFeedVideos(videos.data)
		}
		if (feedVideos.length === 0 && !videos.data) {
			return setFeedVideos(fallbackVideos)
		}
	}, [videos])

	const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
		changed.forEach((element) => {
			const cell = mediaRefs.current[element.key]
			if (cell) {
				if (element.isViewable) {
					setCategory(cell.getItem().category)
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
			<FeedTopOverlay category={category} />
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
