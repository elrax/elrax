import alpine from "@astrojs/alpinejs"
import cloudflare from "@astrojs/cloudflare"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

export default defineConfig({
	site: "https://elrax.blog",
	integrations: [mdx(), sitemap(), tailwind(), alpine()],
	output: "server",
	adapter: cloudflare(),
})
