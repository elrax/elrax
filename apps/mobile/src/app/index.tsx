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
import { AccessToken, LoginManager, Profile } from "react-native-fbsdk-next"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { Image } from "expo-image"
// import * as Device from "expo-device"
import { Button } from "~/components/Button"
import { router } from "expo-router"
import { api } from "~/utils/api"

const images = {
	auth: require("../assets/auth.png"),
}

export default function Index() {
	setStatusBarStyle("dark")

	// const device = `${Device.osName}, ${Device.osVersion}, ${Device.manufacturer}, ${Device.modelName}`
	const device = "-"

	const continueWithOAuth = api.auth.continueWithOAuth.useMutation()

	React.useEffect(() => {
		GoogleSignin.configure({
			iosClientId: "987743451157-7c3h22e8n61nsg3183niopc2alpdv0o9.apps.googleusercontent.com",
		})
	}, [])

	const signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices()
			const credential = await GoogleSignin.signIn()

			console.log(`credential: ${JSON.stringify(credential)}`)
			if (!credential.idToken) {
				console.log("credential.idToken is null")
				return
			}
			await continueWithOAuth.mutateAsync({
				provider: "google",
				token: credential.idToken,
				user: {
					id: credential.user.id,
					firstName: credential.user.givenName || undefined,
					lastName: credential.user.familyName || undefined,
					email: credential.user.email,
				},
				device,
			})
			router.replace("(app)/feed")
		} catch (error) {
			console.log(`error: ${error}`)
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
			if (!credential.identityToken) {
				console.log("credential.identityToken is null")
				return
			}
			await continueWithOAuth.mutateAsync({
				provider: "apple",
				token: credential.identityToken,
				user: {
					id: credential.user,
					firstName: credential.fullName?.givenName || undefined,
					lastName: credential.fullName?.familyName || undefined,
					email: credential.email || undefined,
				},
				device,
			})
			router.replace("(app)/feed")
		} catch (e) {
			console.log(e)
			if ((e as { code: string }).code === "ERR_REQUEST_CANCELED") {
				// handle that the user canceled the sign-in flow
			} else {
				// handle other errors
			}
		}
	}

	const signInWithFacebook = async () => {
		try {
			const result = await LoginManager.logInWithPermissions(["email", "public_profile"])
			if (result.isCancelled) {
				console.log("login is cancelled")
			} else {
				const credential = await AccessToken.getCurrentAccessToken()
				if (!credential) {
					console.log("Something went wrong obtaining the users access token")
					return
				}
				const currentProfile = await Profile.getCurrentProfile()
				if (!currentProfile) {
					console.log("Something went wrong obtaining the users access token")
					return
				}

				console.log(`credential: ${JSON.stringify(credential)}`)
				console.log(`currentProfile: ${JSON.stringify(currentProfile)}`)
				await continueWithOAuth.mutateAsync({
					provider: "facebook",
					token: credential.accessToken,
					user: {
						id: credential.userID,
						firstName: currentProfile.firstName || undefined,
						lastName: currentProfile.lastName || undefined,
						email: currentProfile.email || undefined,
					},
					device,
				})
				router.replace("(app)/feed")
			}
		} catch (error) {
			console.log("login has error: " + error)
		}
	}

	return (
		<ScrollView
			className="bg-[#F7F7F7] h-full w-full px-8 pt-12"
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
				<Button
					className="mt-4"
					variant="facebook"
					icon="facebook"
					onPress={signInWithFacebook}
				>
					Continue with Facebook
				</Button>
				<Button className="mt-4" variant="google" icon="google" onPress={signInWithGoogle}>
					Continue with Google
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
