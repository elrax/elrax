import type { VideoProps } from "@elrax/api"

export type FeedVideoRef = {
	getItem: () => VideoProps
	/**
	 * Plays the video in the component if the ref
	 * of the video is not null.
	 */
	play: () => void
	/**
	 * Pauses the video in the component if the ref
	 * of the video is not null.
	 */
	pause: () => void
}
