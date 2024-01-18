import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import type { NativeTouchEvent } from "react-native"
import Video, { type VideoRef } from "react-native-video"
import { useNavigation } from "expo-router"
import type { VideoProps } from "@elrax/api"
import type { FeedVideoRef } from "./types"
import { Overlay } from "./Overlay"

export type FeedVideoProps = {
	item: VideoProps
	height: number
	isVisible: boolean
}

export const FeedVideo = forwardRef((props: FeedVideoProps, parentRef: React.Ref<FeedVideoRef>) => {
	const navigation = useNavigation()

	const refVideo = useRef<VideoRef>(null)
	const [muted, setMuted] = useState(false)
	const [paused, setPaused] = useState(true)
	const [lastTouchPos, setLastTouchPos] = useState(null as null | NativeTouchEvent)
	const [overlayOpacity, setOverlayOpacity] = useState(1)
	const [pauseTimeoutId, setPauseTimeoutId] = useState(
		null as null | ReturnType<typeof setTimeout>,
	)

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
		const unsub1 = navigation.addListener("blur", () => {
			if (props.isVisible) {
				pause()
			}
		})
		const unsub2 = navigation.addListener("focus", () => {
			if (props.isVisible) {
				play()
			}
		})
		return () => {
			unsub1()
			unsub2()
		}
	}, [navigation])

	const getItem = () => {
		return props.item
	}

	const play = () => {
		if (!refVideo.current) return
		console.debug(`Video ${props.item.id}: play`)
		setPaused(false)
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
				style={{
					width: "100%",
					height: props.height,
				}}
				poster={props.item.uriPreview}
				posterResizeMode={"cover"}
				paused={paused}
				mixWithOthers="duck"
				ignoreSilentSwitch="ignore"
				source={{ uri: props.item.uri }}
				repeat
				muted={muted}
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
					if (isClicked && refVideo.current && !paused) {
						setMuted(!muted)
					}

					// TODO: Fix bug with resume on scroll
					// + isVisible sometimes not correct
					// if (props.isVisible) {}
					play()
					setLastTouchPos(null)
				}}
			/>
		</>
	)
})
