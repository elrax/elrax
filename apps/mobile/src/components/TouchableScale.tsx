import React, { type ReactElement } from "react"
import { type GestureResponderEvent, type StyleProp, TouchableOpacity, type ViewStyle } from "react-native"
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	useDerivedValue,
	withTiming,
	interpolate,
	Extrapolate,
} from "react-native-reanimated"

export type TouchableScaleProps = {
	innerStyle?: StyleProp<ViewStyle>
	children?: ReactElement | ReactElement[]
	onPress?: (event: GestureResponderEvent) => void
	scaleTo?: number
	disabled?: boolean
	touchableProps?: React.ComponentProps<typeof TouchableOpacity>
}

export const TouchableScale = ({
	onPress,
	innerStyle,
	children,
	scaleTo = 0.94,
	touchableProps,
	disabled = false,
}: TouchableScaleProps) => {
	const pressed = useSharedValue(false)
	const progress = useDerivedValue(() => {
		return pressed.value ? withTiming(1, { duration: 50 }) : withTiming(0, { duration: 50 })
	})
	const animatedStyle = useAnimatedStyle(() => {
		const scale = interpolate(progress.value, [0, 1], [1, scaleTo], Extrapolate.CLAMP)
		return { transform: [{ scale }] }
	})
	return (
		<TouchableOpacity
			style={innerStyle}
			activeOpacity={0.8}
			onPressIn={() => {
				pressed.value = true
			}}
			onPressOut={() => {
				pressed.value = false
			}}
			onPress={onPress}
			disabled={disabled}
			{...touchableProps}
		>
			<Animated.View pointerEvents="none" style={[animatedStyle, innerStyle]}>
				{children}
			</Animated.View>
		</TouchableOpacity>
	)
}
