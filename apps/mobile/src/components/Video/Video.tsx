import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import type { NativeTouchEvent } from "react-native"
import { ResizeMode, Audio, Video, InterruptionModeIOS } from "expo-av"
import { type AVPlaybackStatus, PlaybackMixin } from "expo-av/build/AV"
import type { VideoProps } from "@elrax/api"
import type { FeedVideoRef } from "./types"
import { Overlay } from "./Overlay"

export type FeedVideoProps = {
	item: VideoProps
	height: number
	isVisible: boolean
}

export const FeedVideo = forwardRef((props: FeedVideoProps, parentRef: React.Ref<FeedVideoRef>) => {
	const refVideo: React.Ref<Video> = useRef(null)
	const [status, setStatus] = React.useState(null as null | AVPlaybackStatus)
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

	const getItem = () => {
		return props.item
	}

	const play = async (noAudioSet?: boolean) => {
		if (!refVideo.current) {
			return false
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && status.isPlaying) {
			return false
		}
		if (!noAudioSet) {
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true,
				interruptionModeIOS: InterruptionModeIOS.DoNotMix,
				shouldDuckAndroid: true,
				staysActiveInBackground: false,
			})
		}
		console.debug("FeedVideo: play")
		// FIXME: Somewhy doesn't work without this
		await PlaybackMixin.playAsync.call(refVideo.current)
		return true
	}

	const pause = async () => {
		if (!refVideo.current) {
			return false
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && !status.isPlaying) {
			return false
		}
		console.debug("FeedVideo: pause")
		await PlaybackMixin.pauseAsync.call(refVideo.current)
		return true
	}

	const toggleMute = async () => {
		if (!refVideo.current) {
			return false
		}
		console.debug("FeedVideo: toggle mute")
		const status = await refVideo.current.getStatusAsync()
		if (!status.isLoaded) {
			return false
		}
		// TODO: Make mute global
		const newValue = !status.isMuted
		await PlaybackMixin.setIsMutedAsync.call(refVideo.current, newValue)
		return true
	}

	const stop = async () => {
		if (!refVideo.current) {
			return false
		}
		const status = await refVideo.current.getStatusAsync()
		if (status.isLoaded && !status.isPlaying) {
			return false
		}
		console.debug("FeedVideo: stop")
		await PlaybackMixin.stopAsync.call(refVideo.current)
		return true
	}

	const unload = async () => {
		if (!refVideo.current) {
			return false
		}
		console.debug("FeedVideo: unload")
		await refVideo.current.unloadAsync()
		return true
	}

	const setPauseTimeout = () => {
		const timeoutId = setTimeout(() => {
			setOverlayOpacity(0)
			pause()
		}, 300)
		setPauseTimeoutId(timeoutId)
	}

	const clearPauseTimeout = (opacity?: number) => {
		if (opacity) {
			setOverlayOpacity(opacity)
		}
		if (pauseTimeoutId) {
			setPauseTimeoutId(null)
			clearTimeout(pauseTimeoutId)
			return true
		}
		return false
	}

	// TODO: Fix video multiple and constant calls to file api for the same video

	return (
		<>
			<Overlay item={props.item} height={props.height} opacity={overlayOpacity} />
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
				onPlaybackStatusUpdate={(status) => {
					setStatus(() => status)
					if (status.isLoaded) {
						if (status.didJustFinish) {
							void refVideo.current?.replayAsync()
						}
					}
				}}
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
					if (isClicked && refVideo.current && status?.isLoaded && status?.isPlaying) {
						toggleMute()
					}

					if (props.isVisible) {
						play(true)
					}
					setLastTouchPos(null)
				}}
			/>
		</>
	)
})
