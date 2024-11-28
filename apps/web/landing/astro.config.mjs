import alpine from "@astrojs/alpinejs"
import cloudflare from "@astrojs/cloudflare"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

export default defineConfig({
	site: "https://elrax.com",
	integrations: [tailwind(), alpine()],
	output: "server",
	adapter: cloudflare(),
})
