import React, { useState } from "react"
import { Text, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { setStatusBarStyle } from "expo-status-bar"
import { Button } from "~/components/Button"
import { VerificationCode } from "~/components/VerificationCode"
import { router } from "expo-router"

export default function Index() {
	setStatusBarStyle("dark")
	const email = "elo_vagabond@gmail.com."
	const [code, setCode] = useState("")
	const [isCodeCorrect, setIsCodeCorrect] = useState(false)
	const [isConfirmClicked, setIsConfirmClicked] = useState(false)

	const verifyCode = () => {
		// TODO: Add verification functionality
		const isValid = code === "123456"
		setIsCodeCorrect(isValid)
		if (isValid) router.replace("(app)/feed")
	}

	const handleConfirmClick = () => {
		setIsConfirmClicked(true)
		verifyCode()
	}

	const onPressOutside = () => Keyboard.dismiss()

	return (
		<TouchableWithoutFeedback className="bg-[#F7F7F7]" onPress={onPressOutside}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={16}
				className="justify-between h-full w-full flex pt-24 mb-12 px-4 flex-1"
			>
				<View>
					<Text className="font-ns-extra text-[32px] leading-[42px] text-[#181818]">
						Verification code
					</Text>
					<View className="flex gap-5 mb-4">
						<Text className="font-ns-body text-sm text-[#181818]">
							We have sent an email to
							<Text className="text-[#007EE5]"> {email} </Text>
							Please check your inbox as well as the spam folder.
						</Text>
						<Text className="font-ns-body text-sm text-[#181818]">
							Please enter the verification code below to continue with your account.
						</Text>
					</View>
					<VerificationCode
						code={code}
						setCode={setCode}
						isCodeCorrect={isConfirmClicked ? isCodeCorrect : true}
						setIsConfirmClicked={setIsConfirmClicked}
					/>
				</View>
				<Button
					variant="gradient"
					disabled={code.length !== 6}
					onPress={() => {
						handleConfirmClick()
					}}
				>
					Confirm
				</Button>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	)
}
