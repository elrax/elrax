// @ts-ignore
const baseConfig = require("@elrax/tailwind-config")

/** @type {import("tailwindcss").Config} */
module.exports = {
	presets: [baseConfig],
	content: ["./src/**/*.{ts,tsx}"],
}
