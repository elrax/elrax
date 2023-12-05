/** @type {import("@expo/config").ExpoConfig} */
const defineConfig = {
	name: "Elrax",
	slug: "elrax",
	owner: "elrax",
	scheme: "elrax",
	version: "0.1.0",
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
		buildNumber: "0.1.0",
		supportsTablet: true,
	},
	android: {
		package: "com.elrax.elrax",
	},
	plugins: [
		"expo-router",
		[
			"@config-plugins/ffmpeg-kit-react-native",
			{
				package: "video",
			},
		],
		[
			"expo-build-properties",
			{
				android: {
					compileSdkVersion: 31,
					targetSdkVersion: 31,
					minSdkVersion: 24,
					buildToolsVersion: "31.0.0",
				},
				ios: {
					deploymentTarget: "13.0",
				},
			},
		],
	],
}

export default () => defineConfig
