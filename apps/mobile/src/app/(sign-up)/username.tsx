import { router } from "expo-router"
import { setStatusBarStyle } from "expo-status-bar"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Button } from "~/components/Button"

export default function Index() {
	setStatusBarStyle("dark")

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Set your username</Text>
			<Button
				innerStyle={{ marginTop: 16 }}
				variant="gradient"
				onPress={() => {
					router.replace("(app)/feed")
				}}
			>
				Finish sign up
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
		backgroundColor: "#F7F7F7",
	},
	text: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 16,
		lineHeight: 24,
		color: "#000",
	},
})
