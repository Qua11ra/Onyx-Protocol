import { useTheme } from "@/shared/libs/switchTheme/store/themeContext";
import React from "react";

const ArrowRight = () => {
    const {isLight} = useTheme()
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="24px"
			viewBox="0 -960 960 960"
			width="24px"
			fill={isLight ? "#000" : "#fff"}
		>
			<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
		</svg>
	);
};

export default ArrowRight;
