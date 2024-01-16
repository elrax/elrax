import type { VideoProps } from "@elrax/api"

export type FeedVideoRef = {
	getItem: () => VideoProps
	/**
	 * Plays the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {void}
	 */
	play: () => Promise<void>
	/**
	 * Unloads the video in the component if the ref
	 * of the video is not null.
	 *
	 * This will make sure unnecessary video instances are
	 * not in memory at all times
	 *
	 * @returns {void}
	 */
	unload: () => Promise<void>
	/**
	 * Pauses the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {void}
	 */
	pause: () => Promise<void>
	/**
	 * Stops the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {void}
	 */
	stop: () => Promise<void>
}
