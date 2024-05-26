/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ["./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				"ns-body": ["NunitoSans-Regular"],
				"ns-bold": ["NunitoSans-Bold"],
				"ns-extra": ["NunitoSans-ExtraBold"],
				"ns-black": ["NunitoSans-Black"],
			},
		},
	},
	plugins: [],
}
