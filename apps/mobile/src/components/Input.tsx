import React, { useState, useEffect } from "react"
import { TextInput, View, TouchableOpacity, Text } from "react-native"
import { cn } from "~/utils/style"
import { Icon } from "./Icon"

const Input = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput> & {
		type?: "text" | "password"
		errorMsg: string
	}
>(({ className, errorMsg, type = "text", ...props }, ref) => {
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
		<View className="relative">
			<TextInput
				ref={ref}
				className={cn(
					"rounded-lg border font-ns-body w-full border-[#D9DCDD] bg-[#000A140F] px-3 py-2.5 text-base h-12 leading-[24px] text-[#181818] items-center placeholder:text-[#9A9BA2] disabled:opacity-50",
					className,
				)}
				onChangeText={(text) => setText(text)}
				value={text}
				secureTextEntry={isSecure}
				{...props}
			/>
			{text.length > 0 && (
				<TouchableOpacity
					className="absolute right-3 top-[13px]"
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
				<View className="mt-1 flex-row justify-between">
					<Text className="text-[#9A9BA2] font-ns-body">
						Letters, numbers, and special characters
					</Text>
					<Text className="text-[#9A9BA2] font-ns-body">{text.length}/16</Text>
				</View>
			)}
			{false && (
				<View className="mt-1">
					<Text className="text-[#FF6C7E] font-ns-body">{errorMsg}</Text>
				</View>
			)}
		</View>
	)
})

Input.displayName = "Input"

export { Input }
