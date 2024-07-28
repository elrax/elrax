import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Pressable } from "react-native"
import { CodeField, useClearByFocusCell } from "react-native-confirmation-code-field"

const CELL_COUNT = 6

interface VerificationCodeProps {
	code: string
	setCode: React.Dispatch<React.SetStateAction<string>>
	isCodeCorrect: boolean
	setIsConfirmClicked: React.Dispatch<React.SetStateAction<boolean>>
}

export const VerificationCode: React.FC<VerificationCodeProps> = ({
	code,
	setCode,
	isCodeCorrect,
	setIsConfirmClicked,
}) => {
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value: code,
		setValue: setCode,
	})
	const onValueChange = (code: string) => {
		if (code.length !== CELL_COUNT && !isCodeCorrect) {
			// reset red border styles after deleting symbols
			setIsConfirmClicked(false)
		}
	}

	const [timer, setTimer] = useState(60)
	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((prevTimer: number) => (prevTimer > 0 ? prevTimer - 1 : 0))
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<View style={styles.container}>
			<CodeField
				{...props}
				value={code}
				onChangeText={(code) => {
					setCode(code)
					onValueChange(code)
				}}
				cellCount={CELL_COUNT}
				rootStyle={styles.rootStyles}
				keyboardType="number-pad"
				textContentType="oneTimeCode"
				testID="my-code-input"
				renderCell={({ index, symbol, isFocused }) => (
					<Text
						key={index}
						style={[
							styles.cell,
							isFocused && styles.focusCell,
							isCodeCorrect ? styles.correctBorder : styles.incorrectBorder,
						]}
						onLayout={getCellOnLayoutHandler(index)}
					>
						{symbol}
					</Text>
				)}
			/>
			{!isCodeCorrect && <Text style={styles.wrongCodeText}>Wrong code try again</Text>}
			<Pressable
				style={{ marginTop: 4 }}
				disabled={timer > 0}
				onPress={() => {
					setTimer(60)
				}}
			>
				{timer > 0 ? (
					<Text style={styles.resendCodeInfo}>
						Resend code in <Text style={styles.resendCodeColor}>{timer}</Text> seconds
					</Text>
				) : (
					<Text style={{ ...styles.resendCodeInfo, ...styles.resendCodeColor }}>
						Resend code
					</Text>
				)}
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	rootStyles: {
		gap: 8,
	},
	container: {
		width: "100%",
		marginBottom: 16,
		marginHorizontal: "auto",
		alignItems: "center",
	},
	wrongCodeText: {
		marginTop: 4,
		fontSize: 14,
		lineHeight: 20,
		color: "#FF6C7E",
		textAlign: "left",
		width: "100%",
	},
	cell: {
		width: 48,
		height: 48,
		lineHeight: 48,
		fontSize: 24,
		backgroundColor: "#000A140F",
		textAlign: "center",
		borderRadius: 8,
		overflow: "hidden",
		fontFamily: "NunitoSans-ExtraBold",
		color: "#181818",
	},
	correctBorder: {
		borderWidth: 1,
		borderColor: "#000A141A",
	},
	incorrectBorder: {
		borderWidth: 2,
		borderColor: "#FF6C7E",
	},
	focusCell: {
		borderWidth: 2,
		borderColor: "#007EE5",
	},
	resendCodeColor: {
		color: "#007EE5",
	},
	resendCodeInfo: {
		fontFamily: "NunitoSans-Bold",
		fontSize: 14,
	},
})
