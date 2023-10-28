import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { ResizeMode, Audio, Video } from "expo-av"
import type { FeedVideoProps, FeedVideoRef } from "./types"
import { PlaybackMixin } from "expo-av/build/AV"

const FeedVideo = (props: FeedVideoProps, parentRef: React.Ref<FeedVideoRef>) => {
	const refVideo: React.Ref<Video> = useRef(null)

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
		try {
			await Audio.setAudioModeAsync({
				playsInSilentModeIOS: true,
			})

			// FIXME: Somewhy doesn't work without this
			refVideo.current.playAsync = PlaybackMixin.playAsync
			await refVideo.current.playAsync()
		} catch (e) {
			console.log(`${JSON.stringify(e)}`)
		}
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
		try {
			// FIXME: Somewhy doesn't work without this
			refVideo.current.pauseAsync = PlaybackMixin.pauseAsync
			await refVideo.current.pauseAsync()
		} catch (e) {
			console.log(`${JSON.stringify(e)}`)
		}
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
		try {
			// FIXME: Somewhy doesn't work without this
			refVideo.current.stopAsync = PlaybackMixin.stopAsync
			await refVideo.current.stopAsync()
		} catch (e) {
			console.log(`${JSON.stringify(e)}`)
		}
	}

	const unload = async () => {
		console.debug("FeedVideo: unload")

		if (!refVideo.current) {
			return
		}
		try {
			await refVideo.current.unloadAsync()
		} catch (e) {
			console.log(`${JSON.stringify(e)}`)
		}
	}

	return (
		<>
			<Video
				ref={refVideo}
				style={{
					width: "100%",
					height: props.videoHeight,
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
					height: props.videoHeight,
				}}
				usePoster={true}
				resizeMode={ResizeMode.COVER}
				isLooping
				// onPlaybackStatusUpdate={(status) => {
				// 	console.log(`status: ${JSON.stringify(status)}`)
				// }}
			/>
		</>
	)
}

export default forwardRef(FeedVideo)
