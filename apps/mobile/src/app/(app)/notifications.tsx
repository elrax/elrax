import React from "react"
import { View, Button } from "react-native"
import { checkForUpdateAsync, fetchUpdateAsync, reloadAsync } from "expo-updates"

export default function Notifications() {
	// TODO: Move this logic
	async function onFetchUpdateAsync() {
		try {
			const update = await checkForUpdateAsync()

			if (update.isAvailable) {
				await fetchUpdateAsync()
				await reloadAsync()
			} else {
				alert("No updates available")
			}
		} catch (error) {
			// You can also add an alert() to see the error message in case of an error when fetching updates.
			alert(`Error fetching latest Expo update: ${error}`)
		}
	}
	return (
		<View className="bg-[#000A14] h-full w-full flex justify-center items-center">
			<Button onPress={onFetchUpdateAsync} title="Fetch app updates" />
		</View>
	)
}
