import React, { useState, useEffect } from "react"
import { View, Text, Button, StyleSheet } from "react-native"
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker"
import {
	makeDirectoryAsync,
	getInfoAsync,
	cacheDirectory,
	readDirectoryAsync,
	deleteAsync,
} from "expo-file-system"
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native"
import { Video } from "expo-av"
import { api, getBaseUrl } from "~/utils/api"

const videoTmpFolder = "uploadVideo"
const videoName = "video.m3u8"

const fetchImageFromUri = async (uri: string) => {
	const res = await fetch(uri)
	const blob = await res.blob()
	return {
		blob,
		contentType:
			res.headers.get("Content-Type") || uri.includes(".m3u8")
				? "application/x-mpegurl"
				: "video/mp2t",
	}
}

const getResultPath = async (id: string) => {
	const videoDir = `${cacheDirectory}video/${id}/`
	// Checks if gif directory exists. If not, creates it
	async function ensureDirExists() {
		const dirInfo = await getInfoAsync(videoDir)
		if (dirInfo.exists) {
			console.log("Temp directory already exist, deleting...")
			await deleteAsync(dirInfo.uri, { idempotent: true })
		}
		await makeDirectoryAsync(videoDir, { intermediates: true })
	}
	await ensureDirExists()
	return `${videoDir}${videoName}`
}

const getSourceVideo = async () => {
	// No permissions request is necessary for launching the image library
	const result = await launchImageLibraryAsync({
		mediaTypes: MediaTypeOptions.Videos,
		videoMaxDuration: 60,
		allowsEditing: true,
		quality: 1,
	}).catch((err) => console.log(`error: ${err}`))
	if (!result) return
	if (result.canceled) return

	const res = result.assets[0]
	if (!res) return

	console.log(result)
	return res
}

export default function Upload() {
	const [status, setStatus] = useState({ btn: "Select video" as string | null, msg: "" })
	// const [thumbnail, setThumbnail] = useState(null as string | null)
	const [result, setResult] = useState(null as string | null)
	const [source, setSource] = useState(null as string | null)

	useEffect(() => {
		FFmpegKitConfig.init()
	}, [])

	const getUploadVideoURL = api.getUploadVideoURL.useMutation()
	const updateVideo = api.updateVideo.useMutation()

	const onClick = async () => {
		if (status.btn === "Select video" || status.btn === "Try select again") {
			await onSelectClick()
		} else if (status.btn === "Convert video" || status.btn === "Try convert again") {
			await onConvertClick()
		} else if (status.btn === "Upload video") {
			await onUploadClick()
		}
	}

	const onSelectClick = async () => {
		const sourceVideo = await getSourceVideo()
		if (!sourceVideo) {
			setStatus({ btn: "Try select again", msg: "Failed to select video." })
			return
		}
		setSource(sourceVideo.uri)
		setStatus({ btn: "Convert video", msg: "Video selected." })

		console.log(sourceVideo)
	}
	const onConvertClick = async () => {
		if (!source) {
			setStatus({ btn: "Try select again", msg: "Failed to select video." })
			return
		}
		setStatus({ btn: null, msg: "Converting..." })

		const resultVideo = await getResultPath(videoTmpFolder)
		const ffmpegSession = await FFmpegKit.execute(
			`-i ${source} -c:v libx264 -profile:v baseline -level 4.0 -preset medium -b:v 2500k -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -c:a aac -b:a 128k -ar 48000 -ac 2 -start_number 0 -hls_time 2 -hls_playlist_type vod -f hls ${resultVideo}`,
		)
		const result = await ffmpegSession.getReturnCode()
		if (ReturnCode.isSuccess(result)) {
			setResult(resultVideo)
			console.log(resultVideo)
		} else {
			console.error(result)
		}
		setStatus({ btn: "Upload video", msg: "Video converted." })
	}
	const onUploadClick = async () => {
		if (!result) {
			setStatus({ btn: "Try convert again", msg: "Failed to convert video." })
			return
		}
		console.log(`Upload: ${result.replace(videoName, "")}`)

		const partNames = await readDirectoryAsync(result.replace(videoName, ""))
		const { videoId, uploadUrls } = await getUploadVideoURL.mutateAsync({ partNames })
		console.log(`${partNames.length} files to upload: ${JSON.stringify(partNames)}`)

		for (const partName of partNames) {
			const uploadUrl = uploadUrls[partName]
			if (!uploadUrl) {
				setStatus({ btn: "Try upload again", msg: "Failed to upload video." })
				return
			}
			let url = uploadUrl
			if (url.startsWith("/")) url = getBaseUrl() + url
			console.log(`Upload url: ${url}`)
			const path = result.replace(videoName, partName)
			const { blob, contentType } = await fetchImageFromUri(path)
			const uploadResult = await fetch(url, {
				method: "PUT",
				body: blob,
				headers: {
					"Content-Type": contentType,
				},
			})
			console.log(`${partName} upload status: ${uploadResult.status}`)
		}
		const url = await updateVideo.mutateAsync({ videoId })
		setStatus({ btn: null, msg: "Video uploaded." })
		console.log("Video url: " + url)
	}

	return (
		<View className="bg-[#000A14] h-full w-full flex justify-center items-center">
			{status.btn && <Button onPress={onClick} title={status.btn} />}
			{status.msg && <Text className="font-ns-bold text-xl text-white">{status.msg}</Text>}
			{/* thumbnail && (
				<Text className="font-ns-bold text-xl text-white">
					Preview:
					<Image source={{ uri: thumbnail }} style={{ width: 200, height: 200 }} />
				</Text>
			) */}
			{source && <Video source={{ uri: source }} {...videoSettings} />}
			{result && <Video source={{ uri: result }} {...videoSettings} />}
		</View>
	)
}

const styles = StyleSheet.create({
	video: {
		alignSelf: "center",
		width: 320,
		height: 200,
		backgroundColor: "black",
	},
})

const videoSettings = {
	style: styles.video,
	shouldPlay: true,
	useNativeControls: true,
	isMuted: true,
	isLooping: true,
}
