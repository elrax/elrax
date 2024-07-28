import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import { router } from "expo-router"
import { Button } from "~/components/Button"

export default function Index() {
	setStatusBarStyle("light")

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Sign in page</Text>
			<Button
				innerStyle={{ marginTop: 16 }}
				variant="gradient"
				onPress={() => {
					router.replace("/")
				}}
			>
				Sign in
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
