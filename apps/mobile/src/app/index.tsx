import React, { useEffect, useRef, useState } from "react"
import { Dimensions, View, Text } from "react-native"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { setStatusBarStyle } from "expo-status-bar"
import { Logs } from "expo"
import Constants from "expo-constants"
import { FeedVideo, type FeedItem, type FeedVideoRef } from "~/components/FeedItem"
import { Icon } from "~/components/Icon"
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
				uri: "https://i.imgur.com/p9ETOA8.mp4",
				uriPreview: "https://i.imgur.com/ljZTgRN.jpeg",
				description: "Fine jewelry created just for you. Hand crafted and well made goods.",
				author: {
					id: "1",
					username: "jewerlydesign",
					displayName: "John Doe",
					uriAvatar: "https://i.imgur.com/ljZTgRN.jpeg",
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
					displayName: "John Koe",
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
			<View
				className="absolute z-20 p-4 pr-5 w-full flex-row justify-between items-center"
				style={{
					top: Constants.statusBarHeight,
					shadowColor: "#000",
					shadowOffset: {
						width: 0,
						height: 0,
					},
					shadowOpacity: 0.4,
					shadowRadius: 2,
				}}
			>
				<View>
					<Text className="font-ns-bold text-2xl text-white">
						Series <Icon size={16} name="chevron-down" />
					</Text>
					<Text className="font-ns-body text-base text-white align-middle">
						<Icon size={16} name="dribbble" /> Technology
					</Text>
				</View>
				<View>
					<Icon color="white" size={24} name="more-vertical" />
				</View>
			</View>
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
