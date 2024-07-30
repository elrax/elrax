import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import cloudflare from "@astrojs/cloudflare"
import alpine from "@astrojs/alpinejs"

export default defineConfig({
	site: "https://elrax.blog",
	integrations: [mdx(), sitemap(), tailwind(), alpine()],
	output: "server",
	adapter: cloudflare(),
})
