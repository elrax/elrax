import * as SecureStore from "expo-secure-store"

export const setUserJWT = async (jwt: string) => {
	await SecureStore.setItemAsync("userJWT", jwt)
}

export const getUserJWT = () => {
	return SecureStore.getItemAsync("userJWT")
}
