import { router } from "expo-router"
import React from "react"
import { View, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"

export default function Profile() {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View className="bg-[#000A14] px-4 flex justify-center items-center h-full w-full">
				<Button
					className="mb-5"
					variant="gradient"
					onPress={() => {
						router.replace("/")
					}}
				>
					Gradient
				</Button>
				<Button className="mb-5" disabled variant="gradient">
					Gradient (Disabled)
				</Button>
				<View className="flex-row mb-5 gap-2 w-full">
					<View className="flex-1">
						<Button>Default</Button>
					</View>
					<View className="flex-1">
						<Button disabled>(Disabled)</Button>
					</View>
				</View>
				<View className="bg-white w-full p-2">
					<Input
						placeholder="Full name"
						errorMsg="This username isn't available. try a suggested username, or enter a new one."
					/>
				</View>
				<View className="bg-white w-full p-2">
					<Input
						type="password"
						placeholder="Password"
						errorMsg="This password isn't strong enough"
					/>
				</View>
			</View>
		</TouchableWithoutFeedback>
	)
}
