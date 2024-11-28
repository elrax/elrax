import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { FlashList, type ViewToken } from "@shopify/flash-list"
import { router } from "expo-router"
import { setStatusBarStyle } from "expo-status-bar"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, RefreshControl, StyleSheet, Text, View } from "react-native"
import { type CommentItem, Comments, type CommentsMethods } from "~/components/Comments"

import type { VideoProps } from "@elrax/api"
import { toRelative } from "@elrax/api/src/utils/date"
import FeedTopOverlay from "~/components/FeedTopOverlay"
import { FeedVideo, type FeedVideoRef } from "~/components/Video"
import { deleteUserJWT } from "~/stores/userJWT"
import { useVideoViewState } from "~/stores/videoViewState"
import { api } from "~/utils/api"

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
	const commentsRef = useRef<CommentsMethods>(null)
	const comments = useRef([] as CommentItem[])

	const tabBarHeight = useBottomTabBarHeight()
	const windowHeight = Dimensions.get("window").height
	const videoHeight = windowHeight - tabBarHeight
	if (videoHeight !== 765) {
		console.log(`${tabBarHeight}, ${windowHeight}, ${videoHeight}`)
	}

	const addCommentToVideo = api.video.addCommentToVideo.useMutation()
	const getVideoComments = api.video.getVideoComments.useMutation()
	const videos = api.video.getVideos.useQuery()
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
		// TODO: Move this to a global error handler/helper
		if (videos.error) {
			console.log(`Videos loading error: ${videos.error}`)
			const err = videos.error.data
			if (err?.code === "UNAUTHORIZED") {
				// TODO: Probably better to ask user before?
				deleteUserJWT().then(() => {
					router.replace("/")
				})
			}
		}
	}, [videos.data])

	const onViewableItemsChanged = useRef(({ changed }: { changed: ViewToken[] }) => {
		for (const element of changed) {
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
		}
	})

	const openComments = () => {
		// TODO: Save state and don't load on every open
		commentsRef.current?.presentModal()
		if (!currentVideoId) {
			console.log("No video id")
			return
		}
		getVideoComments.mutateAsync({ contentItemId: currentVideoId }).then((commentsArray) => {
			comments.current = commentsArray.map((comment) => ({
				username: comment.author.username,
				time: toRelative(comment.createdAt),
				text: comment.value,
			}))
		})
	}

	// Read more about FlashList here: https://shopify.github.io/flash-list/docs/usage/
	return (
		<>
			<FeedTopOverlay category={category} />
			<View style={styles.container}>
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
							commentsNumber={
								// TODO: Fix this also. We should show the latest fetched comments number
								comments.current.length > item.commentsNumber
									? comments.current.length
									: item.commentsNumber
							}
							sharesNumber={0}
							onPressComments={openComments}
							onPressReaction={() => ({})}
						/>
					)}
					ListEmptyComponent={
						<View style={[{ height: videoHeight }, styles.listEmptyContainer]}>
							<Text style={styles.listEmptyText}>
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
					decelerationRate="normal"
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
			<Comments
				ref={commentsRef}
				comments={comments.current}
				onSend={async (comment: string) => {
					if (!currentVideoId) {
						console.log("No video id")
						return
					}
					const newComment = await addCommentToVideo.mutateAsync({
						contentItemId: currentVideoId,
						comment,
					})
					const newComments = comments.current
					newComments.unshift({
						username: newComment.author.username,
						time: toRelative(newComment.createdAt),
						text: newComment.value,
					})
					comments.current = newComments
				}}
			/>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		backgroundColor: "#000A14",
	},
	listEmptyContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	listEmptyText: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 16,
		lineHeight: 24,
		color: "#fff",
	},
})
