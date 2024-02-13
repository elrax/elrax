import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import { Button } from "~/components/Button"

export default function Index() {
	setStatusBarStyle("light")

	return (
		<View className="bg-[#F7F7F7] h-full w-full p-8 flex justify-center items-center">
			{/* Image */}
			<Text className="font-ns-bold text-2xl color-black">Let me in!</Text>
			<Text className="font-ns-body text-base text-center color-black">
				Create a profile, follow other accounts, post your own videos, and more.
			</Text>
			{/* With Apple ID Button */}
			{/* With Google Button */}
			{/* With Email Button */}
			<Button className="mb-5" variant="gradient">
				Continue with Email
			</Button>
			<View className="flex flex-row gap-1">
				<Text className="font-ns-body text-base color-black">Already have an account?</Text>
				<TouchableOpacity>
					<Text className="font-ns-body text-base color-[#007EE5]">Sign in</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
