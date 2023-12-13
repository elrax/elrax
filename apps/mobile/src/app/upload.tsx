import React from "react"
import { View, Button } from "react-native"
// import { FFmpegKit } from "ffmpeg-kit-react-native"

export default function Upload() {
	return (
		<View className="bg-[#000A14] h-full w-full">
			<Button onPress={() => console.log("pressed")} title="Upload video" />
		</View>
	)
}
