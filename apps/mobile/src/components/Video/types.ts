import type { VideoProps } from "@elrax/api"

export type FeedVideoRef = {
	getItem: () => VideoProps
	/**
	 * Plays the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {boolean}
	 */
	play: () => Promise<boolean>
	/**
	 * Unloads the video in the component if the ref
	 * of the video is not null.
	 *
	 * This will make sure unnecessary video instances are
	 * not in memory at all times
	 *
	 * @returns {boolean}
	 */
	unload: () => Promise<boolean>
	/**
	 * Pauses the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {boolean}
	 */
	pause: () => Promise<boolean>
	/**
	 * Stops the video in the component if the ref
	 * of the video is not null.
	 *
	 * @returns {boolean}
	 */
	stop: () => Promise<boolean>
}
