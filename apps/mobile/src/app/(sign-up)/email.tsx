import React, { useState } from "react"
import {
	Text,
	View,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StyleSheet,
} from "react-native"
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
		<TouchableWithoutFeedback style={{ backgroundColor: "#F7F7F7" }} onPress={onPressOutside}>
			<KeyboardAvoidingView
				behavior="padding"
				keyboardVerticalOffset={16}
				style={styles.container}
			>
				<View>
					<Text style={styles.title}>Verification code</Text>
					<View style={styles.textWrapper}>
						<Text style={styles.text}>
							We have sent an email to
							<Text style={{ color: "#007EE5" }}> {email} </Text>
							Please check your inbox as well as the spam folder.
						</Text>
						<Text style={styles.text}>
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
					innerStyle={{ width: "100%", minHeight: 48 }}
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

const styles = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		flexDirection: "column",
		paddingTop: 96,
		marginBottom: 48,
		paddingHorizontal: 16,
	},
	title: {
		fontFamily: "NunitoSans-ExtraBold",
		fontSize: 32,
		lineHeight: 42,
		color: "#181818",
	},
	textWrapper: {
		marginBottom: 16,
		gap: 20,
	},
	text: {
		fontFamily: "NunitoSans-Body",
		fontSize: 14,
		lineHeight: 20,
		color: "#181818",
	},
})
