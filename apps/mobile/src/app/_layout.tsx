import React, { useEffect } from "react"
import { SplashScreen, Tabs } from "expo-router"
import { TRPCProvider } from "~/utils/api"
import { useIconFont, Icon } from "~/components/Icon"
import { useNunitoSans } from "~/components/Fonts"

SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
	initialRouteName: "index",
}

export default function RootLayout() {
	const [iconsLoaded] = useIconFont()
	const [fontsLoaded] = useNunitoSans()
	useEffect(() => {
		console.debug(`Fonts: ${fontsLoaded}, icons: ${iconsLoaded}`)
		if (iconsLoaded && fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [iconsLoaded, fontsLoaded])
	if (!fontsLoaded || !fontsLoaded) {
		return null
	}

	const defaultTabOptions = (
		href: string,
		title: string,
		icon: string,
		iconFocused: string,
	): React.ComponentProps<typeof Tabs.Screen>["options"] => ({
		href,
		title,
		headerShown: false,
		tabBarShowLabel: false,
		tabBarActiveTintColor: "#fff",
		tabBarIcon: ({ color, focused }) => (
			<Icon name={focused ? iconFocused : icon} size={24} color={color} />
		),
		tabBarStyle: {
			height: 79,
			backgroundColor: "#000A14",
			borderTopWidth: 0,
		},
		tabBarIconStyle: {
			color: "#fff",
		},
	})
	return (
		<TRPCProvider>
			<Tabs>
				<Tabs.Screen
					name="index"
					options={defaultTabOptions("/", "Feed", "home-close", "home-open")}
				/>
				<Tabs.Screen
					name="search"
					options={defaultTabOptions("/search", "Search", "search-close", "search-open")}
				/>
				<Tabs.Screen
					name="upload"
					options={defaultTabOptions("/upload", "Upload", "plus-close", "plus-open")}
				/>
				<Tabs.Screen
					name="notifications"
					options={defaultTabOptions(
						"/notifications",
						"Notifications",
						"bell-close",
						"bell-open",
					)}
				/>
				<Tabs.Screen
					name="profile"
					options={defaultTabOptions(
						"/profile",
						"Profile",
						"profile-new-close",
						"profile-new-open",
					)}
				/>
			</Tabs>
		</TRPCProvider>
	)
}
