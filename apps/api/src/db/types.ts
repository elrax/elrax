/** From what source we retrieved the user's email address */
export enum EmailOrigin {
	/** From user input */
	User = 0,
	/** From AppleID authorization */
	Apple = 1,
	/** From Google OAuth */
	Google = 2,
	/** From Facebook OAuth */
	Facebook = 3,
}

/** Status of the video upload */
export enum VideoUploadStatus {
	/** Nothing uploaded yet, just called the API for Presigned URL */
	Uploading = 0,
	/** Segments are uploaded to R2 and now we need to check if the video is valid */
	Checking = 1,
	/** Video is valid and ready to be played */
	Ready = 2,
	/** Video files are corrupted and need to be re-uploaded */
	Corrupted = 3,
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
