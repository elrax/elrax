import React from "react"
import { Text, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"

export default function Index() {
	setStatusBarStyle("light")

	return (
		<View className="bg-[#F7F7F7] h-full w-full flex justify-center items-center">
			<Text className="font-ns-bold text-base color-black">Sign in page</Text>
		</View>
	)
}
