import { useFonts, NunitoSans_400Regular, NunitoSans_700Bold } from "@expo-google-fonts/nunito-sans"

export const useNunitoSans = () => {
	return useFonts({
		NunitoSans_400Regular,
		NunitoSans_700Bold,
	})
}
