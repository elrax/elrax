import type { Category } from "@elrax/api"
import Constants from "expo-constants"
import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Icon } from "./Icon"

export type FeedTopOverlayProps = {
	category: Category
}

export default function FeedTopOverlay({ category }: FeedTopOverlayProps) {
	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.categoryTypeText}>
					{category.type} <Icon size={16} name="chevron-down" />
				</Text>
				<Text style={styles.categoryNameText}>
					<Icon size={16} name={category.icon} /> {category.name}
				</Text>
			</View>
			<View>
				<Icon color="white" size={24} name="more-vertical" />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		top: Constants.statusBarHeight,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.4,
		shadowRadius: 2,
		display: "flex",
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		paddingRight: 20,
		zIndex: 20,
		position: "absolute",
	},
	categoryTypeText: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 24,
		lineHeight: 32,
		color: "#fff",
	},
	categoryNameText: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 16,
		lineHeight: 24,
		color: "#fff",
		verticalAlign: "middle",
	},
})
