import { getCollection } from "astro:content"
import rss from "@astrojs/rss"
import type { APIContext } from "astro"
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts"

export async function GET(context: APIContext) {
	const posts = await getCollection("blog")
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site || SITE_URL,
		items: posts.map((post) => {
			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				tag: post.data.tag,
				author: post.data.author.map((v) => v.name).join(", "),
				heroImage: post.data.heroImage,
				link: `/${post.slug}/`,
			}
		}),
	})
}
