import React from "react"
import { Tabs } from "expo-router"
import { TRPCProvider } from "~/utils/api"
import { FontAwesome5 } from "@expo/vector-icons"

export const unstable_settings = {
	initialRouteName: "index",
}

export default function RootLayout() {
	return (
		<TRPCProvider>
			<Tabs>
				<Tabs.Screen
					name="index"
					options={{
						href: "/",
						title: "Feed",
						headerShown: false,
						tabBarShowLabel: false,
						tabBarActiveTintColor: "#fff",
						tabBarIcon: ({ color }) => (
							<FontAwesome5 name="search" size={24} color={color} />
						),
						tabBarStyle: {
							height: 79,
							backgroundColor: "#000A14",
							borderTopWidth: 0,
						},
						tabBarIconStyle: {
							color: "#fff",
						},
					}}
				/>
			</Tabs>
		</TRPCProvider>
	)
}
