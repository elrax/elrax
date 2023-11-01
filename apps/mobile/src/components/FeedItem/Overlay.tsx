import React, { useState } from "react"
import { View, Text, Image, TouchableOpacity } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import type { FeedItem } from "./types"
import { Icon, AnimatedIcon } from "../Icon"

export type OverlayProps = {
	item: FeedItem
	height: number
}

export function Overlay({ item }: OverlayProps) {
	return (
		<>
			<LinearGradient
				colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.5)"]}
				className={"absolute z-10 bottom-0 h-[160px] w-full"}
			/>
			<View className="absolute z-50 p-4 pr-0 bottom-0 w-full max-w-full">
				{BottomOverlay(item)}
			</View>
		</>
	)
}

function BottomOverlay(item: FeedItem) {
	const [currentLikes, setCurrentLikes] = useState(0)
	const [isLiked, setIsLiked] = useState(false)
	const likeAnimationSize = useSharedValue(32)

	return (
		<View className="flex-row justify-between items-end">
			<View className="w-full max-w-[82%]">
				<TouchableOpacity activeOpacity={0.8}>
					<Text className="font-ns-bold text-lg color-white">
						@{item.author.username}
					</Text>
				</TouchableOpacity>
				<Text className="font-ns-body text-base color-white">{item.description}</Text>
			</View>
			<View className="items-center justify-center pr-2 gap-2 w-18">
				<TouchableOpacity activeOpacity={0.8} className="py-1 items-center w-full">
					<Image
						className="h-12 w-12 rounded-full"
						alt="avatar"
						source={{ uri: item.author.uriAvatar }}
					/>
					<View className="bg-[#4C5152] -mt-2.5 px-2 py-0.5 rounded-full">
						<Text className="font-ns-bold text-xs color-white">Join</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					className="py-1 items-center w-full"
					onPressIn={() => {
						likeAnimationSize.value = 28
					}}
					onPressOut={() => {
						likeAnimationSize.value = 32
					}}
					onPress={() => {
						setIsLiked(!isLiked)
						if (isLiked) {
							setCurrentLikes(currentLikes - 1)
						} else {
							setCurrentLikes(currentLikes + 1)
						}
					}}
				>
					<AnimatedIcon
						color={isLiked ? "#FFDB5A" : "white"}
						size={likeAnimationSize}
						name={isLiked ? "star-1-close" : "star-1-open"}
					/>
					<Text
						className={`font-ns-bold text-center pt-2 ${
							isLiked ? "text-[#FFDB5A]" : "text-white"
						}`}
					>
						{currentLikes}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} className="py-1 items-center w-full">
					<Icon color="white" size={32} name="message-circle" />
					<Text className="font-ns-bold color-white text-center pt-2">0</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} className="py-1 items-center w-full">
					<Icon color="white" size={32} name="send" />
					<Text className="font-ns-bold color-white text-center pt-2">0</Text>
				</TouchableOpacity>
				<TouchableOpacity activeOpacity={0.8} className="py-1 items-center w-full">
					<Image
						className="h-10 w-10 rounded-full"
						alt="avatar"
						source={{ uri: "https://i.imgur.com/d5502Q2.png" }}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}
