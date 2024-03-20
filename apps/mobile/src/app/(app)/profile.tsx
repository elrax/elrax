import React from "react"
import { View, TouchableWithoutFeedback, Keyboard, Pressable, Text } from "react-native"
import { Button } from "~/components/Button"
import { Icon } from "~/components/Icon"
import { Image } from "expo-image"

const images = {
	pfp: require("../../assets/pfp.png"),
}

export default function Profile() {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<View className="bg-[#000A14] flex-1 flex pt-24 items-center h-full w-full">
				<View className="flex items-center gap-2.5">
					<View className="w-[88px] h-[88px] rounded-full bg-slate-500">
						<Image
							style={{
								width: "100%",
								height: "100%",
							}}
							source={images.pfp}
							contentFit="cover"
						/>
					</View>
					<Text className="text-base text-white font-ns-bold">@jewerlydesign</Text>
					<View className="flex gap-x-2.5 justify-between flex-row items-center">
						<View className="flex w-[70px] items-center">
							<Text className="text-base text-white font-ns-bold">3642</Text>
							<Text className="text-xs text-[#9A9BA2] font-ns-body">Views</Text>
						</View>
						<View className="divider w-[1px] h-5 bg-[#FFFFFF1A]" />
						<View className="flex w-[70px] items-center">
							<Text className="text-base text-white font-ns-bold">384</Text>
							<Text className="text-xs text-[#9A9BA2] font-ns-body">Stars</Text>
						</View>
						<View className="divider w-[1px] h-5 bg-[#FFFFFF1A]" />
						<View className="flex w-[70px] items-center">
							<Text className="text-base text-white font-ns-bold">52</Text>
							<Text className="text-xs text-[#9A9BA2] font-ns-body">Shares</Text>
						</View>
					</View>
					<View className="flex flex-row gap-x-1">
						<Button className="w-[163px]" variant="gradient">
							Follow
						</Button>
						<Pressable className="flex items-center justify-center h-11 bg-[#FFFFFF0F] rounded-full w-11">
							<Icon size={24} color="#9A9BA2" name="instagram" />
						</Pressable>
						<Pressable className="flex items-center justify-center h-11 bg-[#FFFFFF0F] rounded-full w-11">
							<Icon size={24} color="#9A9BA2" name="chevron-down" />
						</Pressable>
					</View>
					<Text className="text-white font-ns-body text-sm w-[260px] text-center">
						Fine Jewelry Created For You. Areas Leading Jeweler since 1930.
					</Text>
					<View className="flex px-6 py-2 flex-row w-full justify-between">
						<Pressable className="text-white w-[115px] flex items-center rounded-[60px] px-4 py-2 bg-[#333B43]">
							<Text className="text-white font-ns-bold text-sm">Campaigns</Text>
						</Pressable>
						<Pressable className="text-white w-[115px] flex items-center rounded-[60px] px-4 py-2">
							<Text className="text-white font-ns-bold text-sm">Collection</Text>
						</Pressable>
						<Pressable className="text-white w-[115px] flex items-center rounded-[60px] px-4 py-2">
							<Text className="text-white font-ns-bold text-sm">Backed</Text>
						</Pressable>
					</View>
				</View>
				<View className="flex flex-row">
					<View className="w-1/3 relative h-[50px] items-center justify-center">
						<Icon size={24} color="white" name="series" />
						<View className="h-[2px] absolute bottom-0 w-11 bg-white" />
					</View>
					<View className="w-1/3 relative h-[50px] items-center justify-center">
						<Icon size={24} color="#9A9BA2" name="repost" />
					</View>
					<View className="w-1/3 relative h-[50px] items-center justify-center">
						<Icon size={24} color="#9A9BA2" name="link-2" className="rotate-90" />
					</View>
				</View>
				<View className="flex w-full flex-1 h-full bg-[#FFFFFF0F]"></View>
			</View>
		</TouchableWithoutFeedback>
	)
}
