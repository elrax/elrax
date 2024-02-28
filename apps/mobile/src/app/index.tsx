import React from "react"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import {
	AppleAuthenticationButton,
	AppleAuthenticationButtonStyle,
	AppleAuthenticationButtonType,
	AppleAuthenticationScope,
	signInAsync,
} from "expo-apple-authentication"
import { AccessToken, LoginManager } from "react-native-fbsdk-next"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Image } from "expo-image"
import { Button } from "~/components/Button"
import { router } from "expo-router"

const images = {
	auth: require("../assets/auth.png"),
}

export default function Index() {
	setStatusBarStyle("dark")

	React.useEffect(() => {
		GoogleSignin.configure({
			iosClientId: "987743451157-7c3h22e8n61nsg3183niopc2alpdv0o9.apps.googleusercontent.com",
		})
	}, [])

	const signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices()
			const userInfo = await GoogleSignin.signIn()
			console.log(`google user info: ${JSON.stringify(userInfo)}`)
		} catch (error) {
			if (error) {
				console.log(`error: ${JSON.stringify(error)}`)
			}
		}
	}

	const signInWithApple = async () => {
		try {
			const credential = await signInAsync({
				requestedScopes: [
					AppleAuthenticationScope.FULL_NAME,
					AppleAuthenticationScope.EMAIL,
				],
			})
			console.log(`credential: ${JSON.stringify(credential)}`)
			// TODO: Call server to finish login with apple
			router.replace("(app)/feed")
			// signed in
		} catch (e) {
			if ((e as { code: string }).code === "ERR_REQUEST_CANCELED") {
				// handle that the user canceled the sign-in flow
			} else {
				// handle other errors
			}
		}
	}

	const signInWithFacebook = async () => {
		try {
			const result = await LoginManager.logInWithPermissions(["public_profile", "email"])
			if (result.isCancelled) {
				console.log("login is cancelled.")
			} else {
				AccessToken.getCurrentAccessToken().then((data) => {
					console.log(data?.accessToken.toString())
					// TODO: Call server to finish login with facebook
					router.replace("(app)/feed")
				})
			}
		} catch (error) {
			if (error) {
				console.log("login has error: " + error)
			}
		}
	}

	return (
		<ScrollView
			className="bg-[#F7F7F7] h-full w-full px-8 pt-20"
			contentContainerStyle={{
				flex: 1,
				justifyContent: "flex-start",
				alignItems: "center",
			}}
		>
			<Image
				style={{
					width: "100%",
					height: "40%",
				}}
				source={images.auth}
				contentFit="contain"
			/>
			<Text className="font-ns-extra text-4xl color-black">Let me in!</Text>
			<Text className="font-ns-body text-base text-center color-black">
				Create a profile, follow other accounts, post your own videos, and more.
			</Text>
			<View className="my-4">
				<AppleAuthenticationButton
					style={{
						height: 45,
						borderColor: "#DEDFE0",
					}}
					buttonType={AppleAuthenticationButtonType.CONTINUE}
					buttonStyle={AppleAuthenticationButtonStyle.BLACK}
					cornerRadius={50}
					onPress={signInWithApple}
				/>
				<Button className="mt-4" variant="google" icon="google" onPress={signInWithGoogle}>
					Continue with Google
				</Button>
				<Button
					className="mt-4"
					variant="facebook"
					icon="facebook"
					onPress={signInWithFacebook}
				>
					Continue with Facebook
				</Button>
				<Button
					className="mt-4"
					variant="gradient"
					onPress={() => {
						router.push("(sign-up)/email")
					}}
				>
					Continue with Email
				</Button>
			</View>
			<View className="flex flex-row gap-1">
				<Text className="font-ns-body text-base color-black">Already have an account?</Text>
				<TouchableOpacity
					onPress={() => {
						router.push("sign-in")
					}}
				>
					<Text className="font-ns-body text-base color-[#007EE5]">Sign in</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}
