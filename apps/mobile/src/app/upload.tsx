import React, { useState } from "react"
import { View, Image, Button } from "react-native"
import * as ImagePicker from "expo-image-picker"
// import { FFmpegKit } from "ffmpeg-kit-react-native"

export default function Upload() {
	const [image, setImage] = useState(null as string | null)

	const onUploadClick = async () => {
		// No permissions request is necessary for launching the image library
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		}).catch((err) => console.log(`error: ${err}`))
		if (!result) return

		console.log(result)

		if (!result.canceled && result.assets[0]) {
			setImage(result.assets[0].uri)
		}
	}

	return (
		<View className="bg-[#000A14] h-full w-full flex justify-center items-center">
			<Button onPress={onUploadClick} title="Upload video" />
			{image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
		</View>
	)
}
