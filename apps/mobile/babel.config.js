/** @type {import("@babel/core").ConfigFunction} */
module.exports = (api) => {
	api.cache.forever()

	// Make Expo Router run from `src/app` instead of `app`.
	// Path is relative to `/node_modules/expo-router`
	process.env.EXPO_ROUTER_APP_ROOT = "../../apps/mobile/src/app"

	return {
		presets: ["babel-preset-expo"],
		plugins: [
			"nativewind/babel",
			"expo-router/babel",
			["module-resolver", { alias: { "~": "./src" } }],
			["@babel/plugin-transform-private-methods", { loose: true }],
		],
	}
}
