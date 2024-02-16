import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from "expo-apple-authentication"
import { Image } from "expo-image"
import { Button } from "~/components/Button"

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["

export default function Index() {
	setStatusBarStyle("light")

	return (
		<View className="bg-[#F7F7F7] h-full w-full p-8 flex justify-center items-center">
			{/* Image */}
			<Image
				style={{
					flex: 1,
					width: "100%",
					backgroundColor: "#0553",
				}}
				source="https://picsum.photos/seed/696/3000/2000"
				placeholder={blurhash}
				contentFit="cover"
			/>
			<Text className="font-ns-bold text-2xl color-black">Let me in!</Text>
			<Text className="font-ns-body text-base text-center color-black">
				Create a profile, follow other accounts, post your own videos, and more.
			</Text>
			<AppleAuthenticationButton
				buttonType={AppleAuthenticationButtonType.SIGN_IN}
				buttonStyle={AppleAuthenticationButtonStyle.WHITE}
				cornerRadius={5}
				onPress={async () => {
					try {
						const credential = await signInAsync({
							requestedScopes: [
								AppleAuthenticationScope.FULL_NAME,
								AppleAuthenticationScope.EMAIL,
							],
						})
						console.log(`credential: ${JSON.stringify(credential)}`)
						// signed in
					} catch (e) {
						if ((e as { code: string }).code === "ERR_REQUEST_CANCELED") {
							// handle that the user canceled the sign-in flow
						} else {
							// handle other errors
						}
					}
				}}
			/>
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
