import React, { useEffect, useRef, useState } from "react"
import { Dimensions, RefreshControl, Text, View } from "react-native"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { setStatusBarStyle } from "expo-status-bar"
import { CacheManagerProvider, LFUPolicy } from "react-native-cache-video"
import type { VideoProps } from "@elrax/api"
import { FeedVideo, type FeedVideoRef } from "~/components/Video"
import FeedTopOverlay from "~/components/FeedTopOverlay"
import { api } from "~/utils/api"
import { useVideoViewState } from "~/stores/videoViewState"

export default function Index() {
	setStatusBarStyle("light")

	const [category, setCategory] = useState({
		icon: "download-cloud",
		name: "Loading",
		type: "Series",
	})
	const [feedVideos, setFeedVideos] = useState([] as VideoProps[])
	const [isLoading, setIsLoading] = useState(true)
	const [currentVideoId] = useVideoViewState((state) => [state.currentVideoId])
	const mediaRefs = useRef({} as { [key: string]: FeedVideoRef })
	const lfuPolicyRef = useRef(new LFUPolicy(5))

	const tabBarHeight = useBottomTabBarHeight()
	const windowHeight = Dimensions.get("window").height
	const videoHeight = windowHeight - tabBarHeight
	if (videoHeight !== 765) {
		console.log(`${tabBarHeight}, ${windowHeight}, ${videoHeight}`)
	}

	const videos = api.getVideos.useQuery()
	if (!videos.isLoading && isLoading) {
		setIsLoading(false)
	}
	useEffect(() => {
		console.log(`videos status: ${videos.status}`)
		if (videos.data && videos.data.length > 0) {
			if (feedVideos.length > 0 && currentVideoId) {
				mediaRefs.current[currentVideoId]?.pause()
			}
			setFeedVideos(videos.data)
		}
	}, [videos.data])

	const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
		changed.forEach((element) => {
			// console.log(`${JSON.stringify(element)}`)
			const cell = mediaRefs.current[element.key]
			if (cell) {
				if (element.isViewable) {
					console.log(`Playing: ${element.key}`)
					setCategory(cell.getItem().category)
					cell.play()
				} else {
					cell.pause()
				}
			}
		})
	})

	// Read more about FlashList here: https://shopify.github.io/flash-list/docs/usage/
	return (
		<>
			<FeedTopOverlay category={category} />
			<View className="bg-[#000A14] h-full w-full">
				<CacheManagerProvider cachePolicy={lfuPolicyRef.current}>
					<FlashList
						data={feedVideos}
						renderItem={({ item }) => (
							<FeedVideo
								height={videoHeight}
								item={item}
								ref={(videoRef) => {
									if (videoRef != null) {
										mediaRefs.current[item.id] = videoRef
										if (currentVideoId === item.id) {
											videoRef.play()
										}
									}
								}}
							/>
						)}
						ListEmptyComponent={
							<View
								className="flex items-center justify-center"
								style={{
									height: videoHeight,
								}}
							>
								<Text className="font-ns-bold text-base color-white">
									{videos?.isLoading ? "Loading..." : "No videos found."}
								</Text>
							</View>
						}
						refreshControl={
							<RefreshControl
								titleColor={"transparent"}
								tintColor={"#fff"}
								progressViewOffset={30}
								refreshing={isLoading}
								onRefresh={() => {
									setIsLoading(true)
									videos.refetch()
								}}
							/>
						}
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
				</CacheManagerProvider>
			</View>
		</>
	)
}
