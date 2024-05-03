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
		<View className="flex w-[305px] mb-4 mx-auto items-center">
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
						className="overflow-hidden font-ns-extra text-[#181818]"
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
			{!isCodeCorrect && (
				<Text className="mt-1 text-sm text-[#FF6C7E] text-left w-full">
					Wrong code try again
				</Text>
			)}
			<Pressable
				className="mt-4"
				disabled={timer > 0}
				onPress={() => {
					setTimer(60)
				}}
			>
				{timer > 0 ? (
					<Text className="text-sm font-ns-body">
						Resend code in <Text className="text-[#007EE5]">{timer}</Text> seconds
					</Text>
				) : (
					<Text className="text-[#007EE5] text-sm font-ns-body">Resend code</Text>
				)}
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	rootStyles: { display: "flex", gap: 8 },
	cell: {
		width: 44,
		height: 44,
		lineHeight: 44,
		fontSize: 24,
		backgroundColor: "#000A140F",
		textAlign: "center",
		borderRadius: 8,
		overflow: "hidden",
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
})
