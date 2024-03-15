import React, { useEffect } from "react"
import { SplashScreen, router } from "expo-router"
import { Slot } from "expo-router"
import NetInfo from "@react-native-community/netinfo"
import { onlineManager } from "@tanstack/react-query"
import { CacheManagerProvider, LFUPolicy } from "react-native-cache-video"
import { TRPCProvider } from "~/utils/api"
import { useIconFont } from "~/components/Icon"
import { useNunitoSans } from "~/components/Fonts"
import { getUserJWT } from "~/stores/userJWT"

SplashScreen.preventAutoHideAsync()
onlineManager.setEventListener((setOnline) => {
	return NetInfo.addEventListener((state) => {
		setOnline(!!state.isConnected)
	})
})

export const unstable_settings = {
	initialRouteName: "index",
	app: {
		initialRouteName: "feed",
	},
}

export default function RootLayout() {
	const lfuPolicyRef = React.useRef(new LFUPolicy(5))

	const [iconsLoaded] = useIconFont()
	const [fontsLoaded] = useNunitoSans()
	useEffect(() => {
		console.debug(`Fonts: ${fontsLoaded}, icons: ${iconsLoaded}`)
		if (iconsLoaded && fontsLoaded) {
			SplashScreen.hideAsync().then(() => {
				console.log("Splash Screen hidden")
			})
			// TODO: I pretty sure there's a better place for this.
			getUserJWT().then((jwt) => {
				if (jwt) {
					router.replace("(app)/feed")
				} else {
					// router.replace("/")
					// deleteUserJWT()
				}
			})
		}
	}, [iconsLoaded, fontsLoaded])
	if (!iconsLoaded || !fontsLoaded) {
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
