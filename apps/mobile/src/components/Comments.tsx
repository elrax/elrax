import React, { useCallback, useImperativeHandle, useRef, forwardRef } from "react"
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from "react-native"
import {
	BottomSheetFlatList,
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetFooter,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet"
import { Image } from "expo-image"
import { Icon } from "~/components/Icon"

interface CommentsProps {
	comments: CommentItem[]
	onSend: (comment: string) => void
	onClose?: () => void
	onOpen?: () => void
}

export interface CommentsMethods {
	presentModal: () => void
	closeModal: () => void
}

export interface CommentItem {
	username: string
	time: string
	text: string
}

const images = {
	pfp: require("../assets/pfp.png"),
}

export const Comments = forwardRef<CommentsMethods, CommentsProps>((props, ref) => {
	// TODO: Fix this.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const commentInputRef = useRef<any>(null)
	const commentInput = useRef("")
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const snapPoints = ["60%", "90%"]
	const buttonRef = useRef<TouchableOpacity>(null)

	useImperativeHandle(ref, () => ({
		presentModal: () => bottomSheetRef.current?.present(),
		closeModal: () => bottomSheetRef.current?.close(),
	}))

	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index)
	}, [])
	const renderBackdrop = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={1}
				pressBehavior="close"
			/>
		),
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
		(propsInner: any) => (
			<BottomSheetFooter style={styles.footerContainer} {...propsInner}>
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
				<View className="w-full relative flex-1">
					<BottomSheetTextInput
						ref={commentInputRef}
						placeholder="Add your comment"
						style={styles.bottomSheetInput}
						placeholderTextColor="#bbb"
						onChangeText={(text) => {
							commentInput.current = text
							if (buttonRef.current) {
								buttonRef.current.setNativeProps({
									style: { display: text ? "flex" : "none" },
								})
							}
						}}
					/>
					<TouchableOpacity
						ref={buttonRef}
						className="absolute bg-[#1A232C] hidden rounded-full p-1 right-2 top-[5px]"
						onPress={() => {
							// TODO: Validate input.
							props.onSend(commentInput.current)
							commentInputRef.current?.clear()
						}}
					>
						<Icon color="#fff" size={20} name="arrow-up" />
					</TouchableOpacity>
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
			keyboardBehavior="extend"
			topInset={0}
			index={0}
		>
			<View className="flex justify-between items-center px-4 py-3 flex-row">
				<Text className="text-white font-ns-bold text-base">
					{props.comments.length === 1
						? "1 comment"
						: `${props.comments.length} comments`}
				</Text>
				<Pressable className="flex flex-row gap-1 items-center">
					<Text className="text-[#9A9BA2] font-ns-body text-base">All (default)</Text>
					<Icon name="chevron-down" size={20} color="#9A9BA2" />
				</Pressable>
			</View>
			<BottomSheetFlatList
				data={props.comments}
				keyExtractor={(item, index) => index.toString()}
				renderItem={renderItem}
				style={{ marginBottom: 70 }}
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
		display: "flex",
		flexDirection: "row",
		gap: 10,
		paddingVertical: 12,
		marginVertical: 12,
		paddingHorizontal: 16,
		paddingBottom: 30,
		backgroundColor: "#1A232C",
	},
	bottomSheetInput: {
		borderWidth: 1,
		color: "#fff",
		paddingHorizontal: 12,
		borderRadius: 18,
		paddingVertical: 10,
		// backgroundColor: "#F6F8F8",
		borderColor: "#F6F8F8",
	},
})
