import React from "react"
import { View } from "react-native"
import { Button } from "~/components/Button"
import { Input } from "~/components/Input"

export default function Profile() {
	return (
		<View className="bg-[#000A14] px-4 flex justify-center items-center h-full w-full">
			<Button className="mb-5" variant="gradient">
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
				<Input placeholder="Full name" />
			</View>
			<View className="bg-white w-full p-2">
				<Input type="password" placeholder="Password" />
			</View>
		</View>
	)
}
