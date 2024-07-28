import React, { useState, useEffect } from "react"
import { TextInput, View, TouchableOpacity, Text } from "react-native"
import { Icon } from "./Icon"

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput> & {
		type?: "text" | "password"
		errorMsg: string
	}
>(({ style, errorMsg, type = "text", ...props }, ref) => {
	const [text, setText] = useState("")
	// const [error, setError] = useState(false)
	const [isSecure, setIsSecure] = useState(type === "password")

	useEffect(() => {
		if (props.value !== undefined && props.value !== text) {
			setText(props.value)
		}
	}, [props.value, text])

	const handleClearText = () => {
		setText("")
		if (props.onChangeText) {
			props.onChangeText("")
		}
	}

	const toggleSecureEntry = () => {
		setIsSecure(!isSecure)
		if (props.onChangeText) {
			props.onChangeText(text)
		}
	}

	return (
		<View style={{ position: "relative" }}>
			<TextInput
				ref={ref}
				style={[
					style,
					{
						fontFamily: "NunitoSans-Regular",
						width: "100%",
						height: 48,
						paddingHorizontal: 3,
						paddingVertical: 2.5,
						color: "#181818",
						alignItems: "center",
						backgroundColor: "#000A140F",
						lineHeight: 24,
						borderRadius: 8,
						borderColor: "#D9DCDD",
						// placeholder:text-[#9A9BA2] disabled:opacity-50",
					},
				]}
				onChangeText={(text) => setText(text)}
				value={text}
				secureTextEntry={isSecure}
				{...props}
			/>
			{text.length > 0 && (
				<TouchableOpacity
					style={{
						position: "absolute",
						right: 3,
						top: 13,
					}}
					onPress={type === "password" ? toggleSecureEntry : handleClearText}
					accessibilityLabel={
						type === "password" ? "Toggle password visibility" : "Clear text"
					}
				>
					<Icon
						color="#9A9BA2"
						size={20}
						name={type === "password" ? (isSecure ? "eye" : "eye-off") : "x-circle"}
					/>
				</TouchableOpacity>
			)}
			{type === "password" && (
				<View
					style={{
						marginTop: 1,
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text
						style={{
							fontFamily: "NunitoSans-Regular",
							color: "#9A9BA2",
						}}
					>
						Letters, numbers, and special characters
					</Text>
					<Text
						style={{
							fontFamily: "NunitoSans-Regular",
							color: "#9A9BA2",
						}}
					>
						{text.length}/16
					</Text>
				</View>
			)}
			{false && (
				<View style={{ marginTop: 1 }}>
					<Text
						style={{
							fontFamily: "NunitoSans-Regular",
							color: "#FF6C7E",
						}}
					>
						{errorMsg}
					</Text>
				</View>
			)}
		</View>
	)
})

Input.displayName = "Input"

export { Input }
