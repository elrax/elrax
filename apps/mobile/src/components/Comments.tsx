import React, { useCallback, useRef } from "react"
import { StyleSheet, View, Text, Pressable } from "react-native"
import BottomSheet from "@gorhom/bottom-sheet"
import { Image } from "expo-image"
import { Icon } from "~/components/Icon"

interface CustomBottomSheetProps {
	isVisible: boolean
	onClose?: () => void
	onOpen?: () => void
	snapPoints?: (string | number)[]
}

const images = {
	pfp: require("../assets/pfp.png"),
}
export const Comments: React.FC<CustomBottomSheetProps> = ({
	isVisible,
	onClose,
	snapPoints = ["50%", "80%"],
}) => {
	const bottomSheetRef = useRef<BottomSheet>(null)

	const handleSheetChanges = useCallback(
		(index: number) => {
			console.log("handleSheetChanges", index)
			if (index === -1 && onClose) {
				onClose()
			}
		},
		[onClose],
	)

	return (
		<BottomSheet
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			enablePanDownToClose={true}
			backgroundStyle={styles.bg}
			handleIndicatorStyle={styles.indicator}
			index={isVisible ? 0 : -1}
		>
			<View>
				<View className="flex">
					<View className="flex justify-between items-center px-5 py-3 flex-row">
						<Text className="text-white font-ns-bold text-base">5.3K comments</Text>
						<Pressable className="flex flex-row gap-1 items-center">
							<Text className="text-[#9A9BA2] font-ns-body text-base">
								All (default)
							</Text>
							<Icon name="chevron-down" size={20} color="#9A9BA2" />
						</Pressable>
					</View>
					<View className="flex w-full">
						<View className="flex gap-2.5 flex-row px-5 py-2.5">
							<View className="w-[40px] h-[40px] rounded-full bg-slate-500">
								<Image
									style={{
										width: "100%",
										height: "100%",
									}}
									source={images.pfp}
									contentFit="cover"
								/>
							</View>
							<View className="flex flex-1">
								<View className="flex gap-1 flex-row">
									<Text className="text-base text-white font-ns-bold">
										Orlando Diggs
									</Text>
									<Text className="text-base text-[#9A9BA2] font-ns-body">
										· 11d ago
									</Text>
								</View>
								<Text className="text-base text-white font-ns-body">
									World Central Kitchen's commitment to providing food during
									crises and their impact on affected communities is truly
									invaluable.
								</Text>
							</View>
						</View>
						<View className="flex gap-2.5 flex-row px-5 py-2.5">
							<View className="w-[40px] h-[40px] rounded-full bg-slate-500">
								<Image
									style={{
										width: "100%",
										height: "100%",
									}}
									source={images.pfp}
									contentFit="cover"
								/>
							</View>
							<View className="flex flex-1">
								<View className="flex items-center gap-x-1 flex-row">
									<View className="flex items-center flex-row">
										<Text className="text-base text-white font-ns-bold">
											Lori Bryson
										</Text>
										<Icon
											className="ml-1"
											name="verify"
											size={16}
											color="#007EE5"
										/>
									</View>
									<Text className="text-base text-[#9A9BA2] font-ns-body">
										· 7d ago
									</Text>
								</View>
								<Text className="text-base text-white font-ns-body">
									I've been inspired by World Central Kitchen's ability to adapt
									and respond swiftly to emergencies. They bring hope and
									sustenance to people when they need it the most.
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
		</BottomSheet>
	)
}

const styles = StyleSheet.create({
	indicator: {
		backgroundColor: "white",
		marginTop: 8,
		width: 44,
		height: 4,
	},
	bg: {
		backgroundColor: "#1A232C",
		borderRadius: 24,
	},
})
