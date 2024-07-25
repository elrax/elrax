import React, { useState } from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Animated, {
	useAnimatedStyle,
	interpolate,
	Extrapolation,
	useDerivedValue,
	withTiming,
} from "react-native-reanimated"
import type { VideoProps } from "@elrax/api"
import { Icon } from "../Icon"
import { TouchableScale } from "../TouchableScale"

export type OverlayProps = {
	item: VideoProps
	commentsNumber: number
	sharesNumber: number
	height: number
	opacity: number
	onPressReaction: (item: VideoProps) => void
	onPressComments: (item: VideoProps) => void
}

export function Overlay(props: OverlayProps) {
	const [currentLikes, setCurrentLikes] = useState(3112)
	const [isLiked, setIsLiked] = useState(false)

	const opacityDerived = useDerivedValue(() => {
		return withTiming(props.opacity, { duration: 200 })
	})
	const animatedStyles = useAnimatedStyle(() => ({
		opacity: interpolate(opacityDerived.value, [0, 1], [0, 1], Extrapolation.CLAMP),
	}))

	return (
		<>
			<LinearGradient
				colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.6)"]}
				style={styles.gradient}
				pointerEvents="none"
			/>
			<Animated.View style={[animatedStyles, styles.animatedView]} pointerEvents="box-none">
				<View style={styles.container} pointerEvents="box-none">
					<View style={{ width: "100%", maxWidth: "82%", alignItems: "flex-start" }}>
						<TouchableScale>
							<View style={styles.skipPreviewButton}>
								<Text style={styles.skipPreviewText}>Skip preview</Text>
							</View>
						</TouchableScale>
						<TouchableScale scaleTo={0.99}>
							<Text style={styles.textAuthor}>@{props.item.author.username}</Text>
						</TouchableScale>
						<Text style={styles.descriptionText} numberOfLines={1}>
							{props.item.description}
						</Text>
						<TouchableScale scaleTo={0.99} innerStyle="w-full">
							<View
								style={{
									backgroundColor: "rgba(24,24,24,0.8)",
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									borderRadius: 12,
									paddingLeft: 12,
									paddingVertical: 8,
								}}
							>
								<View style={{ gap: 8 }}>
									<Text
										style={{ fontFamily: "NunitoSans-Bold", color: "#FFFFFF" }}
									>
										$69,383 raised of $23,000
									</Text>
									<View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
										<Text
											style={{
												fontFamily: "NunitoSans-Regular",
												color: "#FFFFFF",
											}}
										>
											<Icon name="clock" /> 33 days to go
										</Text>
										<Text
											style={{
												fontFamily: "NunitoSans-Regular",
												color: "#FFFFFF",
											}}
										>
											<Icon name="map-pin" /> San Francisco, CA
										</Text>
									</View>
								</View>
								<View style={{ justifyContent: "center" }}>
									<Icon color="white" size={24} name="chevron-right" />
								</View>
							</View>
						</TouchableScale>
					</View>
					<View className="items-center -mr-2 justify-center pr-1 gap-2 w-18">
						<TouchableScale innerStyle="flex-column items-center mb-2">
							<View
								style={styles.iconShadow}
								className="bg-black rounded-full border-[1px] border-white overflow-hidden"
							>
								<Image
									style={{ width: 40, height: 40 }}
									alt="avatar"
									source={{ uri: props.item.author.urlAvatar }}
								/>
								{/* <View className="bg-[#4C5152] -mt-2.5 py-0.5 rounded-full items-center">
								<Text className="font-ns-bold text-xs color-white">Join</Text>
							</View> */}
							</View>
						</TouchableScale>
						<TouchableScale
							innerStyle="py-3 items-center w-full"
							onPress={() => {
								props.onPressReaction(props.item)
								setIsLiked(!isLiked)
								if (isLiked) {
									setCurrentLikes(currentLikes - 1)
								} else {
									setCurrentLikes(currentLikes + 1)
								}
							}}
						>
							<Icon
								color={isLiked ? "#FFDB5A" : "white"}
								size={28}
								name={isLiked ? "star-1-close" : "star-1-open"}
								style={styles.iconShadow}
							/>
							<Text
								className={`font-ns-bold text-center pt-2 ${
									isLiked ? "text-[#FFDB5A]" : "text-white"
								}`}
							>
								{currentLikes}
							</Text>
						</TouchableScale>
						<TouchableScale
							innerStyle="py-3 items-center w-full"
							onPress={() => {
								props.onPressComments(props.item)
							}}
						>
							<Icon
								className="text-center"
								color="white"
								size={28}
								name="message-circle"
								style={styles.iconShadow}
							/>
							<Text className="font-ns-bold color-white text-center pt-2">
								{props.commentsNumber}
							</Text>
						</TouchableScale>
						<TouchableScale innerStyle="py-3 items-center w-full">
							<Icon
								className="text-center"
								color="white"
								size={28}
								name="send"
								style={styles.iconShadow}
							/>
							<Text className="font-ns-bold color-white text-center pt-2">
								{props.sharesNumber}
							</Text>
						</TouchableScale>
						<TouchableScale innerStyle="pt-3 pb-2 items-center w-full">
							<Image
								style={styles.iconShadow}
								className="h-10 w-10 rounded-full bg-black"
								alt="avatar"
								source={{ uri: "https://i.imgur.com/d5502Q2.png" }}
							/>
						</TouchableScale>
					</View>
				</View>
			</Animated.View>
		</>
	)
}

const styles = StyleSheet.create({
	gradient: {
		position: "absolute",
		zIndex: 10,
		bottom: 0,
		height: 160,
		width: "100%",
	},
	animatedView: {
		position: "absolute",
		zIndex: 20,
		maxWidth: "100%",
		bottom: 0,
	},
	textAuthor: { fontFamily: "NonitoSans-Bold", fontSize: 18, lineHeight: 28, color: "#fff" },
	descriptionText: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 16,
		lineHeight: 24,
		color: "#FFFFFF",
		marginBottom: 8,
	},
	container: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginLeft: 16,
		marginBottom: 16,
	},
	skipPreviewButton: {
		marginBottom: 8,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 9999,
		borderWidth: 1,
		borderColor: "#FFFFFF",
	},
	skipPreviewText: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 14,
		lineHeight: 20,
		color: "#FFFFFF",
	},
	iconShadow: {
		textAlign: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.4,
		shadowRadius: 2,
	},
})
