import { cva, type VariantProps } from "class-variance-authority"
import React, { useRef } from "react"
import { cn } from "~/utils/style"
import { Pressable, Text, View, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const buttonVariants = cva(
	["flex-row items-center w-full justify-center rounded-[36px] overflow-hidden"],
	{
		variants: {
			variant: {
				default: "bg-[#007EE5]",
				gradient: "",
			},
			size: {
				default: "h-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

const buttonTextVariants = cva("text-base px-2", {
	variants: {
		variant: {
			default: "text-white",
			gradient: "text-white",
		},
		size: {
			default: "font-ns-bold",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	React.ComponentPropsWithoutRef<typeof Pressable> &
		VariantProps<typeof buttonVariants> & {
			textClass?: string
		}
>(({ className, textClass, variant = "default", size, children, disabled, ...props }, ref) => {
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
				className={cn(
					buttonVariants({
						variant,
						size,
						className: cn(
							className,
							disabled && "web:cursor-default",
							disabled && variant === "default" && "bg-[#D9DCDD]",
						),
					}),
				)}
				ref={ref}
				onPressIn={animateGradient}
				onPressOut={resetGradient}
				disabled={disabled}
				{...props}
			>
				{({ pressed }) =>
					variant === "gradient" ? (
						<View
							className="flex-row w-full h-full justify-center items-center"
							style={{ position: "relative" }}
						>
							<LinearGradient
								colors={["#9747FF", "#007EE5"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								className="absolute w-full h-full"
							/>
							<AnimatedLinearGradient
								colors={["#007EE5", "#9747FF"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								className="absolute w-full h-full"
								style={{ opacity: fadeAnim }}
							/>
							<Text
								className={cn(
									pressed && "opacity-70",
									buttonTextVariants({ variant, size, className: textClass }),
								)}
							>
								{children as string | string[]}
							</Text>
						</View>
					) : (
						<Text
							className={cn(
								pressed && "opacity-70",
								buttonTextVariants({ variant, size, className: textClass }),
								disabled && variant === "default" && "text-[#9A9BA2]",
							)}
						>
							{children as string | string[]}
						</Text>
					)
				}
			</Pressable>
		</View>
	)
})
Button.displayName = "Button"

export { Button, buttonTextVariants, buttonVariants }
