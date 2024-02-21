/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"ns-body": ["NunitoSans_400Regular"],
				"ns-bold": ["NunitoSans_700Bold"],
				"ns-extra": ["NunitoSans_800ExtraBold"],
				"ns-black": ["NunitoSans_900Black"],
			},
		},
	},
	plugins: [],
}
