import React, { useState } from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import type { VideoProps } from "@elrax/api"
import { Icon } from "../Icon"
import { TouchableScale } from "../TouchableScale"

export type OverlayProps = {
	item: VideoProps
	height: number
	isScrolling: boolean
}

export function Overlay({ item, isScrolling }: OverlayProps) {
	const [currentLikes, setCurrentLikes] = useState(3112)
	const [isLiked, setIsLiked] = useState(false)

	return (
		<>
			<LinearGradient
				colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.5)"]}
				className={"absolute z-10 bottom-0 h-[160px] w-full"}
			/>
			<View
				className="absolute z-20 p-4 pr-1 bottom-0 w-full max-w-full"
				style={{
					opacity: isScrolling ? 0.5 : 1,
				}}
			>
				<View className="flex-row justify-between items-end">
					<View className="w-full max-w-[82%] items-start">
						<TouchableScale>
							<View className="mb-2 px-2.5 py-1 rounded-full border-[1px] border-white">
								<Text className="font-ns-bold text-sm color-white">
									Skip preview
								</Text>
							</View>
						</TouchableScale>
						<TouchableScale scaleTo={0.99}>
							<Text className="font-ns-bold text-lg color-white">
								@{item.author.username}
							</Text>
						</TouchableScale>
						<Text className="font-ns-body text-base color-white mb-2" numberOfLines={1}>
							{item.description}
						</Text>
						<TouchableScale scaleTo={0.99} innerStyle="w-full">
							<View
								className="flex-row justify-between rounded-xl w-full pl-3 py-2"
								style={{
									backgroundColor: "rgba(24,24,24,0.8)",
								}}
							>
								<View className="text-xs gap-0.2">
									<Text className="font-ns-bold color-white">
										$69,383 raised of $23,000
									</Text>
									<View className="flex-row gap-2">
										<Text className="font-ns-body color-white">
											<Icon name="clock" /> 33 days to go
										</Text>
										<Text className="font-ns-body color-white">
											<Icon name="map-pin" /> San Francisco, CA
										</Text>
									</View>
								</View>
								<View className="justify-center">
									<Icon color="white" size={24} name="chevron-right" />
								</View>
							</View>
						</TouchableScale>
					</View>
					<View className="items-center justify-center pr-1 gap-2 w-18">
						<TouchableScale innerStyle="flex-column items-center mb-2">
							<View
								style={style.iconShadow}
								className="bg-black rounded-full border-[1px] border-white overflow-hidden"
							>
								<Image
									className="h-10 w-10"
									alt="avatar"
									source={{ uri: item.author.uriAvatar }}
								/>
								{/* <View className="bg-[#4C5152] -mt-2.5 py-0.5 rounded-full items-center">
								<Text className="font-ns-bold text-xs color-white">Join</Text>
							</View> */}
							</View>
						</TouchableScale>
						<TouchableScale
							innerStyle="py-3 items-center w-full"
							onPress={() => {
								setIsLiked(!isLiked)
								if (isLiked) {
									setCurrentLikes(currentLikes - 1)
								} else {
									setCurrentLikes(currentLikes + 1)
								}
							}}
						>
							<Icon
								className="text-center"
								color={isLiked ? "#FFDB5A" : "white"}
								size={28}
								name={isLiked ? "star-1-close" : "star-1-open"}
								style={style.iconShadow}
							/>
							<Text
								className={`font-ns-bold text-center pt-2 ${
									isLiked ? "text-[#FFDB5A]" : "text-white"
								}`}
							>
								{currentLikes}
							</Text>
						</TouchableScale>
						<TouchableScale innerStyle="py-3 items-center w-full">
							<Icon
								className="text-center"
								color="white"
								size={28}
								name="message-circle"
								style={style.iconShadow}
							/>
							<Text className="font-ns-bold color-white text-center pt-2">325</Text>
						</TouchableScale>
						<TouchableScale innerStyle="py-3 items-center w-full">
							<Icon
								className="text-center"
								color="white"
								size={28}
								name="send"
								style={style.iconShadow}
							/>
							<Text className="font-ns-bold color-white text-center pt-2">4321</Text>
						</TouchableScale>
						<TouchableScale innerStyle="pt-3 pb-2 items-center w-full">
							<Image
								style={style.iconShadow}
								className="h-10 w-10 rounded-full bg-black"
								alt="avatar"
								source={{ uri: "https://i.imgur.com/d5502Q2.png" }}
							/>
						</TouchableScale>
					</View>
				</View>
			</View>
		</>
	)
}

const style = StyleSheet.create({
	iconShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowOpacity: 0.4,
		shadowRadius: 2,
	},
})
