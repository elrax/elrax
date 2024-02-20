import { defineCollection, z } from "astro:content"

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		tag: z.string().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		author: z.array(
			z.object({
				name: z.string(),
				img: z.string(),
				role: z.string(),
			}),
		),
	}),
})

export const collections = { blog }
