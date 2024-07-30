import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import cloudflare from "@astrojs/cloudflare"
import alpine from "@astrojs/alpinejs"

export default defineConfig({
	site: "https://elrax.com",
	integrations: [tailwind(), alpine()],
	output: "server",
	adapter: cloudflare(),
})
