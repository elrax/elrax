/** @type {import("@expo/config").ExpoConfig} */
const defineConfig = {
	name: "Elrax",
	slug: "elrax",
	owner: "elrax",
	scheme: "elrax",
	version: "0.1.1",
	extra: {
		eas: {
			projectId: "7ccac9f6-2287-458f-94fd-dcfdb73b0864",
		},
	},
	updates: {
		url: "https://u.expo.dev/7ccac9f6-2287-458f-94fd-dcfdb73b0864",
	},
	runtimeVersion: {
		policy: "appVersion",
	},
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "light",
	assetBundlePatterns: ["**/*"],
	splash: {
		image: "./assets/splash.png",
		resizeMode: "contain",
		backgroundColor: "#000A14",
	},
	ios: {
		bundleIdentifier: "com.elrax.elrax",
		buildNumber: "0.1.1",
		supportsTablet: true,
		splash: {
			backgroundColor: "#000A14",
		},
		usesAppleSignIn: true,
		infoPlist: {
			CFBundleURLTypes: [
				{
					CFBundleURLSchemes: [
						"com.googleusercontent.apps.987743451157-7c3h22e8n61nsg3183niopc2alpdv0o9",
					],
				},
			],
		},
	},
	android: {
		package: "com.elrax.elrax",
		splash: {
			backgroundColor: "#000A14",
		},
	},
	plugins: [
		"expo-router",
		[
			"@config-plugins/ffmpeg-kit-react-native",
			{
				// https://github.com/arthenica/ffmpeg-kit#9-packages
				package: "min-gpl",
			},
		],
		[
			"expo-build-properties",
			{
				android: {
					compileSdkVersion: 33,
					targetSdkVersion: 33,
					minSdkVersion: 24,
					buildToolsVersion: "33.0.0",
				},
				ios: {
					deploymentTarget: "13.4",
				},
			},
		],
		[
			"expo-font",
			{
				fonts: [
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_200ExtraLight.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_300Light.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_400Regular.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_600SemiBold.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_700Bold.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_800ExtraBold.ttf",
					"../../node_modules/@expo-google-fonts/nunito-sans/NunitoSans_900Black.ttf",
				],
			},
		],
		// Learn more: https://docs.expo.dev/versions/latest/sdk/apple-authentication
		"expo-apple-authentication",
		// Learn more: https://github.com/react-native-google-signin/google-signin
		"@react-native-google-signin/google-signin",
		[
			// Learn more: https://github.com/thebergamo/react-native-fbsdk-next
			"react-native-fbsdk-next",
			{
				appID: "667538938706539",
				clientToken: "cd37ab027cedb481d2c8e42633ead849",
				displayName: "Elrax",
				scheme: "fb667538938706539",
				advertiserIDCollectionEnabled: false,
				autoLogAppEventsEnabled: false,
				isAutoInitEnabled: true,
				iosUserTrackingPermission:
					"This identifier will be used to deliver personalized ads to you.",
			},
		],
	],
}

export default () => defineConfig
