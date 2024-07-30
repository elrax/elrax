/** @type {import('tailwindcss').Config} */
export default {
	content: ["./**/*.{html,astro}", "../../../packages/**/*.{html,astro}"],
	theme: {
		extend: {
			fontFamily: {
				nunito: ["Nunito Sans", "sans-serif"],
			},
		},
	},
	plugins: [],
}
