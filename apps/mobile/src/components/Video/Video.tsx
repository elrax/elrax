import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { type NativeTouchEvent } from "react-native"
import Video, { type VideoRef } from "react-native-video"
import { useNavigation } from "expo-router"
// import { useAsyncCache } from "react-native-cache-video"
import type { VideoProps } from "@elrax/api"
import type { FeedVideoRef } from "./types"
import { Overlay } from "./Overlay"
import { useVideoViewState } from "~/stores/videoViewState"

export type FeedVideoProps = {
	item: VideoProps
	height: number
}

export const FeedVideo = forwardRef((props: FeedVideoProps, parentRef: React.Ref<FeedVideoRef>) => {
	const navigation = useNavigation()

	const refVideo = useRef<VideoRef>(null)
	const [isMuted, toggleMute, setCurrentVideoId] = useVideoViewState((state) => [
		state.isMuted,
		state.toggleMute,
		state.setCurrentVideoId,
	])
	const [paused, setPaused] = useState(true)
	const [lastTouchPos, setLastTouchPos] = useState(null as null | NativeTouchEvent)
	const [overlayOpacity, setOverlayOpacity] = useState(1)
	const [pauseTimeoutId, setPauseTimeoutId] = useState(
		null as null | ReturnType<typeof setTimeout>,
	)
	// const { setVideoPlayUrlBy, cachedVideoUrl } = useAsyncCache()

	useImperativeHandle(
		parentRef,
		() => ({
			getItem,
			play,
			pause,
		}),
		[],
	)

	useEffect(() => {
		const unsub2 = navigation.addListener("focus", () => {
			if (isVisible()) play()
		})
		const unsub1 = navigation.addListener("blur", () => {
			pause()
		})
		return () => {
			unsub1()
			unsub2()
		}
	}, [navigation])

	const isVisible = () => props.item.id === useVideoViewState.getState().currentVideoId

	const getItem = () => {
		return props.item
	}

	const play = () => {
		if (!refVideo.current) return
		console.debug(`Video ${props.item.id}: play`)
		// setVideoPlayUrlBy(props.item.urlVideo)
		// setVideoPlayUrlBy("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8")
		setPaused(false)
		setCurrentVideoId(props.item.id)
	}

	const pause = () => {
		if (!refVideo.current) return
		console.debug(`Video ${props.item.id}: pause`)
		setPaused(true)
	}

	const setPauseTimeout = () => {
		const timeoutId = setTimeout(() => {
			setOverlayOpacity(0)
			pause()
		}, 200)
		setPauseTimeoutId(timeoutId)
	}

	const clearPauseTimeout = (opacity?: number) => {
		if (opacity) {
			setOverlayOpacity(opacity)
		}
		if (pauseTimeoutId) {
			setPauseTimeoutId(null)
			clearTimeout(pauseTimeoutId)
		}
	}

	// Read more about Video component here: https://react-native-video.github.io/react-native-video
	return (
		<>
			<Overlay item={props.item} height={props.height} opacity={overlayOpacity} />
			<Video
				ref={refVideo}
				style={{ height: props.height }}
				source={{
					uri: props.item.urlVideo /* cachedVideoUrl */,
				}}
				poster={props.item.urlPoster}
				posterResizeMode={"cover"}
				paused={paused}
				mixWithOthers="duck"
				ignoreSilentSwitch="ignore"
				repeat
				muted={isMuted}
				onError={(e) => {
					console.log(`Video error ${props.item.id}: ${JSON.stringify(e)}`)
				}}
				resizeMode="cover"
				onTouchStart={(e) => {
					setLastTouchPos(e.nativeEvent)
					setPauseTimeout()
				}}
				onTouchMove={() => {
					clearPauseTimeout()
				}}
				onTouchEnd={(e) => {
					clearPauseTimeout(1)

					const x = e.nativeEvent.locationX
					const y = e.nativeEvent.locationY
					const isClicked = lastTouchPos?.locationX === x || lastTouchPos?.locationY === y
					if (isClicked && !paused) {
						toggleMute()
						console.log(`Video ${props.item.id}: toggle mute`)
					}

					if (isVisible() && paused) play()
					setLastTouchPos(null)
				}}
			/>
		</>
	)
})
