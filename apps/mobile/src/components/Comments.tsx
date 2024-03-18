import React, { useCallback, useImperativeHandle, useRef, forwardRef } from "react"
import { StyleSheet, View, Text, Pressable } from "react-native"
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetFooter,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet"
import { Image } from "expo-image"
import { Icon } from "~/components/Icon"
import { FlatList } from "react-native-gesture-handler"

interface CustomBottomSheetProps {
	onClose?: () => void
	onOpen?: () => void
	snapPoints?: (string | number)[]
}
export interface CommentsMethods {
	presentModal: () => void
	closeModal: () => void
}

interface CommentItem {
	username: string
	time: string
	text: string
}

const images = {
	pfp: require("../assets/pfp.png"),
}

export const Comments = forwardRef<CommentsMethods, CustomBottomSheetProps>((props, ref) => {
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const snapPoints = ["60%", "100%"]

	useImperativeHandle(ref, () => ({
		presentModal: () => bottomSheetRef.current?.present(),
		closeModal: () => bottomSheetRef.current?.close(),
	}))

	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index)
	}, [])
	const comments: CommentItem[] = [
		{
			username: "Jane Doe",
			time: "2 hours ago",
			text: "Absolutely, Elon! World Central Kitchen shows that technology can be a powerful tool to solve real-world problems. Their work highlights the importance of leveraging resources for positive change. ",
		},
		{
			username: "John Smith",
			time: "3 hours ago",
			text: "WCK is an example of how compassion can make a significant impact.  ",
		},
		{
			username: "Orlando Diggs",
			time: "11 days ago",
			text: "World Central Kitchen's commitment to providing food during crises and their impact on affected communities is truly invaluable.",
		},
		{
			username: "Lori Bryson",
			time: "7 days ago",
			text: "I've been inspired by World Central Kitchen's ability to adapt and respond swiftly to emergencies. They bring hope and sustenance to people when they need it the most.",
		},
		{
			username: "John Smith",
			time: "3 hours ago",
			text: "WCK is an example of how compassion can make a significant impact.  ",
		},
		{
			username: "Orlando Diggs",
			time: "11 days ago",
			text: "World Central Kitchen's commitment to providing food during crises and their impact on affected communities is truly invaluable.",
		},
	]
	const renderBackdrop = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(props: any) => <BottomSheetBackdrop {...props} pressBehavior="close" />,
		[],
	)
	const renderItem = useCallback(
		({ item }: { item: CommentItem }) => (
			<View className="flex gap-2.5 flex-row px-4 py-2.5">
				<View className="w-[40px] h-[40px] rounded-full bg-slate-300">
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
						<Text className="text-sm text-white font-ns-bold">{item.username}</Text>
						<Text className="text-sm text-[#9A9BA2] font-ns-body">· {item.time}</Text>
					</View>
					<Text className="text-sm text-white font-ns-body">{item.text}</Text>
				</View>
			</View>
		),
		[],
	)
	const renderActivePostSheetFooter = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(props: any) => (
			<BottomSheetFooter style={styles.footerContainer} {...props}>
				<View>
					<BottomSheetTextInput
						placeholder="Add your comment"
						style={styles.bottomSheetInput}
						placeholderTextColor="#9A9BA2"
					/>
				</View>
			</BottomSheetFooter>
		),
		[],
	)

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={snapPoints}
			onChange={handleSheetChanges}
			enablePanDownToClose={true}
			backgroundStyle={styles.bg}
			handleIndicatorStyle={styles.indicator}
			backdropComponent={renderBackdrop}
			footerComponent={renderActivePostSheetFooter}
			keyboardBlurBehavior="restore"
			keyboardBehavior="interactive"
			topInset={150}
			index={1}
		>
			<View className="flex">
				<View className="flex justify-between items-center px-4 py-3 flex-row">
					<Text className="text-white font-ns-bold text-base">5.3K comments</Text>
					<Pressable className="flex flex-row gap-1 items-center">
						<Text className="text-[#9A9BA2] font-ns-body text-base">All (default)</Text>
						<Icon name="chevron-down" size={20} color="#9A9BA2" />
					</Pressable>
				</View>
			</View>
			<FlatList
				data={comments.concat(comments)}
				keyExtractor={(item, index) => index.toString()}
				renderItem={renderItem}
			/>
		</BottomSheetModal>
	)
})

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
	footerContainer: {
		paddingVertical: 12,
		margin: 12,
		paddingBottom: 30,
		backgroundColor: "#1A232C",
	},
	bottomSheetInput: {
		borderWidth: 1,
		color: "#fff",
		paddingHorizontal: 12,
		borderRadius: 8,
		paddingVertical: 10,
		borderColor: "#D9DCDD",
	},
})
