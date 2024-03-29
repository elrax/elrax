import { Storage } from "../db/types"
import { Environment } from "../types"
import type { Env } from "../trpc"

/** Returns current base url. Used in dev environment */
export const getCurrentUrl = (fullUrl: string) => {
	const url = new URL(fullUrl)
	const currentUrl = url.protocol + "//" + url.host + "/"
	return currentUrl
}

/** Returns storage url based on storage value and environment */
export const getStorageUrl = (storage: Storage, env: Env, currentUrl: string) => {
	switch (storage) {
		case Storage.PRIME_R2_BUCKET:
			switch (env.ENVIRONMENT) {
				case Environment.DEV:
					return currentUrl + "dev/getFile/"
				case Environment.STAGING:
					return "https://cdn-staging.elrax.com/"
				case Environment.PRODUCTION:
					return "https://cdn.elrax.com/"
			}
	}
}

/** Returns url to video based on video id and relative settings */
export const getVideoUrl = (videoId: string, storage: Storage, env: Env, currentUrl: string) => {
	const url = getCurrentUrl(currentUrl)
	const storageUrl = getStorageUrl(storage, env, url)
	return `${storageUrl}videos/${videoId}/video.m3u8`
}

/** Returns url to user avatar based on user id, avatar index, and relative settings */
export const getUserAvatarUrl = (
	userId: string,
	index: number,
	storage: Storage,
	env: Env,
	currentUrl: string,
) => {
	const url = getCurrentUrl(currentUrl)
	const storageUrl = getStorageUrl(storage, env, url)
	return `${storageUrl}users/${userId}/avatar${index}.m3u8`
}
