export const handleError = (e: unknown) => {
	if (e instanceof Error) {
		console.error(e)
	} else {
		console.error(new Error(e as string))
	}
}
