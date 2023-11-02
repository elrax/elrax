import { createIconSetFromIcoMoon } from "@expo/vector-icons"
import { useFonts } from "expo-font"
import config from "../../assets/elrax-icons.json"

export const useIconFont = () => {
	return useFonts({
		ElraxIcons: require("../../assets/elrax-icons.ttf"),
	})
}

export const Icon = createIconSetFromIcoMoon(config, "ElraxIcons", "icomoon")
