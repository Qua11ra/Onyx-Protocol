import React from "react";

export type ButtonProps = {
	children: React.ReactNode;
	variant?: "light" | "dark";
	size?: "sm" | "lg" | "md";
	onClick?: () => void;
	disabled?: boolean;
};

const Button = ({
	children,
	variant = "light",
	size = "md",
	onClick,
	disabled = false,
}: ButtonProps) => {
	const baseStyles = "cursor-pointer rounded-lg border-5 border-indigo-950 font-medium transition-colors";

	const variants = {
		"light": "bg-transparent text-indigo-950",
		"dark": "bg-gray-200 text-gray-900"
	};

	const hoverVariants = {
		"light": "hover:bg-indigo-700",
		"dark": "hover:bg-gray-300"
	}

	const sizes = {
		sm: "px-3 py-1.5 text-sm",
		md: "px-4 py-2 text-base",
		lg: "px-6 py-3 text-lg",
	};

	return (
		<button
			className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${hoverVariants[variant]}`}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button