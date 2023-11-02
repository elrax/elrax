import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import type { NativeTouchEvent } from "react-native"
import { ResizeMode, Audio, Video } from "expo-av"
import { type AVPlaybackStatus, PlaybackMixin } from "expo-av/build/AV"
import type { FeedItem, FeedVideoRef } from "./types"
import { Overlay } from "./Overlay"

export type FeedVideoProps = {
	item: FeedItem
	height: number
}

export const FeedVideo = forwardRef((props: FeedVideoProps, parentRef: React.Ref<FeedVideoRef>) => {
	const refVideo: React.Ref<Video> = useRef(null)
	const [status, setStatus] = React.useState(null as null | AVPlaybackStatus)
	const [lastTouchPos, setLastTouchPos] = useState(null as null | NativeTouchEvent)
	const [isMuted, setIsMuted] = useState(false)

	useImperativeHandle(
		parentRef,
		() => ({
			play,
			unload,
			pause,
			stop,
		}),
		[],
	)

	useEffect(() => {
		console.debug(`FeedVideo status: ${JSON.stringify(status)}`)
		return () => void unload()
	}, [])

	const play = async () => {
		console.debug("FeedVideo: play")
		if (!refVideo.current) {
			return
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && status.isPlaying) {
			return
		}
		await Audio.setAudioModeAsync({
			playsInSilentModeIOS: true,
		})
		// FIXME: Somewhy doesn't work without this
		await PlaybackMixin.playAsync.call(refVideo.current)
	}

	const pause = async () => {
		console.debug("FeedVideo: pause")
		if (!refVideo.current) {
			return
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && !status.isPlaying) {
			return
		}
		await PlaybackMixin.pauseAsync.call(refVideo.current)
	}

	const stop = async () => {
		console.debug("FeedVideo: stop")
		if (!refVideo.current) {
			return
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && !status.isPlaying) {
			return
		}
		await PlaybackMixin.stopAsync.call(refVideo.current)
	}

	const unload = async () => {
		console.debug("FeedVideo: unload")
		if (!refVideo.current) {
			return
		}
		await refVideo.current.unloadAsync()
	}

	return (
		<>
			<Overlay item={props.item} height={props.height} isScrolling={false} />
			<Video
				ref={refVideo}
				style={{
					width: "100%",
					height: props.height,
				}}
				source={{
					uri: props.item.uri,
				}}
				posterSource={{
					uri: props.item.uriPreview,
				}}
				posterStyle={{
					resizeMode: "cover",
					width: "100%",
					height: props.height,
				}}
				usePoster={true}
				resizeMode={ResizeMode.COVER}
				isLooping
				onPlaybackStatusUpdate={(status) => setStatus(() => status)}
				onTouchStart={(e) => setLastTouchPos(e.nativeEvent)}
				onTouchEnd={(e) => {
					const x = e.nativeEvent.locationX
					const y = e.nativeEvent.locationY
					const isClicked = lastTouchPos?.locationX === x || lastTouchPos?.locationY === y
					if (isClicked && refVideo.current) {
						// TODO: Make mute global
						const newValue = !isMuted
						PlaybackMixin.setIsMutedAsync.call(refVideo.current, newValue)
						setIsMuted(newValue)
						setLastTouchPos(null)
					}
				}}
			/>
		</>
	)
})
