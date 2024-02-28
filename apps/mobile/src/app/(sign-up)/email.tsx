import React from "react"
import { Text, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import { Button } from "~/components/Button"
import { router } from "expo-router"

export default function Index() {
	setStatusBarStyle("dark")

	return (
		<View className="bg-[#F7F7F7] h-full w-full flex justify-center items-center px-8">
			<Text className="font-ns-bold text-base color-black">Email sign up page</Text>
			<Button
				className="mt-4"
				variant="gradient"
				onPress={() => {
					router.replace("(app)/feed")
				}}
			>
				Finish sign up
			</Button>
		</View>
	)
}
