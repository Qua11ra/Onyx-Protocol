"use client";
import React from "react";
import ThemeIcon from "@/shared/ui/icons/ThemeIcon";

const SwitchThemeButton = () => {
	function handleSwitch() {
		const theme = document.documentElement.getAttribute("data-theme") === 'light' ? 'dark' : 'light'
		document.documentElement.setAttribute("data-theme", theme)
	}

	return (
		<button
			id="switch-button"
			className={`flex items-center transition-all duration-300 cursor-pointer border rounded-2xl w-15 p-[2px]`}
			onClick={handleSwitch}
			name="theme"
		>
			<div
			id="switch-icon"
				className={`bg-(--bg-primary) transition-all duration-300 rounded-full h-fit border`}
			>
				<ThemeIcon />
			</div>
		</button>
	);
};

export default SwitchThemeButton;

//${isLight ? "justify-start bg-white rounded-2xl" : "justify-end"}
// ${theme == "light" ? "bg-white" : "bg-black rotate-180"}