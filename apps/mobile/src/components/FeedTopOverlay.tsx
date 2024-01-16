import React from "react"
import { View, Text } from "react-native"
import Constants from "expo-constants"
import type { Category } from "@elrax/api"
import { Icon } from "./Icon"

export type FeedTopOverlayProps = {
	category: Category
}

export default function FeedTopOverlay({ category }: FeedTopOverlayProps) {
	return (
		<View
			className="absolute z-20 p-4 pr-5 w-full flex-row justify-between items-center"
			style={{
				top: Constants.statusBarHeight,
				shadowColor: "#000",
				shadowOffset: {
					width: 0,
					height: 0,
				},
				shadowOpacity: 0.4,
				shadowRadius: 2,
			}}
		>
			<View>
				<Text className="font-ns-bold text-2xl text-white">
					{category.type} <Icon size={16} name="chevron-down" />
				</Text>
				<Text className="font-ns-body text-base text-white align-middle">
					<Icon size={16} name={category.icon} /> {category.name}
				</Text>
			</View>
			<View>
				<Icon color="white" size={24} name="more-vertical" />
			</View>
		</View>
	)
}
