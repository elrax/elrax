import React from "react"
import { Text, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import { router } from "expo-router"
import { Button } from "~/components/Button"

export default function Index() {
	setStatusBarStyle("light")

	return (
		<View className="bg-[#F7F7F7] h-full w-full flex justify-center items-center px-8">
			<Text className="font-ns-bold text-base color-black">Sign in page</Text>
			<Button
				className="mt-4"
				variant="gradient"
				onPress={() => {
					router.replace("/")
				}}
			>
				Sign in
			</Button>
		</View>
	)
}
