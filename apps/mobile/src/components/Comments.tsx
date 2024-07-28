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
			<View style={styles.commentContainer}>
				<View style={styles.commentImage}>
					<Image
						style={{
							width: "100%",
							height: "100%",
						}}
						source={images.pfp}
						contentFit="cover"
					/>
				</View>
				<View style={{ display: "flex", flex: 1 }}>
					<View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
						<Text style={styles.commentUsername}>{item.username}</Text>
						<Text style={styles.commentTime}>· {item.time}</Text>
					</View>
					<Text style={styles.commentText}>{item.text}</Text>
				</View>
			</View>
		),
		[],
	)
	const renderActivePostSheetFooter = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(propsInner: any) => (
			<BottomSheetFooter style={styles.footerContainer} {...propsInner}>
				<View style={styles.footerImage}>
					<Image
						style={{
							width: "100%",
							height: "100%",
						}}
						source={images.pfp}
						contentFit="cover"
					/>
				</View>
				<View style={{ flex: 1, width: "100%", position: "relative" }}>
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
						style={styles.footerButton}
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
			<View style={styles.headerContainer}>
				<Text style={styles.headerText}>
					{props.comments.length === 1
						? "1 comment"
						: `${props.comments.length} comments`}
				</Text>
				<Pressable style={styles.headerButton}>
					<Text style={styles.headerButtonText}>All (default)</Text>
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
	headerContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	headerText: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 16,
		lineHeight: 24,
		color: "#fff",
	},
	headerButton: {
		display: "flex",
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
	},
	headerButtonText: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 16,
		lineHeight: 24,
		color: "#9A9BA2",
	},
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
	footerImage: {
		width: 40,
		height: 40,
		borderRadius: 9999,
		backgroundColor: "#cbd5e1",
	},
	footerButton: {
		position: "absolute",
		right: 8,
		top: 5,
		borderRadius: 9999,
		display: "none",
		backgroundColor: "#1A232C",
		padding: 4,
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
	commentContainer: {
		display: "flex",
		flexDirection: "row",
		gap: 10,
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	commentImage: {
		width: 40,
		height: 40,
		borderRadius: 9999,
		backgroundColor: "#cbd5e1",
	},
	commentUsername: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 14,
		lineHeight: 20,
		color: "#fff",
	},
	commentTime: {
		fontFamily: "NunitoSans-Regular",
		fontSize: 14,
		lineHeight: 20,
		color: "#9A9BA2",
	},
	commentText: {
		fontFamily: "NunitoSans-Body",
		fontSize: 14,
		lineHeight: 20,
		color: "#fff",
	},
})
