import React from "react"
import { Tabs } from "expo-router"
import { TRPCProvider } from "~/utils/api"
import { FontAwesome5 } from "@expo/vector-icons"

export const unstable_settings = {
	initialRouteName: "index",
}

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
	return (
		<TRPCProvider>
			<Tabs>
				<Tabs.Screen
					name="index"
					options={{
						href: "/",
						tabBarActiveTintColor: "#000",
						tabBarIcon: ({ color }) => (
							<FontAwesome5 name="search" size={24} color={color} />
						),
					}}
				/>
			</Tabs>
		</TRPCProvider>
	)
}
