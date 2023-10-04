import React from "react"
import { View, Text } from "react-native"
import { Tabs } from "expo-router"
import { FlashList } from "@shopify/flash-list"
import { api } from "~/utils/api"

export default function Index() {
	const welcomeQuery = api.welcome.useQuery()

	return (
		<View className="bg-[#fff] h-full w-full">
			<Tabs.Screen
				options={{
					title: "Feed",
					headerShown: false,
					tabBarStyle: {
						backgroundColor: "#fff",
					},
					tabBarShowLabel: false,
					tabBarIconStyle: {
						color: "#fff",
					},
				}}
			/>

			<FlashList
				data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
				estimatedItemSize={20}
				ItemSeparatorComponent={() => <View className="h-20" />}
				renderItem={() => (
					<Text className="mx-auto text-3xl font-bold">
						{welcomeQuery.data?.welcome || "loading..."}
					</Text>
				)}
			/>
		</View>
	)
}
