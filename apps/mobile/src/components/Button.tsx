import React, { useRef } from "react"
import { Pressable, Text, View, Animated, StyleSheet, type ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Image } from "expo-image"
import { Icon } from "./Icon"

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	React.ComponentPropsWithoutRef<typeof Pressable> & {
		variant: "default" | "gradient" | "facebook" | "google"
		innerStyle?: ViewStyle
		icon?: string
	}
>((props, ref) => {
	const { innerStyle, icon, variant = "default", children, disabled } = props
	const fadeAnim = useRef(new Animated.Value(0)).current

	const animateGradient = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start()
	}

	const resetGradient = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start()
	}

	return (
		<View>
			<Pressable
				style={[
					styles.defaultStyle,
					{
						backgroundColor: (() => {
							if (variant === "default") {
								if (disabled) return "#D9DCDD"
								return "#007EE5"
							}
							if (variant === "gradient") return "transparent"
							if (variant === "facebook") return "#3975EA"
							if (variant === "google") return "#292a2e"
						})(),
					},
					innerStyle,
				]}
				ref={ref}
				onPressIn={animateGradient}
				onPressOut={resetGradient}
				disabled={disabled}
				{...props}
			>
				{({ pressed }) =>
					variant === "gradient" ? (
						<View
							style={{
								position: "relative",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								height: 48,
								width: "100%",
							}}
						>
							<LinearGradient
								colors={!disabled ? ["#007EE5", "#9747FF"] : ["#CFA7FB", "#B4CBFC"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={{
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									borderRadius: 36,
								}}
							/>
							<AnimatedLinearGradient
								colors={["#9747FF", "#007EE5"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={{
									opacity: fadeAnim,
									position: "absolute",
									width: "100%",
									height: "100%",
								}}
							/>
							<View style={{ flex: 1, alignItems: "center" }}>
								{icon && (
									<Icon
										style={{ marginRight: -3 }}
										name={icon}
										size={16}
										color="white"
									/>
								)}
								<Text style={[styles.defaultText, pressed && { opacity: 0.7 }]}>
									{children as string | string[]}
								</Text>
							</View>
						</View>
					) : (
						<View
							style={{
								gap: 6,
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{icon &&
								(icon === "google" ? (
									<Image
										source={require("../assets/google-logo.png")}
										style={{ width: 16, height: 16, marginRight: -2 }}
									/>
								) : (
									<Icon
										style={{ marginRight: -3 }}
										name={icon}
										size={16}
										color="white"
									/>
								))}
							<Text
								style={[
									styles.defaultText,
									pressed && { opacity: 0.7 },
									disabled && variant === "default" && { color: "#9A9BA2" },
								]}
							>
								{children as string | string[]}
							</Text>
						</View>
					)
				}
			</Pressable>
		</View>
	)
})

const styles = StyleSheet.create({
	defaultStyle: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 36,
		overflow: "hidden",
		fontFamily: "NunitoSans-Bold",
	},
	defaultText: {
		color: "white",
		paddingHorizontal: 2,
		fontSize: 16,
		fontFamily: "NunitoSans-Bold",
	},
})

Button.displayName = "Button"

export { Button }
