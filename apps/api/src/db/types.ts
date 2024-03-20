/** Status of the user on onboarding process */
export enum UserOnboardingStatus {
	/** User finished only first step: email or oauth2 (some doesn't include email) */
	FINISHED_FIRST_STEP = 0,
	/** User specified basic info about himself */
	SPECIFIED_INFO = 1,
	/** User selected his interests and ready to enjoy the content */
	READY = 2,
	/** User passed the vibe check */
	PASSED_VIBE_CHECK = 3,
}

/** From what source the user signed up/in */
export enum SignedWith {
	/** From user email input */
	EMAIL = 0,
	/** From AppleID authorization */
	APPLE = 1,
	/** From Google OAuth */
	GOOGLE = 2,
	/** From Facebook OAuth */
	FACEBOOK = 3,
}

/** Status of the video upload */
export enum VideoUploadStatus {
	/** Nothing uploaded yet, just called the API for Presigned URL */
	UPLOADING = 0,
	/** Segments are uploaded to R2 and now we need to check if the video is valid */
	CHECKING = 1,
	/** Video is valid and ready to be played */
	READY = 2,
	/** Video files are corrupted and need to be re-uploaded */
	CORRUPTED = 3,
}

/** Where the files are stored */
export enum Storage {
	/**
	 * Main instance of R2 Bucket
	 *
	 * __Important__: There are different storages for Staging and Production environments.
	 */
	PRIME_R2_BUCKET = 0,
}

/** Type of comment */
export enum VideoCommentType {
	/** Standard comment with text */
	STANDARD = 0,
	/** Comment with a GIF from GIPHY */
	GIPHY = 1,
}

/** Status of specific comment */
export enum VideoCommentStatus {
	/** Comment is visible by everyone */
	VISIBLE = 0,
	/** Comment is hidden by video author */
	HIDDEN_BY_AUTHOR = 1,
	/** Comment is automatically hidden by system */
	HIDDEN_BY_SYSTEM = 2,
}
