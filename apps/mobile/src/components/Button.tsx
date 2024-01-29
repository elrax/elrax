import { cva, type VariantProps } from "class-variance-authority"
import React from "react"
import { cn } from "~/utils/style"
import { Pressable, Text, View } from "react-native"
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
			// TODO: check if font is applying
			default: "font-ns-bold font-bold",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
})

const Button = React.forwardRef<
	React.ElementRef<typeof Pressable>,
	React.ComponentPropsWithoutRef<typeof Pressable> &
		VariantProps<typeof buttonVariants> & {
			textClass?: string
		}
>(({ className, textClass, variant = "default", size, children, disabled, ...props }, ref) => {
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
				disabled={disabled}
				{...props}
			>
				{({ pressed }) =>
					variant === "gradient" ? (
						<LinearGradient
							className="flex-row w-full h-full justify-center items-center"
							colors={disabled ? ["#CFA7FB", "#B4CBFC"] : ["#9747FF", "#007EE5"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							<Text
								className={cn(
									pressed && "opacity-70",
									buttonTextVariants({ variant, size, className: textClass }),
								)}
							>
								{children as string | string[]}
							</Text>
						</LinearGradient>
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
