import React, { useEffect } from "react"
import { SplashScreen } from "expo-router"
import { Slot } from "expo-router"
import NetInfo from "@react-native-community/netinfo"
import { onlineManager } from "@tanstack/react-query"
import { CacheManagerProvider, LFUPolicy } from "react-native-cache-video"
import { TRPCProvider } from "~/utils/api"
import { useIconFont } from "~/components/Icon"

SplashScreen.preventAutoHideAsync()
onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected)
	})
})

export const unstable_settings = {
	initialRouteName: "auth",
	app: {
		initialRouteName: "index",
	},
}

export default function RootLayout() {
	const lfuPolicyRef = React.useRef(new LFUPolicy(5))

	const [iconsLoaded] = useIconFont()
	useEffect(() => {
		console.debug(`Icons: ${iconsLoaded}`)
		if (iconsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [iconsLoaded])
	if (!iconsLoaded) {
		return null
	}

	return (
		<CacheManagerProvider cachePolicy={lfuPolicyRef.current}>
			<TRPCProvider>
				<Slot />
			</TRPCProvider>
		</CacheManagerProvider>
	)
}
