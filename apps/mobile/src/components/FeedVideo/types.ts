export type FeedVideoProps = {
	item: FeedVideoItem
	videoHeight: number
}

export type FeedVideoItem = {
	id: string
	uri: string
	uriPreview: string
}

export type FeedVideoRef = {
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
