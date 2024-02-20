import { defineConfig, passthroughImageService } from "astro/config"
import tailwind from "@astrojs/tailwind"
import cloudflare from "@astrojs/cloudflare"
import alpine from "@astrojs/alpinejs"

export default defineConfig({
	image: {
		service: passthroughImageService(),
	},
	site: "https://elrax.com",
	integrations: [tailwind(), alpine()],
	output: "server",
	adapter: cloudflare(),
})
