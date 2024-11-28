import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import NetInfo from "@react-native-community/netinfo"
import { onlineManager } from "@tanstack/react-query"
import { SplashScreen, router } from "expo-router"
import { Slot } from "expo-router"
import React, { useEffect } from "react"
import { CacheManagerProvider, LFUPolicy } from "react-native-cache-video"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import { useIconFont } from "~/components/Icon"
import { deleteUserJWT, getUserJWT } from "~/stores/userJWT"
import { TRPCProvider } from "~/utils/api"

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
	useEffect(() => {
		console.debug(`Icons: ${iconsLoaded}`)
		if (iconsLoaded) {
			SplashScreen.hideAsync().then(() => {
				console.log("Splash Screen hidden")
			})
			// TODO: I'm pretty sure there's a better place for this.
			getUserJWT().then((jwt) => {
				if (jwt) {
					router.replace("(app)/feed")
				} else {
					router.replace("/")
					deleteUserJWT()
				}
			})
		}
	}, [iconsLoaded])
	if (!iconsLoaded) {
		return null
	}

	return (
		<CacheManagerProvider cachePolicy={lfuPolicyRef.current}>
			<TRPCProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<BottomSheetModalProvider>
						<Slot />
					</BottomSheetModalProvider>
				</GestureHandlerRootView>
			</TRPCProvider>
		</CacheManagerProvider>
	)
}
