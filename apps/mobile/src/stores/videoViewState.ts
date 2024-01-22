import { create } from "zustand"

interface VideoViewState {
	isMuted: boolean
	currentVideoId: null | string
	setCurrentVideoId: (videoId: null | string) => void
	toggleMute: () => void
}

export const useVideoViewState = create<VideoViewState>((set) => ({
	isMuted: false,
	currentVideoId: null,
	setCurrentVideoId: (videoId: null | string) =>
		set(() => ({
			currentVideoId: videoId,
		})),
	toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}))
