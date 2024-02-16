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
		"expo-apple-authentication",
	],
}

export default () => defineConfig
