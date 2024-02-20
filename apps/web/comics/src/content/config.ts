import { defineCollection, z } from "astro:content"

const comics = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		heroImage: z.string(),
		tag: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
	}),
})

export const collections = { comics }
