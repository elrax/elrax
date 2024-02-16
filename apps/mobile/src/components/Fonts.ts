import {
	useFonts,
	NunitoSans_400Regular,
	NunitoSans_700Bold,
	NunitoSans_800ExtraBold,
	NunitoSans_900Black,
} from "@expo-google-fonts/nunito-sans"

// Depricated. Embedded in native layer.
export const useNunitoSans = () => {
	return useFonts({
		NunitoSans_400Regular,
		NunitoSans_700Bold,
		NunitoSans_800ExtraBold,
		NunitoSans_900Black,
	})
}
