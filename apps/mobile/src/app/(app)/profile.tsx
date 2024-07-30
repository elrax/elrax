import React from "react"
import { View, TouchableWithoutFeedback, Keyboard, Pressable, Text, StyleSheet } from "react-native"
import { router } from "expo-router"
import { Image } from "expo-image"

import { Button } from "~/components/Button"
import { Icon } from "~/components/Icon"
import { deleteUserJWT } from "~/stores/userJWT"

const images = {
	pfp: require("../../assets/pfp.png"),
}

export default function Profile() {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View style={styles.container}>
				<View style={styles.profileContainer}>
					<View style={styles.profileImage}>
						<Image
							style={{
								width: "100%",
								height: "100%",
							}}
							source={images.pfp}
							contentFit="cover"
						/>
					</View>
					<Text style={styles.profileName}>@jewerlydesign</Text>
					<View style={styles.statsContainer}>
						<View style={styles.statsItem}>
							<Text style={styles.statsItemTitle}>3642</Text>
							<Text style={styles.statsItemValue}>Views</Text>
						</View>
						<View style={styles.divider} />
						<View style={styles.statsItem}>
							<Text style={styles.statsItemTitle}>384</Text>
							<Text style={styles.statsItemValue}>Stars</Text>
						</View>
						<View style={styles.divider} />
						<View style={styles.statsItem}>
							<Text style={styles.statsItemTitle}>52</Text>
							<Text style={styles.statsItemValue}>Shares</Text>
						</View>
					</View>
					<View style={styles.profileActions}>
						<Button innerStyle={{ width: 163 }} variant="gradient">
							Follow
						</Button>
						<Pressable style={styles.roundButton}>
							<Icon size={24} color="#9A9BA2" name="instagram" />
						</Pressable>
						<Pressable
							onPress={() => {
								// TODO: Temporary, should be replaced with a proper logout function.
								deleteUserJWT().then(() => {
									router.replace("/")
								})
							}}
							style={styles.roundButton}
						>
							<Icon size={24} color="#9A9BA2" name="chevron-down" />
						</Pressable>
					</View>
					<Text style={styles.profileDescription}>
						Fine Jewelry Created For You. Areas Leading Jeweler since 1930.
					</Text>
					<View style={styles.sectionsContainer}>
						<Pressable style={styles.section}>
							<Text style={styles.sectionText}>Campaigns</Text>
						</Pressable>
						<Pressable style={styles.section}>
							<Text style={styles.sectionText}>Collection</Text>
						</Pressable>
						<Pressable style={styles.section}>
							<Text style={styles.sectionText}>Backed</Text>
						</Pressable>
					</View>
				</View>
				<View style={styles.tabs}>
					<View style={styles.tab}>
						<Icon size={24} color="white" name="series" />
						<View
							style={{
								height: 2,
								position: "absolute",
								bottom: 0,
								width: 44,
								backgroundColor: "#fff",
							}}
						/>
					</View>
					<View style={styles.tab}>
						<Icon size={24} color="#9A9BA2" name="repost" />
					</View>
					<View style={styles.tab}>
						<Icon size={24} color="#9A9BA2" name="link-2" style={{ transform: "rotate(90deg)" }} />
					</View>
				</View>
				<View
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						flex: 1,
						backgroundColor: "#FFFFFF0F",
					}}
				></View>
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		height: "100%",
		width: "100%",
		backgroundColor: "#000A14",
		display: "flex",
		flex: 1,
		paddingTop: 96,
		alignItems: "center",
	},
	profileContainer: {
		display: "flex",
		gap: 10,
		alignItems: "center",
	},
	profileImage: {
		width: 88,
		height: 88,
		borderRadius: 9999,
		backgroundColor: "#64748b",
	},
	profileName: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 16,
		lineHeight: 24,
		color: "#fff",
	},
	statsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 10,
	},
	statsItem: {
		display: "flex",
		width: 70,
		alignItems: "center",
	},
	statsItemTitle: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 16,
		lineHeight: 24,
		color: "#fff",
	},
	statsItemValue: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 12,
		lineHeight: 16,
		color: "#9A9BA2",
	},
	divider: {
		width: 1,
		height: 20,
		backgroundColor: "#FFFFFF1A",
	},
	profileActions: {
		display: "flex",
		flexDirection: "row",
		gap: 4,
	},
	roundButton: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: 44,
		height: 44,
		borderRadius: 9999,
		backgroundColor: "#FFFFFF0F",
	},
	profileDescription: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 14,
		lineHeight: 20,
		width: 260,
		textAlign: "center",
		color: "#fff",
	},
	sectionsContainer: {
		display: "flex",
		paddingHorizontal: 24,
		paddingVertical: 8,
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		gap: 8,
	},
	section: {
		display: "flex",
		alignItems: "center",
		color: "#fff",
		width: 115,
		borderRadius: 60,
		paddingVertical: 8,
		backgroundColor: "#333B43",
	},
	sectionText: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 14,
		lineHeight: 20,
		color: "#fff",
	},
	tabs: {
		display: "flex",
		flexDirection: "row",
	},
	tab: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "33.333333%",
		height: 50,
	},
})
